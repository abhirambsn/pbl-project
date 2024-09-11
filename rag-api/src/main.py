from fastapi import FastAPI, WebSocket
from fastapi.responses import JSONResponse
from .db import engine, Base
from .controller import KnowledgeBaseController

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(KnowledgeBaseController.router)

@app.get("/health")
async def health():
    return JSONResponse({"status": "ok"})

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    pass