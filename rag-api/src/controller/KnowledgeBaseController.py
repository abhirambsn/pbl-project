from fastapi import APIRouter, Depends
from typing import Annotated
from ..repository.KnowledgeBaseRepository import KnowledgeBaseRepository

from ..db import SessionLocal


async def get_kb_repo():
    db = SessionLocal()
    try:
        knowledgeBaseRepository = KnowledgeBaseRepository(db)
        yield knowledgeBaseRepository
    except:
        db.close()

router = APIRouter()

@router.post("/")
async def create_kb(knowledgeBaseRepository: Annotated[KnowledgeBaseRepository, Depends(get_kb_repo)]):
    pass

@router.get("/")
async def get_all_kb(knowledgeBaseRepository: Annotated[KnowledgeBaseRepository, Depends(get_kb_repo)]):
    pass

@router.get("/{kb_id}")
async def get_kb(kb_id: str, knowledgeBaseRepository: Annotated[KnowledgeBaseRepository, Depends(get_kb_repo)]):
    pass

@router.put("/{kb_id}")
async def edit_files_in_kb(kb_id: str, knowledgeBaseRepository: Annotated[KnowledgeBaseRepository, Depends(get_kb_repo)]):
    pass


@router.delete("/{kb_id}")
async def delete_kb(kb_id: str, knowledgeBaseRepository: Annotated[KnowledgeBaseRepository, Depends(get_kb_repo)]):
    pass