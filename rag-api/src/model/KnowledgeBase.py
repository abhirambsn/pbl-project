from ..db import Base
from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, ARRAY

class KnowledgeBase(Base):
    __tablename__ = "knowledge_bases"

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    slug = Column(String, nullable=False, unique=True, index=True)
    files = Column(ARRAY(String))
    createdBy = Column(String, nullable=False, unique=True)
    isPrivate = Column(Boolean, default=False, nullable=False)