"""
FastAPI Application Main Module

Main application entry point with middleware, routing, and configuration.
Implements production-ready patterns for enterprise AI services.

Key Features:
- CORS middleware configuration
- Global exception handlers
- Custom logging middleware
- API key authentication (optional)
- Rate limiting (optional)
- OpenAPI/Swagger documentation
- Health check endpoints
- Graceful shutdown handling

Author: AI Infrastructure Team
"""

import logging
import sys
import time
from contextlib import asynccontextmanager
from pathlib import Path
from fastapi import FastAPI, Request, status, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
import uvicorn

from app.core.config import (
    get_settings,
    get_model_settings,
    get_security_settings
)
from app.routers.chat_router import router as chat_router
from app.services.llm_service import llm_service


# Configure logging
def setup_logging():
    """
    Configure application logging.
    
    Behind the Scenes:
    - Sets up root logger with specified level
    - Uses format from configuration
    - Configures handlers for console output
    - Can be extended for file logging, Sentry, etc.
    """
    settings = get_settings()
    
    logging.basicConfig(
        level=getattr(logging, settings.log_level),
        format=settings.log_format,
        handlers=[
            logging.StreamHandler(sys.stdout)
        ]
    )
    
    logger = logging.getLogger(__name__)
    logger.info(f"Logging configured at {settings.log_level} level")


