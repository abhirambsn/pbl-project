from typing import List
from pydantic import BaseModel

class KnowledgeBase_Base(BaseModel):
    name: str
    files: List[str]

class KnowledgeBaseCreate(KnowledgeBase_Base):
    pass

class KnowledgeBase(KnowledgeBase_Base):
    id: str
    slug: str

    class Config:
        from_attributes = True

class KnowledgeBaseEdit(BaseModel):
    request_type: str
    