from fastapi import APIRouter, WebSocket
from ..util import Logger

router = APIRouter(prefix="/api/v1/rag")

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    logger = Logger("kb-ws")
    await websocket.accept()
    pass