from db import Base
from sqlalchemy import Column, String

class File(Base):
    __tablename__ = "files"

    id = Column(String, primary_key=True)
    path = Column(String, unique=True, nullable=False)