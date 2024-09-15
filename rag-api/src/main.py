from fastapi import FastAPI, WebSocket
from fastapi.responses import JSONResponse
from .db import engine, Base
from .controller import KnowledgeBaseController
from .util import Logger
from .middleware import LoggingMiddleware

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(LoggingMiddleware)
app.include_router(KnowledgeBaseController.router)

@app.get("/health")
async def health():
    return JSONResponse({"status": "ok"})

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    logger = Logger("kb-ws")
    await websocket.accept()
    pass