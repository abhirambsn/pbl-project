from pydantic import BaseModel

class FileBase(BaseModel):
    path: str

class File(FileBase):
    id: str

    class Config:
        from_attributes = True

class FileCreate(FileBase):
    pass

class FileEdit(FileBase):
    pass