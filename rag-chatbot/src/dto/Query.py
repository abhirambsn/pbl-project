from pydantic import BaseModel
from typing import Union, List, Optional
from enum import Enum

class QueryType(str, Enum):
    store = 'store'
    query = 'query'

class Query(BaseModel):
    type: QueryType = QueryType.query
    text: Optional[str]
    id: Optional[str]
    urls: Optional[List[str]]
    chat_id: Union[str, None]
    needsUpdate: Optional[bool] = False

    @staticmethod
    def parse_json(data):
        return Query(
            type=data['type'],
            text=data.get('text'), 
            id=data.get('id'), 
            urls=data.get('urls'), 
            chat_id=data.get('chat_id'), 
            needsUpdate=data.get('needsUpdate', False)
        )