setup_logging()
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan manager for startup and shutdown events.
    
    Behind the Scenes:
    - Startup: Preload model, initialize connections
    - Shutdown: Cleanup resources, close connections
    - Async context manager for proper async handling
    - Graceful shutdown prevents data loss
    - Warmup model for faster first request
    """
    # Startup
    logger.info("=" * 60)
    logger.info("Starting AI Chatbot API")
    logger.info("=" * 60)
    
    settings = get_settings()
    logger.info(f"Application: {settings.app_name} v{settings.app_version}")
    logger.info(f"Debug mode: {settings.debug}")
    
    # Preload model if configured
    try:
        logger.info("Preloading model...")
        await llm_service.load_model()
        logger.info("Model preloaded successfully")
    except Exception as e:
        logger.error(f"Error preloading model: {e}", exc_info=True)
        if not settings.debug:
            logger.warning("Continuing without preloaded model (will load on first request)")
    
    logger.info("Application startup complete")
    logger.info("=" * 60)
    
    yield
    
    # Shutdown
    logger.info("Shutting down application...")
    logger.info("Application shutdown complete")


# Create FastAPI application
app = FastAPI(
    title=get_settings().app_name,
    description=get_settings().app_description,
    version=get_settings().app_version,
    docs_url="/docs" if get_settings().debug else None,
    redoc_url="/redoc" if get_settings().debug else None,
    openapi_url="/openapi.json" if get_settings().debug else None,
    lifespan=lifespan
)


# Add CORS middleware
def setup_cors():
    """
    Configure CORS middleware for cross-origin requests.
    
    Behind the Scenes:
    - Allows specified origins to access the API
    - Credentials support for cookies/auth headers
    - Methods and headers configuration
    - Wildcard "*" allows all origins (use carefully in production)
    - Configured via environment variables
    """
    settings = get_settings()
    
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=settings.cors_allow_credentials,
        allow_methods=settings.cors_allow_methods,
        allow_headers=settings.cors_allow_headers,
    )
    
    logger.info(f"CORS configured for origins: {settings.cors_origins}")


setup_cors()


# Add GZip middleware for response compression
app.add_middleware(GZipMiddleware, minimum_size=1000)


# Custom logging middleware
@app.middleware("http")
async def logging_middleware(request: Request, call_next):
    """
    Log all HTTP requests and responses.
    
    Behind the Scenes:
    - Logs request method, path, and client IP
    - Measures request processing time
    - Logs response status code
    - Useful for debugging and monitoring
    - Can be extended for audit logging
    """
    start_time = time.time()
    
    # Log request
    logger.info(
        f"Request: {request.method} {request.url.path} "
        f"from {request.client.host if request.client else 'unknown'}"
    )
    
    # Process request
    response = await call_next(request)
    
    # Log response
    process_time = time.time() - start_time
    logger.info(
        f"Response: {response.status_code} "
        f"(took {process_time:.3f}s)"
    )
    
    # Add process time header
    response.headers["X-Process-Time"] = str(process_time)
    
    return response


# API key authentication middleware (optional)
@app.middleware("http")
async def api_key_middleware(request: Request, call_next):
    """
    Optional API key authentication middleware.
    
    Behind the Scenes:
    - Checks for API key in headers if enabled
    - Validates against configured keys
    - Skips health check endpoints
    - Returns 401 if authentication fails
    - Configured via environment variables
    """
    security_settings = get_security_settings()
    
    # Skip if authentication disabled
    if not security_settings.api_key_enabled:
        return await call_next(request)
    
    # Skip health check endpoints
    if request.url.path in ["/health", "/api/v1/health"]:
        return await call_next(request)
    
    # Check for API key
    api_key = request.headers.get(security_settings.api_key_header)
    
    if not api_key:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="API key required"
        )
    
    if api_key not in security_settings.api_keys:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid API key"
        )
    
    return await call_next(request)


# Include routers
app.include_router(chat_router)

# Mount static files for chatbot UI
static_dir = Path(__file__).parent.parent / "static"
if static_dir.exists():
    app.mount("/static", StaticFiles(directory=str(static_dir)), name="static")


# Root endpoint - serve chatbot UI
@app.get("/", include_in_schema=False)
async def root():
    """
    Root endpoint - serves the chatbot UI.
    
    Behind the Scenes:
    - Returns HTML chatbot interface
    - Provides user-friendly web interface
    - Redirects to static HTML file
    """
    from fastapi.responses import HTMLResponse
    static_dir = Path(__file__).parent.parent / "static"
    html_file = static_dir / "index.html"
    
    if html_file.exists():
        with open(html_file, 'r', encoding='utf-8') as f:
            return HTMLResponse(content=f.read())
    else:
        settings = get_settings()
        return {
            "name": settings.app_name,
            "version": settings.app_version,
            "status": "running",
            "chatbot_ui": "not found"
        }


# Router exception handler
@app.exception_handler(Exception)
async def router_exception_handler(request: Request, exc: Exception):
    """
    Handle all unhandled exceptions from routers.
    
    Behind the Scenes:
    - Catches any unhandled exception
    - Logs full stack trace for debugging
    - Returns generic error message (no stack traces to client)
    - HTTP 500 status code
    - Prevents exposing internals to clients
    """
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": {
                "message": "Internal server error",
                "type": "server_error"
            }
        }
    )


# Global exception handlers
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """
    Handle Pydantic validation errors.
    
    Behind the Scenes:
    - Catches request validation errors
    - Returns detailed error information
    - Includes field names and error messages
    - HTTP 422 status code for validation errors
    - OpenAI-compatible error format
    """
    logger.warning(f"Validation error: {exc.errors()}")
    
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "error": {
                "message": "Validation error",
                "type": "validation_error",
                "details": exc.errors()
            }
        }
    )


@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    """
    Handle HTTP exceptions.
    
    Behind the Scenes:
    - Catches HTTP exceptions raised in endpoints
    - Returns standardized error response
    - Logs error for debugging
    - Maintains HTTP status code
    - OpenAI-compatible error format
    """
    logger.warning(f"HTTP exception: {exc.status_code} - {exc.detail}")
    
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": {
                "message": exc.detail,
                "type": "http_error",
                "code": exc.status_code
            }
        }
    )





def main():
    """
    Entry point for running the application.
    
    Behind the Scenes:
    - Loads configuration
    - Configures Uvicorn server
    - Runs with multiple workers if configured
    - Handles graceful shutdown
    - Production-ready server configuration
    """
    settings = get_settings()
    
    logger.info(f"Starting server on {settings.host}:{settings.port}")
    
    uvicorn.run(
        "app.main:app",
        host=settings.host,
        port=settings.port,
        workers=settings.workers,
        log_level=settings.log_level.lower(),
        reload=settings.debug,
        access_log=True
    )


if __name__ == "__main__":
    main()
