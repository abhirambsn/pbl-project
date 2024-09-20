from typing import Awaitable, Callable
from fastapi import Request
from starlette.responses import Response
from util import Logger
from starlette.middleware.base import BaseHTTPMiddleware
import uuid
import time

class LoggingMiddleware(BaseHTTPMiddleware):
    def __init__(self, app):
        super().__init__(app)
        self.logger = Logger("rag-api-log-middleware")

    async def dispatch(self, request: Request, call_next: Callable[[Request], Awaitable[Response]]) -> Response:
        request_id = str(uuid.uuid4())
        start_time = time.time()
        response = await call_next(request)
        process_time = time.time() - start_time

        response.headers['X-API-REQUEST-ID'] = request_id
        response.headers['X-PROCESS-TIME'] = str(process_time)

        host = f"{request.client.host}:{request.client.port}"
        self.logger.info({
            "request.id": request_id,
            "request.type": "http",
            "request.url": str(request.url), 
            "request.method": request.method, 
            "request.host": host, 
            "request.user-agent": request.headers.get("user-agent"),
            "request.remote-address": request.client.host,
            "response.status_code": response.status_code,
            "response.content-length": response.headers.get("content-length"),
            "response.content-type": response.headers.get("content-type"),
            "response.process-time": round(process_time, 3),
            "misc.message": 'logged'
        })
        return response
        