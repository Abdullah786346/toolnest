"""
Application Configuration Module

Centralized configuration management using Pydantic Settings for type-safe
environment variable handling and application settings.

Key Features:
- Type-safe environment variable parsing
- Validation and default values
- Separation of concerns (API, Model, Server configs)
- Production-ready configuration patterns
- Secret management support

Author: AI Infrastructure Team
"""

from typing import List, Optional, Literal
from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict
import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


class Settings(BaseSettings):
    """
    Main application settings with environment variable support.
    
    Behind the Scenes:
    - Pydantic Settings automatically loads from environment variables
    - Type hints ensure configuration values are validated at startup
    - Defaults provide sensible fallbacks for development
    - SettingsConfigDict controls loading behavior (prefix, case sensitivity)
    - Field validators ensure data integrity
    """
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        env_prefix="APP_",
        case_sensitive=False,
        extra="ignore",
        protected_namespaces=()
    )
    
    # Application metadata
    app_name: str = Field(default="AI Chatbot API", description="Application name")
    app_version: str = Field(default="1.0.0", description="Application version")
    app_description: str = Field(
        default="Production-ready AI Chatbot API with streaming support",
        description="Application description"
    )
    debug: bool = Field(default=False, description="Enable debug mode")
    
    # Server configuration
    host: str = Field(default="0.0.0.0", description="Server host address")
    port: int = Field(default=8000, description="Server port")
    workers: int = Field(default=1, description="Number of worker processes")
    
    # CORS configuration
    cors_origins: List[str] = Field(
        default=["*"],
        description="Allowed CORS origins"
    )
    cors_allow_credentials: bool = Field(
        default=True,
        description="Allow CORS credentials"
    )
    cors_allow_methods: List[str] = Field(
        default=["*"],
        description="Allowed CORS methods"
    )
    cors_allow_headers: List[str] = Field(
        default=["*"],
        description="Allowed CORS headers"
    )
    
    # Logging configuration
    log_level: Literal["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"] = Field(
        default="INFO",
        description="Logging level"
    )
    log_format: str = Field(
        default="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        description="Log format string"
    )
    
    @field_validator("cors_origins")
    @classmethod
    def parse_cors_origins(cls, v: List[str]) -> List[str]:
        """
        Parse CORS origins from environment variable.
        
        Behind the Scenes:
        - Environment variables are often comma-separated strings
        - This validator converts them to lists
        - Handles both list and string inputs
        - "*" allows all origins (use carefully in production)
        """
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(",")]
        return v


class ModelSettings(BaseSettings):
    """
    Model-specific configuration for LLM inference.
    
    Behind the Scenes:
    - Separated from main settings for clarity
    - Contains all model loading and inference parameters
    - Supports multiple quantization options
    - Configurable generation parameters
    """
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        env_prefix="MODEL_",
        case_sensitive=False,
        extra="ignore",
        protected_namespaces=(),
        env_ignore_empty=True
    )
    
    # Model path configuration
    model_path: str = Field(
        default="./models/merged-model",
        description="Path to model directory"
    )
    model_name: str = Field(
        default_factory=lambda: os.getenv("MODEL_NAME", "Qwen/Qwen2.5-1.5B-Instruct"),
        description="Hugging Face model name or local path"
    )
    trust_remote_code: bool = Field(
        default=True,
        description="Trust remote code for custom model architectures"
    )
    
    # Quantization configuration
    load_in_8bit: bool = Field(default=False, description="Load model in 8-bit")
    load_in_4bit: bool = Field(default=False, description="Load model in 4-bit")
    device_map: str = Field(
        default="auto",
        description="Device mapping strategy (auto, balanced, etc.)"
    )
    
    # Inference configuration
    torch_dtype: str = Field(
        default="float16",
        description="PyTorch dtype for model (float16, bfloat16, float32)"
    )
    max_model_len: int = Field(
        default=4096,
        description="Maximum sequence length for model"
    )
    
    # Generation parameters
    max_new_tokens: int = Field(
        default=512,
        description="Maximum tokens to generate"
    )
    temperature: float = Field(
        default=0.7,
        description="Sampling temperature (0.0 = greedy, higher = more random)"
    )
    top_p: float = Field(
        default=0.9,
        description="Nucleus sampling threshold"
    )
    top_k: int = Field(
        default=50,
        description="Top-k sampling parameter"
    )
    repetition_penalty: float = Field(
        default=1.0,
        description="Repetition penalty (1.0 = no penalty)"
    )
    do_sample: bool = Field(
        default=True,
        description="Use sampling (False = greedy decoding)"
    )
    
    # Streaming configuration
    stream_chunk_size: int = Field(
        default=2,
        description="Number of tokens per streaming chunk"
    )
    stream_timeout: float = Field(
        default=30.0,
        description="Timeout for streaming responses in seconds"
    )
    
    # Performance configuration
    use_flash_attention: bool = Field(
        default=True,
        description="Use Flash Attention 2 if available"
    )
    compile_model: bool = Field(
        default=False,
        description="Compile model with torch.compile for speed"
    )
    
    @field_validator("temperature", "top_p", "repetition_penalty")
    @classmethod
    def validate_probability(cls, v: float) -> float:
        """Ensure probability-like parameters are non-negative."""
        if v < 0:
            raise ValueError("Value must be non-negative")
        return v
    
    @field_validator("max_new_tokens", "max_model_len", "top_k")
    @classmethod
    def validate_positive_int(cls, v: int) -> int:
        """Ensure integer parameters are positive."""
        if v <= 0:
            raise ValueError("Value must be positive")
        return v


