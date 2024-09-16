from pydantic import BaseModel, ConfigDict

class FileBase(BaseModel):
    path: str

class File(FileBase):
    model_config = ConfigDict(from_attributes=True)
    id: str

class FileCreate(FileBase):
    pass

class FileEdit(FileBase):
    pass