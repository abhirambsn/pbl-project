from typing import List
from pydantic import BaseModel, ConfigDict

class KnowledgeBase_Base(BaseModel):
    name: str
    files: List[str]
    urls: List[str]

class KnowledgeBaseCreate(KnowledgeBase_Base):
    pass

class KnowledgeBase(KnowledgeBase_Base):
    model_config = ConfigDict(from_attributes=True)
    id: str
    slug: str
    createdBy: str

class KnowledgeBaseEdit(BaseModel):
    request_type: str
    