class CacheSettings(BaseSettings):
    """
    Cache configuration for performance optimization.
    
    Behind the Scenes:
    - Supports in-memory and Redis caching
    - Configurable TTL (time-to-live)
    - Cache key patterns for invalidation
    - Memory limits for in-memory cache
    """
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        env_prefix="CACHE_",
        case_sensitive=False,
        extra="ignore"
    )
    
    # Cache configuration
    enabled: bool = Field(default=False, description="Enable caching")
    backend: Literal["memory", "redis"] = Field(
        default="memory",
        description="Cache backend"
    )
    ttl: int = Field(default=300, description="Cache TTL in seconds")
    max_size: int = Field(
        default=1000,
        description="Maximum number of cached items"
    )
    
    # Redis configuration (if backend is redis)
    redis_url: str = Field(
        default="redis://localhost:6379/0",
        description="Redis connection URL"
    )
    redis_password: Optional[str] = Field(
        default=None,
        description="Redis password"
    )


class SecuritySettings(BaseSettings):
    """
    Security configuration for API protection.
    
    Behind the Scenes:
    - API key authentication support
    - Rate limiting configuration
    - Request size limits
    - Secret management
    """
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        env_prefix="SECURITY_",
        case_sensitive=False,
        extra="ignore"
    )
    
    # API key configuration
    api_key_enabled: bool = Field(
        default=False,
        description="Enable API key authentication"
    )
    api_keys: List[str] = Field(
        default=[],
        description="List of valid API keys"
    )
    api_key_header: str = Field(
        default="X-API-Key",
        description="Header name for API key"
    )
    
    # Rate limiting
    rate_limit_enabled: bool = Field(
        default=False,
        description="Enable rate limiting"
    )
    rate_limit_requests: int = Field(
        default=100,
        description="Max requests per window"
    )
    rate_limit_window: int = Field(
        default=60,
        description="Rate limit window in seconds"
    )
    
    # Request limits
    max_request_size: int = Field(
        default=10 * 1024 * 1024,  # 10MB
        description="Maximum request size in bytes"
    )
    
    @field_validator("api_keys")
    @classmethod
    def parse_api_keys(cls, v: List[str]) -> List[str]:
        """Parse API keys from environment variable."""
        if isinstance(v, str):
            return [key.strip() for key in v.split(",")]
        return v


class MonitoringSettings(BaseSettings):
    """
    Monitoring and observability configuration.
    
    Behind the Scenes:
    - Metrics collection support
    - Distributed tracing
    - Health check configuration
    - Performance monitoring
    """
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        env_prefix="MONITORING_",
        case_sensitive=False,
        extra="ignore"
    )
    
    # Metrics configuration
    metrics_enabled: bool = Field(
        default=False,
        description="Enable metrics collection"
    )
    metrics_port: int = Field(
        default=9090,
        description="Port for metrics endpoint"
    )
    
    # Tracing configuration
    tracing_enabled: bool = Field(
        default=False,
        description="Enable distributed tracing"
    )
    tracing_endpoint: str = Field(
        default="http://localhost:4318",
        description="OTLP endpoint for tracing"
    )
    
    # Health check configuration
    health_check_interval: int = Field(
        default=30,
        description="Health check interval in seconds"
    )


# Global settings instances
settings = Settings()
model_settings = ModelSettings()
cache_settings = CacheSettings()
security_settings = SecuritySettings()
monitoring_settings = MonitoringSettings()


def get_settings() -> Settings:
    """
    Get the main application settings.
    
    Behind the Scenes:
    - Factory function for dependency injection
    - Allows easy mocking in tests
    - Follows FastAPI dependency injection pattern
    """
    return settings


def get_model_settings() -> ModelSettings:
    """Get model-specific settings."""
    return model_settings


def get_cache_settings() -> CacheSettings:
    """Get cache settings."""
    return cache_settings


def get_security_settings() -> SecuritySettings:
    """Get security settings."""
    return security_settings


def get_monitoring_settings() -> MonitoringSettings:
    """Get monitoring settings."""
    return monitoring_settings


def print_config():
    """
    Print current configuration (excluding secrets).
    
    Behind the Scenes:
    - Useful for debugging configuration issues
    - Excludes sensitive values (API keys, passwords)
    - Shows which environment variables are being used
    """
    print("=" * 60)
    print("Application Configuration")
    print("=" * 60)
    
    # Print settings
    print("\n[Settings]")
    for key, value in settings.model_dump().items():
        print(f"  {key}: {value}")
    
    print("\n[Model Settings]")
    for key, value in model_settings.model_dump().items():
        print(f"  {key}: {value}")
    
    print("\n[Cache Settings]")
    for key, value in cache_settings.model_dump().items():
        if "password" not in key.lower():
            print(f"  {key}: {value}")
        else:
            print(f"  {key}: ***REDACTED***")
    
    print("\n[Security Settings]")
    for key, value in security_settings.model_dump().items():
        if "key" in key.lower() and isinstance(value, list):
            print(f"  {key}: [***REDACTED***]")
        elif "password" in key.lower():
            print(f"  {key}: ***REDACTED***")
        else:
            print(f"  {key}: {value}")
    
    print("\n[Monitoring Settings]")
    for key, value in monitoring_settings.model_dump().items():
        print(f"  {key}: {value}")
    
    print("=" * 60)


if __name__ == "__main__":
    # Print configuration when run directly
    print_config()
