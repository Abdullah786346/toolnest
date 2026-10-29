"""
Pydantic Schemas for Chat API

Defines request and response models for the chat completions API.
Follows OpenAI-compatible schema patterns for easy integration.

Key Features:
- Pydantic v2 with strict type validation
- OpenAI-compatible chat message format
- Streaming and non-streaming response schemas
- Comprehensive field validation
- Detailed documentation via docstrings

Author: AI Infrastructure Team
"""

from typing import List, Optional, Literal, Union, Any
from pydantic import BaseModel, Field, field_validator
from enum import Enum


class Role(str, Enum):
    """
    Chat message roles following OpenAI convention.
    
    Behind the Scenes:
    - system: Sets behavior/personality of the assistant
    - user: Human messages or instructions
    - assistant: Model responses (for conversation history)
    - String enum for JSON serialization compatibility
    """
    SYSTEM = "system"
    USER = "user"
    ASSISTANT = "assistant"


class ChatMessage(BaseModel):
    """
    Individual chat message in a conversation.
    
    Behind the Scenes:
    - Content can be string or list (for multimodal support)
    - Role is required for message categorization
    - Name field for speaker identification in multi-user scenarios
    - Used for both input (user messages) and output (assistant responses)
    - Content can be empty for streaming final chunks
    """
    role: Role = Field(
        ...,
        description="The role of the message author"
    )
    content: str = Field(
        default="",
        description="The content of the message"
    )
    name: Optional[str] = Field(
        default=None,
        description="Optional name of the message author"
    )
    
    @field_validator("content")
    @classmethod
    def validate_content(cls, v: str, info) -> str:
        """Validate content - required for user messages, optional for assistant."""
        # Get the role from the field values
        field_values = info.data
        role = field_values.get("role") if field_values else None
        
        if role == Role.USER and not v.strip():
            raise ValueError("User message content cannot be empty")
        return v
    
    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "role": "user",
                    "content": "Hello, how are you?"
                }
            ]
        }
    }


class ChatCompletionRequest(BaseModel):
    """
    Request schema for chat completion endpoint.
    
    Behind the Scenes:
    - Compatible with OpenAI Chat Completions API format
    - messages: Conversation history including current prompt
    - model: Model identifier (can be ignored in single-model deployment)
    - generation parameters: Control output diversity and length
    - stream: Toggle between streaming and non-streaming responses
    - stop: Sequences that stop generation when encountered
    """
    
    messages: List[ChatMessage] = Field(
        ...,
        description="List of messages in the conversation",
        min_length=1
    )
    model: Optional[str] = Field(
        default=None,
        description="Model identifier (optional for single-model deployments)"
    )
    
    # Generation parameters
    temperature: float = Field(
        default=0.7,
        ge=0.0,
        le=2.0,
        description="Sampling temperature (0.0 = greedy, 2.0 = very random)"
    )
    top_p: float = Field(
        default=0.9,
        ge=0.0,
        le=1.0,
        description="Nucleus sampling threshold"
    )
    top_k: int = Field(
        default=50,
        ge=0,
        description="Top-k sampling parameter (0 = disabled)"
    )
    max_tokens: int = Field(
        default=512,
        ge=1,
        description="Maximum tokens to generate"
    )
    repetition_penalty: float = Field(
        default=1.0,
        ge=0.0,
        description="Repetition penalty (1.0 = no penalty)"
    )
    
    # Streaming and control
    stream: bool = Field(
        default=False,
        description="Enable streaming responses"
    )
    stop: Optional[Union[str, List[str]]] = Field(
        default=None,
        description="Stop sequences to end generation"
    )
    presence_penalty: float = Field(
        default=0.0,
        ge=-2.0,
        le=2.0,
        description="Presence penalty for new topics"
    )
    frequency_penalty: float = Field(
        default=0.0,
        ge=-2.0,
        le=2.0,
        description="Frequency penalty for repetition"
    )
    
    # Advanced options
    seed: Optional[int] = Field(
        default=None,
        description="Random seed for reproducible generation"
    )
    n: int = Field(
        default=1,
        ge=1,
        description="Number of completions to generate (not fully supported)"
    )
    
    @field_validator("messages")
    @classmethod
    def validate_messages(cls, v: List[ChatMessage]) -> List[ChatMessage]:
        """
        Validate message sequence and role alternation.
        
        Behind the Scenes:
        - Ensures conversation starts with user or system message
        - Validates role alternation (user -> assistant -> user)
        - Prevents consecutive assistant messages (invalid for completion)
        - Ensures last message is from user (for completion)
        """
        if not v:
            raise ValueError("Messages list cannot be empty")
        
        # Check first message
        if v[0].role not in [Role.SYSTEM, Role.USER]:
            raise ValueError("Conversation must start with system or user message")
        
        # Check role alternation
        for i in range(1, len(v)):
            if v[i].role == v[i-1].role:
                if v[i].role == Role.ASSISTANT:
                    raise ValueError(
                        f"Consecutive assistant messages at positions {i-1} and {i}"
                    )
        
        # Ensure last message is from user
        if v[-1].role != Role.USER:
            raise ValueError("Last message must be from user")
        
        return v
    
    @field_validator("stop")
    @classmethod
    def validate_stop(cls, v: Optional[Union[str, List[str]]]) -> Optional[List[str]]:
        """Normalize stop sequences to list format."""
        if v is None:
            return None
        if isinstance(v, str):
            return [v]
        return v
    
    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "messages": [
                        {"role": "system", "content": "You are a helpful assistant."},
                        {"role": "user", "content": "What is the capital of France?"}
                    ],
                    "temperature": 0.7,
                    "max_tokens": 100
                }
            ]
        }
    }


