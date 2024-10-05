from pydantic import BaseModel
from enum import Enum

class QueryType(str, Enum):
    store = "store"
    query = "query"

class QueryRequest(BaseModel):
    query: str
    chat_id: str