"""
Chat Router Module

Defines API endpoints for chat completions with streaming and non-streaming support.
Implements OpenAI-compatible API patterns for easy client integration.

Key Features:
- POST /api/v1/chat/completions: Non-streaming completions
- POST /api/v1/chat/stream: Streaming completions (SSE)
- GET /health: Health check endpoint
- OpenAI-compatible request/response formats
- Comprehensive error handling
- Request validation with Pydantic

Author: AI Infrastructure Team
"""

import logging
import json
from typing import AsyncGenerator
from fastapi import APIRouter, HTTPException, Request, status
from fastapi.responses import StreamingResponse
from app.schemas.chat import (
    ChatCompletionRequest,
    ChatCompletionResponse,
    ChatCompletionChunk,
    ErrorResponse,
    HealthCheckResponse,
    StreamEvent
)
from app.services.llm_service import llm_service
from app.core.config import get_settings, get_security_settings


# Configure logging
logger = logging.getLogger(__name__)

# Create router
router = APIRouter(prefix="/api/v1", tags=["chat"])


@router.post(
    "/chat/completions",
    response_model=ChatCompletionResponse,
    status_code=status.HTTP_200_OK,
    summary="Create chat completion",
    description="Generate a non-streaming chat completion response"
)
async def create_chat_completion(
    request: ChatCompletionRequest,
    http_request: Request
) -> ChatCompletionResponse:
    """
    Create a non-streaming chat completion.
    
    Args:
        request: Chat completion request with messages and parameters
        http_request: FastAPI Request object for metadata
        
    Returns:
        ChatCompletionResponse with generated message
        
    Behind the Scenes:
    - Validates request using Pydantic schemas
    - Calls LLM service for generation
    - Returns OpenAI-compatible response
    - Includes token usage statistics
    - Handles errors gracefully
    - Logs request metadata for monitoring
    """
    # Log request
    logger.info(
        f"Chat completion request - messages: {len(request.messages)}, "
        f"model: {request.model}, stream: {request.stream}"
    )
    
    try:
        # Check if streaming was requested (should use stream endpoint)
        if request.stream:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Use /api/v1/chat/stream endpoint for streaming requests"
            )
        
        # Generate completion
        response = await llm_service.create_chat_completion(
            messages=request.messages,
            temperature=request.temperature,
            top_p=request.top_p,
            top_k=request.top_k,
            max_tokens=request.max_tokens,
            repetition_penalty=request.repetition_penalty,
            stop=request.stop,
            stream=False
        )
        
        logger.info(
            f"Chat completion successful - tokens: {response.usage.total_tokens}"
        )
        
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in chat completion: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )


@router.post(
    "/chat/stream",
    summary="Create streaming chat completion",
    description="Generate a streaming chat completion using Server-Sent Events (SSE)"
)
async def create_streaming_completion(
    request: ChatCompletionRequest,
    http_request: Request
) -> StreamingResponse:
    """
    Create a streaming chat completion using SSE.
    
    Args:
        request: Chat completion request with messages and parameters
        http_request: FastAPI Request object for client disconnect detection
        
    Returns:
        StreamingResponse with SSE-formatted chunks
        
    Behind the Scenes:
    - Validates request using Pydantic schemas
    - Uses async generator for streaming
    - Formats chunks as SSE events
    - Detects client disconnects early
    - Yields tokens as they're generated
    - OpenAI-compatible streaming format
    - Handles errors during streaming
    """
    # Log request
    logger.info(
        f"Streaming chat completion request - messages: {len(request.messages)}, "
        f"model: {request.model}"
    )
    
    async def generate_chunks() -> AsyncGenerator[str, None]:
        """
        Generate streaming chunks in SSE format.
        
        Behind the Scenes:
        - Async generator yields SSE-formatted strings
        - Each chunk is a ChatCompletionChunk serialized to JSON
        - SSE format: "data: {json}\n\n"
        - Detects client disconnects to stop generation
        - Handles errors gracefully
        - Yields tokens as they're generated
        """
        try:
            async for chunk in llm_service.stream_chat_completion(
                messages=request.messages,
                temperature=request.temperature,
                top_p=request.top_p,
                top_k=request.top_k,
                max_tokens=request.max_tokens,
                repetition_penalty=request.repetition_penalty,
                stop=request.stop
            ):
                # Check if client disconnected
                if await http_request.is_disconnected():
                    logger.info("Client disconnected, stopping generation")
                    break
                
                # Serialize chunk to JSON
                chunk_json = chunk.model_dump_json()
                
                # Format as SSE event
                sse_event = f"data: {chunk_json}\n\n"
                
                yield sse_event
            
            # Send final [DONE] marker (OpenAI convention)
            yield "data: [DONE]\n\n"
            
            logger.info("Streaming completion successful")
            
        except Exception as e:
            logger.error(f"Error in streaming completion: {e}", exc_info=True)
            
            # Send error as SSE event
            error_response = ErrorResponse.create(
                message=str(e),
                error_type="server_error"
            )
            error_json = error_response.model_dump_json()
            yield f"data: {error_json}\n\n"
    
    # Return streaming response
    return StreamingResponse(
        generate_chunks(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",  # Disable nginx buffering
        }
    )


@router.get(
    "/health",
    response_model=HealthCheckResponse,
    summary="Health check",
    description="Check service health and status"
)
async def health_check() -> HealthCheckResponse:
    """
    Health check endpoint for monitoring and load balancers.
    
    Returns:
        HealthCheckResponse with service status
        
    Behind the Scenes:
    - Checks if model is loaded
    - Returns memory usage statistics
    - Checks GPU availability
    - Returns service uptime
    - Used by monitoring systems
    - Simple endpoint for load balancer health checks
    """
    # Get memory usage
    memory_info = llm_service.get_memory_usage()
    
    # Determine health status
    if not llm_service.is_model_loaded():
        health_status = "degraded"
    else:
        health_status = "healthy"
    
    # Create response
    response = HealthCheckResponse(
        status=health_status,
        model_loaded=llm_service.is_model_loaded(),
        model_name=llm_service.get_model_name(),
        memory_usage=memory_info,
        gpu_available=memory_info["gpu_available"],
        gpu_memory_used=memory_info.get("gpu_memory_used_gb"),
        uptime=llm_service.get_uptime()
    )
    
    return response


@router.get(
    "/models",
    summary="List available models",
    description="List available models (single-model deployment)"
)
async def list_models():
    """
    List available models.
    
    Behind the Scenes:
    - Returns model information
    - OpenAI-compatible format
    - For single-model deployments, returns one model
    - Useful for client discovery
    """
    return {
        "object": "list",
        "data": [
            {
                "id": llm_service.get_model_name() or "default",
                "object": "model",
                "created": int(llm_service.get_uptime()),
                "owned_by": "organization"
            }
        ]
    }


@router.get(
    "/info",
    summary="Service information",
    description="Get service metadata and configuration"
)
async def get_service_info():
    """
    Get service information and configuration.
    
    Behind the Scenes:
    - Returns application metadata
    - Shows configuration (non-sensitive)
    - Useful for debugging and monitoring
    - Exposes version and capabilities
    """
    settings = get_settings()
    
    return {
        "name": settings.app_name,
        "version": settings.app_version,
        "description": settings.app_description,
        "model": llm_service.get_model_name(),
        "model_loaded": llm_service.is_model_loaded(),
        "features": {
            "streaming": True,
            "quantization": {
                "8bit": True,
                "4bit": True
            },
            "flash_attention": True
        }
    }