class ChatCompletionChoice(BaseModel):
    """
    Single completion choice in the response.
    
    Behind the Scenes:
    - Contains the generated message
    - finish_reason indicates why generation stopped
    - index for ordering when n > 1 (not fully supported)
    - OpenAI-compatible structure
    """
    index: int = Field(
        default=0,
        description="Choice index"
    )
    message: ChatMessage = Field(
        ...,
        description="Generated message"
    )
    finish_reason: Literal["stop", "length", "content_filter"] = Field(
        ...,
        description="Reason generation stopped"
    )


class ChatCompletionUsage(BaseModel):
    """
    Token usage statistics for the request.
    
    Behind the Scenes:
    - prompt_tokens: Tokens in input messages
    - completion_tokens: Tokens in generated response
    - total_tokens: Sum of both
    - Useful for cost tracking and rate limiting
    - OpenAI-compatible format
    """
    prompt_tokens: int = Field(
        ...,
        ge=0,
        description="Number of tokens in the prompt"
    )
    completion_tokens: int = Field(
        ...,
        ge=0,
        description="Number of tokens in the completion"
    )
    total_tokens: int = Field(
        ...,
        ge=0,
        description="Total tokens used"
    )


class ChatCompletionResponse(BaseModel):
    """
    Response schema for non-streaming chat completion.
    
    Behind the Scenes:
    - id: Unique identifier for the response
    - object: Type of object (always "chat.completion")
    - created: Unix timestamp of generation
    - model: Model identifier used
    - choices: List of generated completions
    - usage: Token usage statistics
    - OpenAI-compatible for easy client integration
    """
    id: str = Field(
        ...,
        description="Unique identifier for the completion"
    )
    object: Literal["chat.completion"] = Field(
        default="chat.completion",
        description="Object type"
    )
    created: int = Field(
        ...,
        description="Unix timestamp of creation"
    )
    model: str = Field(
        ...,
        description="Model identifier"
    )
    choices: List[ChatCompletionChoice] = Field(
        ...,
        description="List of completion choices"
    )
    usage: ChatCompletionUsage = Field(
        ...,
        description="Token usage statistics"
    )


