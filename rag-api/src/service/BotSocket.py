import os
import websocket
import asyncio
import json
from dto.QueryRequest import QueryType
from typing import List, Optional
from uuid import uuid4
import threading
from typing import Any

class BotWebSocketClient:
    ws: websocket.WebSocketApp
    request_id: str
    queue_url: str
    sqs: Any

    def _send_response_message(self, message: str):
        return self.sqs.send_message(QueueUrl=self.queue_url, DelaySeconds=3, MessageBody=message)

    def _collect_response(self, response_stream):
        result = ''
        for response in response_stream:
            if response.get('answer'):
                result += response.get('answer', '')
        return result

    def on_message(self, ws, message):
       parsed_message = json.loads(message)
       if parsed_message.get('done'):
        print(f"Received Done message: {message}")
        combined = self._collect_response(self.response_stream)
        print(f"Combined response: {combined}")
        self.response_stream.clear() 
        self.ws.close()
        self._send_response_message(json.dumps({"id": parsed_message.get('id'), "chat_id": parsed_message.get("chat_id"), "message": combined, "type": "QUERY_RESULT"}))
       else:
           self.response_stream.append(parsed_message) 
           print(f"Received message: {message}")
       

    def __init__(self, sqs_client: Any):
        self.request_id = str(uuid4())
        self.ws = websocket.WebSocketApp(os.getenv("BOT_SOCKET_URL"))
        self.response_stream = []
        self.ws.on_message = self.on_message
        self.loop = asyncio.get_event_loop()
        self.listener_thread = threading.Thread(target=self.start)
        self.listener_thread.start()
        self.sqs = sqs_client
        self.queue_url = os.getenv("SQS_QUEUE_URL", "http://localhost.localstack.cloud:4566/000000000000/query-results")
    
    def _send_store_request(self, chat_id: str, urls: List[str]):
        request = {
            "type": "store",
            "urls": urls,
            "id": self.request_id,
            "chat_id": chat_id
        }
        print(f"Sending request: {request}")
        self.ws.send(json.dumps(request))

    def _send_query_request(self, chat_id: str, query: str):
        request = {
            "type": "query",
            "text": query,
            "id": self.request_id,
            "chat_id": chat_id
        }
        print(f"Sending request: {request}")
        self.ws.send(json.dumps(request))
    
    def send_request(self, type: QueryType, chat_id: str, urls: List[str] = [], query: Optional[str] = None):
        self.request_id = str(uuid4())
        if type == QueryType.query:
            self._send_query_request(chat_id, query)
        elif type == QueryType.store:
            self._send_store_request(chat_id, urls)
        else:
            raise ValueError("Invalid Query Type")
        return self.request_id
        
    def start(self):
        self.ws.run_forever()