from pydantic import BaseModel

class StoreRequest(BaseModel):
    chat_id: str