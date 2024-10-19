from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from typing import List
from .dto import Query, QueryType
from .util import RetrievalAugmentedGenerator

app = FastAPI()

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []
    
    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
    
    async def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)
    
    async def send_response(self, payload: str, websocket: WebSocket):
        await websocket.send_json(payload)

manager = ConnectionManager()
rag = RetrievalAugmentedGenerator()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_json()
            request = Query.parse_json(data)
            print(f"Received request: {request}")
            if (request.type == QueryType.store):
                await rag.store_to_vector_store(request)
                return await websocket.send_json({"id": request.id, "message": "Stored data to vector store"})
            elif (request.type == QueryType.query):
                await rag.send_answer(websocket, request)
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        print("Client disconnected")
    except Exception as e:
        await websocket.send_json({"message": f"Error: {e}"}) 