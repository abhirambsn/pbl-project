from typing import Awaitable, Callable
from fastapi import Request
from starlette.responses import Response
from ..util import Logger
from starlette.middleware.base import BaseHTTPMiddleware
import uuid

class LoggingMiddleware(BaseHTTPMiddleware):
    def __init__(self, app):
        super().__init__(app)
        self.logger = Logger("rag-api-log-middleware")

    async def dispatch(self, request: Request, call_next: Callable[[Request], Awaitable[Response]]) -> Response:
        request_id = str(uuid.uuid4())
        response = await call_next(request)
        response.headers['X-API-REQUEST-ID'] = request_id
        host = f"{request.client.host}:{request.client.port}"
        self.logger.info({
            "request_id": request_id,
            "request": {"url": str(request.url), "method": request.method, "host": host}, 
            "response": {"status_code": response.status_code}
        })
        return response
        