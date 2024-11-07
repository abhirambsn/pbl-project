from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from typing import List
from .dto import Query, QueryType
from .util import RetrievalAugmentedGenerator
import boto3, os

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
sqs = boto3.client("sqs", 
                   region_name=os.getenv("AWS_REGION", "us-east-1"), 
                   endpoint_url=os.getenv("AWS_ENDPOINT_URL", "http://localhost.localstack.cloud:4566"),
                   aws_access_key_id=os.getenv("AWS_ACCESS_KEY", "test"),
                   aws_secret_access_key=os.getenv("AWS_SECRET_KEY", "test")
                )
queue_url = os.getenv("SQS_QUEUE_URL", "http://localhost.localstack.cloud:4566/000000000000/query-results")

async def send_response_message(message: str):
    return sqs.send_message(QueueUrl=queue_url, DelaySeconds=2, MessageBody=message)

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
                await websocket.send_json({"id": request.id, "message": "Stored data to vector store"})
                return await send_response_message({"id": request.id, "message": "Stored data to vector store", "chat_id": request.chat_id, "type": "STORE_RESULT"})
            elif (request.type == QueryType.query):
                await rag.send_answer(websocket, request)
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        print("Client disconnected")
    except Exception as e:
        await websocket.send_json({"message": f"Error: {e}"}) 