class ChatCompletionChunk(BaseModel):
    """
    Response schema for streaming chat completion (SSE).
    
    Behind the Scenes:
    - Similar to ChatCompletionResponse but for streaming
    - delta contains partial message content
    - finish_reason only present in final chunk
    - Sent as Server-Sent Events (SSE)
    - OpenAI-compatible streaming format
    """
    id: str = Field(
        ...,
        description="Unique identifier for the completion"
    )
    object: Literal["chat.completion.chunk"] = Field(
        default="chat.completion.chunk",
        description="Object type"
    )
    created: int = Field(
        ...,
        description="Unix timestamp of creation"
    )
    model: str = Field(
        ...,
        description="Model identifier"
    )
    choices: List[ChatCompletionChoice] = Field(
        ...,
        description="List of completion choices (partial)"
    )


class HealthCheckResponse(BaseModel):
    """
    Response schema for health check endpoint.
    
    Behind the Scenes:
    - status: Overall health status
    - model_loaded: Whether model is loaded
    - memory_usage: Memory statistics
    - gpu_available: GPU availability status
    - uptime: Server uptime in seconds
    """
    status: Literal["healthy", "unhealthy", "degraded"] = Field(
        ...,
        description="Overall health status"
    )
    model_loaded: bool = Field(
        ...,
        description="Whether the model is loaded"
    )
    model_name: Optional[str] = Field(
        default=None,
        description="Name of loaded model"
    )
    memory_usage: Optional[dict] = Field(
        default=None,
        description="Memory usage statistics"
    )
    gpu_available: bool = Field(
        ...,
        description="GPU availability"
    )
    gpu_memory_used: Optional[float] = Field(
        default=None,
        description="GPU memory used in GB"
    )
    uptime: float = Field(
        ...,
        description="Server uptime in seconds"
    )


class ErrorResponse(BaseModel):
    """
    Standard error response schema.
    
    Behind the Scenes:
    - error: Detailed error information
    - type: Error type/category
    - message: Human-readable error message
    - param: Parameter that caused the error (if applicable)
    - code: HTTP status code
    - OpenAI-compatible error format
    """
    error: dict = Field(
        ...,
        description="Error details"
    )
    
    @classmethod
    def create(
        cls,
        message: str,
        error_type: str = "invalid_request_error",
        param: Optional[str] = None,
        code: Optional[int] = None
    ) -> "ErrorResponse":
        """
        Factory method to create error response.
        
        Behind the Scenes:
        - Simplifies error response creation
        - Provides consistent error format
        - Handles optional parameters gracefully
        """
        error_data = {
            "message": message,
            "type": error_type,
        }
        
        if param is not None:
            error_data["param"] = param
        if code is not None:
            error_data["code"] = code
        
        return cls(error=error_data)


class StreamEvent(BaseModel):
    """
    Server-Sent Event (SSE) format for streaming.
    
    Behind the Scenes:
    - event: Event type (default "message")
    - data: JSON-serialized chunk data
    - id: Optional event ID for reconnection
    - retry: Reconnection delay in milliseconds
    - SSE format requires specific structure
    """
    event: str = Field(
        default="message",
        description="Event type"
    )
    data: str = Field(
        ...,
        description="JSON-serialized data"
    )
    id: Optional[str] = Field(
        default=None,
        description="Event ID for reconnection"
    )
    retry: Optional[int] = Field(
        default=None,
        description="Reconnection delay in milliseconds"
    )
    
    def format_sse(self) -> str:
        """
        Format as SSE string.
        
        Behind the Scenes:
        - SSE format: "event: {event}\ndata: {data}\n\n"
        - Double newline separates events
        - ID and retry are optional
        - Used for streaming responses
        """
        lines = []
        if self.event:
            lines.append(f"event: {self.event}")
        if self.id:
            lines.append(f"id: {self.id}")
        if self.retry:
            lines.append(f"retry: {self.retry}")
        lines.append(f"data: {self.data}")
        lines.append("")  # Empty line to end event
        return "\n".join(lines)
