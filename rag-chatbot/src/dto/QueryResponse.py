from pydantic import BaseModel
from datetime import datetime
from typing import Union

class QueryResponse(BaseModel):
    id: str
    answer: Union[str, None]
    sender: str
    timestamp: float
    done: bool
    message: Union[str, None]
    duration: float
    chat_id: str

    @staticmethod
    def make_response(id: str, answer: Union[str, None], duration: float, message: Union[str, None] = None, done: bool = False, chat_id: str = ""):
        return QueryResponse(id=id, answer=answer, sender="bot", timestamp=datetime.now().timestamp(), message=message, done=done, duration=duration, chat_id=chat_id)
    
    def to_json(self):
        return {
            "id": self.id,
            "answer": self.answer,
            "sender": self.sender,
            "timestamp": self.timestamp,
            "done": self.done,
            "message": self.message,
            "duration": self.duration,
            "chat_id": self.chat_id
        }