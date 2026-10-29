"""
LLM Inference Service

Handles model loading, text generation, and streaming responses using
Hugging Face Transformers with asynchronous support for low-latency inference.

Key Features:
- Asynchronous model loading and inference
- Streaming generation with TextIteratorStreamer
- ChatML format support for instruction-tuned models
- Memory-efficient model loading with quantization
- Thread-safe concurrent request handling
- Comprehensive error handling and logging

Author: AI Infrastructure Team
"""

import asyncio
import logging
import time
import uuid
from typing import Optional, AsyncGenerator, Dict, Any
from threading import Thread
import torch
from transformers import (
    AutoModelForCausalLM,
    AutoTokenizer,
    TextIteratorStreamer,
    GenerationConfig,
    BitsAndBytesConfig
)
from app.core.config import get_model_settings
from app.schemas.chat import (
    ChatMessage,
    ChatCompletionResponse,
    ChatCompletionChoice,
    ChatCompletionChunk,
    ChatCompletionUsage,
    Role
)


# Configure logging
logger = logging.getLogger(__name__)


class LLMService:
    """
    Core inference service for LLM text generation.
    
    Behind the Scenes:
    - Singleton pattern ensures model loaded once
    - Async methods for non-blocking I/O
    - Thread-based streaming for CPU-bound generation
    - Thread-safe model access for concurrent requests
    - Automatic ChatML formatting for instruction models
    - Memory optimization with quantization
    """
    
    _instance: Optional["LLMService"] = None
    _lock = asyncio.Lock()
    
    def __new__(cls):
        """
        Singleton pattern to ensure single model instance.
        
        Behind the Scenes:
        - Model loading is expensive (GBs of memory, seconds of time)
        - Singleton prevents multiple model instances
        - Async lock ensures thread-safe initialization
        - Pattern commonly used in production ML services
        """
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance
    
    def __init__(self):
        """
        Initialize the LLM service.
        
        Behind the Scenes:
        - Lazy loading: model loaded on first request
        - Configuration from environment variables
        - Device detection and optimization
        - Thread safety for concurrent requests
        """
        if hasattr(self, "_initialized"):
            return
        
        self._initialized = True
        self._model: Optional[AutoModelForCausalLM] = None
        self._tokenizer: Optional[AutoTokenizer] = None
        self._device: Optional[torch.device] = None
        self._model_name: Optional[str] = None
        self._generation_config: Optional[GenerationConfig] = None
        self._load_lock = asyncio.Lock()
        
        self._settings = get_model_settings()
        logger.info(f"Model name from config: {self._settings.model_name}")
        self._start_time = time.time()
        
        logger.info("LLM Service initialized (model not loaded yet)")
    
    async def load_model(self) -> None:
        """
        Load the model and tokenizer asynchronously.
        
        Behind the Scenes:
        - Async method to avoid blocking event loop
        - Lock prevents concurrent loading attempts
        - Runs in thread pool to avoid blocking
        - Quantization reduces memory footprint
        - Automatic device detection (CUDA/CPU)
        - Flash Attention 2 for faster inference
        """
        async with self._load_lock:
            if self._model is not None:
                logger.info("Model already loaded")
                return
            
            logger.info(f"Loading model: {self._settings.model_name}")
            
            # Run model loading in thread pool to avoid blocking
            loop = asyncio.get_event_loop()
            await loop.run_in_executor(None, self._load_model_sync)
            
            logger.info("Model loaded successfully")
    
    def _load_model_sync(self) -> None:
        """
        Synchronous model loading (runs in thread pool).
        
        Behind the Scenes:
        - Called from async load_model via executor
        - Handles device detection and configuration
        - Applies quantization if configured
        - Sets up generation config
        - Loads tokenizer with proper padding
        """
        # Detect device
        if torch.cuda.is_available():
            self._device = torch.device("cuda")
            device_name = torch.cuda.get_device_name(0)
            logger.info(f"Using CUDA device: {device_name}")
        else:
            self._device = torch.device("cpu")
            logger.warning("CUDA not available, using CPU")
        
        # Configure quantization
        load_kwargs = {
            "torch_dtype": getattr(torch, self._settings.torch_dtype),
            "device_map": self._settings.device_map,
            "trust_remote_code": self._settings.trust_remote_code,
        }
        
        if self._settings.load_in_8bit:
            load_kwargs["load_in_8bit"] = True
            logger.info("Loading model with 8-bit quantization")
        elif self._settings.load_in_4bit:
            load_kwargs["quantization_config"] = BitsAndBytesConfig(
                load_in_4bit=True,
                bnb_4bit_compute_dtype=torch.float16,
                bnb_4bit_quant_type="nf4",
            )
            logger.info("Loading model with 4-bit quantization")
        
        # Add Flash Attention if available
        if self._settings.use_flash_attention and self._device.type == "cuda":
            load_kwargs["attn_implementation"] = "flash_attention_2"
            logger.info("Using Flash Attention 2")
        
        # Load model
        self._model = AutoModelForCausalLM.from_pretrained(
            self._settings.model_name,
            **load_kwargs
        )
        
        # Load tokenizer
        self._tokenizer = AutoTokenizer.from_pretrained(
            self._settings.model_name,
            trust_remote_code=self._settings.trust_remote_code,
        )
        
        # Configure tokenizer
        if self._tokenizer.pad_token is None:
            if self._tokenizer.eos_token is not None:
                self._tokenizer.pad_token = self._tokenizer.eos_token
            else:
                self._tokenizer.add_special_tokens({"pad_token": "[PAD]"})
        
        self._tokenizer.padding_side = "right"
        
        # Set model name
        self._model_name = self._settings.model_name
        
        # Compile model if requested (PyTorch 2.0+)
        if self._settings.compile_model:
            logger.info("Compiling model with torch.compile")
            self._model = torch.compile(self._model)
        
        # Set model to eval mode
        self._model.eval()
    
    def _format_messages(self, messages: list[ChatMessage]) -> str:
        """
        Format messages into appropriate format for the model.
        
        Args:
            messages: List of chat messages
            
        Returns:
            Formatted string for the model
            
        Behind the Scenes:
        - For instruction models (Qwen, Llama Chat): Uses ChatML format
        - For base models (GPT-2): Simple concatenation
        - Detects model type based on name
        - Handles system, user, and assistant roles appropriately
        """
        # Check if this is an instruction-tuned model that supports ChatML
        is_instruction_model = any(
            name in self._model_name.lower()
            for name in ['qwen', 'llama', 'mistral', 'chat']
        )
        
        if is_instruction_model:
            # ChatML format for instruction models
            formatted_parts = []
            for msg in messages:
                role = msg.role.value
                content = msg.content
                formatted_parts.append(f"<|im_start|>{role}\n{content}<|im_end|>")
            formatted_parts.append("<|im_start|>assistant")
            return "\n".join(formatted_parts)
        else:
            # Simple format for base models like GPT-2
            # Just concatenate user messages with newlines
            formatted_parts = []
            for msg in messages:
                if msg.role.value == "user":
                    formatted_parts.append(msg.content)
                elif msg.role.value == "assistant":
                    formatted_parts.append(msg.content)
            return "\n".join(formatted_parts)
    
    def _count_tokens(self, text: str) -> int:
        """
        Count tokens in text using the tokenizer.
        
        Behind the Scenes:
        - Tokenizes text and returns length
        - Used for usage statistics
        - Helps with rate limiting and cost tracking
        - Accounts for special tokens
        """
        if self._tokenizer is None:
            return len(text) // 4  # Fallback estimate
        
        tokens = self._tokenizer.encode(text, add_special_tokens=False)
        return len(tokens)
    
    async def generate(
        self,
        messages: list[ChatMessage],
        temperature: Optional[float] = None,
        top_p: Optional[float] = None,
        top_k: Optional[int] = None,
        max_tokens: Optional[int] = None,
        repetition_penalty: Optional[float] = None,
        stop: Optional[list[str]] = None,
        stream: bool = False
    ) -> AsyncGenerator[str, None]:
        """
        Generate text completion for given messages.
        
        Args:
            messages: Conversation history
            temperature: Sampling temperature
            top_p: Nucleus sampling threshold
            top_k: Top-k sampling parameter
            max_tokens: Maximum tokens to generate
            repetition_penalty: Repetition penalty
            stop: Stop sequences
            stream: Enable streaming
            
        Yields:
            Generated text chunks (if streaming)
            
        Behind the Scenes:
        - Formats messages into ChatML
        - Tokenizes input
        - Generates with requested parameters
        - Streams tokens as they're generated
        - Handles stop sequences
        - Thread-based streaming for CPU-bound work
        """
        # Ensure model is loaded
        await self.load_model()
        
        # Use defaults from config if not provided
        temperature = temperature or self._settings.temperature
        top_p = top_p or self._settings.top_p
        top_k = top_k or self._settings.top_k
        max_tokens = max_tokens or self._settings.max_new_tokens
        repetition_penalty = repetition_penalty or self._settings.repetition_penalty
        
        # Format messages
        prompt = self._format_messages(messages)
        
        # Tokenize
        inputs = self._tokenizer(
            prompt,
            return_tensors="pt",
            padding=True,
            truncation=True,
            max_length=self._settings.max_model_len - max_tokens
        ).to(self._device)
        
        prompt_tokens = inputs["input_ids"].shape[1]
        
        # Setup generation parameters
        generation_kwargs = {
            "input_ids": inputs["input_ids"],
            "attention_mask": inputs["attention_mask"],
            "max_new_tokens": max_tokens,
            "temperature": temperature,
            "top_p": top_p,
            "top_k": top_k,
            "repetition_penalty": repetition_penalty,
            "do_sample": temperature > 0,
            "pad_token_id": self._tokenizer.pad_token_id,
            "eos_token_id": self._tokenizer.eos_token_id,
        }
        
        if stop:
            generation_kwargs["stop_strings"] = stop
        
        if stream:
            # Streaming generation
            streamer = TextIteratorStreamer(
                self._tokenizer,
                skip_prompt=True,
                skip_special_tokens=True
            )
            
            generation_kwargs["streamer"] = streamer
            
            # Run generation in thread
            def generate_in_thread():
                with torch.no_grad():
                    self._model.generate(**generation_kwargs)
            
            thread = Thread(target=generate_in_thread)
            thread.start()
            
            # Yield tokens as they're generated
            for text_chunk in streamer:
                yield text_chunk
            
            thread.join()
        else:
            # Non-streaming generation
            loop = asyncio.get_event_loop()
            outputs = await loop.run_in_executor(
                None,
                lambda: self._model.generate(**generation_kwargs)
            )
            
            # Decode output
            generated_text = self._tokenizer.decode(
                outputs[0][prompt_tokens:],
                skip_special_tokens=True
            )
            
            yield generated_text
    
    async def create_chat_completion(
        self,
        messages: list[ChatMessage],
        temperature: Optional[float] = None,
        top_p: Optional[float] = None,
        top_k: Optional[int] = None,
        max_tokens: Optional[int] = None,
        repetition_penalty: Optional[float] = None,
        stop: Optional[list[str]] = None,
        stream: bool = False
    ) -> ChatCompletionResponse:
        """
        Create a chat completion response.
        
        Args:
            messages: Conversation history
            temperature: Sampling temperature
            top_p: Nucleus sampling threshold
            top_k: Top-k sampling parameter
            max_tokens: Maximum tokens to generate
            repetition_penalty: Repetition penalty
            stop: Stop sequences
            stream: Enable streaming (ignored, use stream endpoint)
            
        Returns:
            ChatCompletionResponse with generated message
            
        Behind the Scenes:
        - Generates completion
        - Counts tokens for usage statistics
        - Creates OpenAI-compatible response
        - Includes finish reason
        - Tracks generation time
        """
        completion_id = str(uuid.uuid4())
        created = int(time.time())
        
        # Format messages for token counting
        prompt_text = self._format_messages(messages)
        prompt_tokens = self._count_tokens(prompt_text)
        
        # Generate response
        generated_text = ""
        async for chunk in self.generate(
            messages=messages,
            temperature=temperature,
            top_p=top_p,
            top_k=top_k,
            max_tokens=max_tokens,
            repetition_penalty=repetition_penalty,
            stop=stop,
            stream=False
        ):
            generated_text += chunk
        
        completion_tokens = self._count_tokens(generated_text)
        
        # Determine finish reason
        finish_reason = "stop"
        if completion_tokens >= (max_tokens or self._settings.max_new_tokens):
            finish_reason = "length"
        
        # Create response
        response = ChatCompletionResponse(
            id=completion_id,
            object="chat.completion",
            created=created,
            model=self._model_name or "unknown",
            choices=[
                ChatCompletionChoice(
                    index=0,
                    message=ChatMessage(
                        role=Role.ASSISTANT,
                        content=generated_text
                    ),
                    finish_reason=finish_reason
                )
            ],
            usage=ChatCompletionUsage(
                prompt_tokens=prompt_tokens,
                completion_tokens=completion_tokens,
                total_tokens=prompt_tokens + completion_tokens
            )
        )
        
        return response
    
    async def stream_chat_completion(
        self,
        messages: list[ChatMessage],
        temperature: Optional[float] = None,
        top_p: Optional[float] = None,
        top_k: Optional[int] = None,
        max_tokens: Optional[int] = None,
        repetition_penalty: Optional[float] = None,
        stop: Optional[list[str]] = None
    ) -> AsyncGenerator[ChatCompletionChunk, None]:
        """
        Stream chat completion chunks.
        
        Args:
            messages: Conversation history
            temperature: Sampling temperature
            top_p: Nucleus sampling threshold
            top_k: Top-k sampling parameter
            max_tokens: Maximum tokens to generate
            repetition_penalty: Repetition penalty
            stop: Stop sequences
            
        Yields:
            ChatCompletionChunk with partial content
            
        Behind the Scenes:
        - Generates with streaming enabled
        - Yields chunks as tokens are generated
        - Each chunk contains delta (new content)
        - OpenAI-compatible streaming format
        - Includes finish reason in final chunk
        """
        completion_id = str(uuid.uuid4())
        created = int(time.time())
        
        # Format messages for token counting
        prompt_text = self._format_messages(messages)
        prompt_tokens = self._count_tokens(prompt_text)
        
        accumulated_text = ""
        completion_tokens = 0
        
        async for chunk in self.generate(
            messages=messages,
            temperature=temperature,
            top_p=top_p,
            top_k=top_k,
            max_tokens=max_tokens,
            repetition_penalty=repetition_penalty,
            stop=stop,
            stream=True
        ):
            accumulated_text += chunk
            completion_tokens = self._count_tokens(accumulated_text)
            
            yield ChatCompletionChunk(
                id=completion_id,
                object="chat.completion.chunk",
                created=created,
                model=self._model_name or "unknown",
                choices=[
                    ChatCompletionChoice(
                        index=0,
                        message=ChatMessage(
                            role=Role.ASSISTANT,
                            content=chunk
                        ),
                        finish_reason="stop"  # Will be updated in final chunk
                    )
                ]
            )
        
        # Final chunk with finish reason (no content)
        # OpenAI convention: final chunk has empty content and finish_reason
        yield ChatCompletionChunk(
            id=completion_id,
            object="chat.completion.chunk",
            created=created,
            model=self._model_name or "unknown",
            choices=[
                ChatCompletionChoice(
                    index=0,
                    message=ChatMessage(
                        role=Role.ASSISTANT,
                        content=""
                    ),
                    finish_reason="stop"
                )
            ]
        )
    
    def get_memory_usage(self) -> Dict[str, Any]:
        """
        Get current memory usage statistics.
        
        Behind the Scenes:
        - Returns RAM and GPU memory usage
        - Useful for health checks and monitoring
        - Helps with capacity planning
        - Detects memory leaks
        """
        memory_info = {
            "ram_used_gb": 0.0,
            "ram_total_gb": 0.0,
            "gpu_available": False,
            "gpu_memory_used_gb": 0.0,
            "gpu_memory_total_gb": 0.0,
        }
        
        try:
            import psutil
            memory_info["ram_used_gb"] = psutil.virtual_memory().used / (1024**3)
            memory_info["ram_total_gb"] = psutil.virtual_memory().total / (1024**3)
        except ImportError:
            logger.warning("psutil not available for RAM monitoring")
        
        if torch.cuda.is_available():
            memory_info["gpu_available"] = True
            memory_info["gpu_memory_used_gb"] = (
                torch.cuda.memory_allocated() / (1024**3)
            )
            memory_info["gpu_memory_total_gb"] = (
                torch.cuda.get_device_properties(0).total_memory / (1024**3)
            )
        
        return memory_info
    
    def get_uptime(self) -> float:
        """Get service uptime in seconds."""
        return time.time() - self._start_time
    
    def is_model_loaded(self) -> bool:
        """Check if model is loaded."""
        return self._model is not None
    
    def get_model_name(self) -> Optional[str]:
        """Get the name of the loaded model."""
        return self._model_name


# Global service instance
llm_service = LLMService()
