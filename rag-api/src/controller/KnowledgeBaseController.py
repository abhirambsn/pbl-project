from fastapi import APIRouter, Depends, Response
from fastapi.responses import JSONResponse
from typing import Annotated, Union
from repository.KnowledgeBaseRepository import KnowledgeBaseRepository
from dto.KnowledgeBase import KnowledgeBaseCreate, KnowledgeBase as KnowledgeBaseResponse

from db import SessionLocal


async def get_kb_repo():
    db = SessionLocal()
    try:
        knowledgeBaseRepository = KnowledgeBaseRepository(db)
        yield knowledgeBaseRepository
    except:
        db.close()
        raise

router = APIRouter()

@router.post("/")
async def create_kb(kb: KnowledgeBaseCreate, knowledgeBaseRepository: Annotated[KnowledgeBaseRepository, Depends(get_kb_repo)]):
    kb_id = knowledgeBaseRepository.save(kb, "test_user")
    return JSONResponse({"success": True, "status": 201, "body": {"id": kb_id}}, 201)

@router.get("/")
async def get_all_kb(knowledgeBaseRepository: Annotated[KnowledgeBaseRepository, Depends(get_kb_repo)], skip: Union[int, None] = 0, limit: Union[int, None] = 10):
    kbs = knowledgeBaseRepository.findAll(skip, limit)
    kbs_parsed = [KnowledgeBaseResponse(id=kb.id, name=kb.name, files=kb.files, slug=kb.slug, createdBy=kb.createdBy).model_dump() for kb in kbs]
    return JSONResponse({"success": True, "body": kbs_parsed, "status": 200, "limit": limit, "offset": skip}, 200)

@router.get("/{kb_id}")
async def get_kb(kb_id: str, knowledgeBaseRepository: Annotated[KnowledgeBaseRepository, Depends(get_kb_repo)]):
    kb = knowledgeBaseRepository.findById(kb_id)
    if not kb:
        return JSONResponse({"success": False, "status": 404, "body": f"Knowledge Base with requested id: {kb_id} not found"})
    kb_parsed = KnowledgeBaseResponse(id=kb.id, name=kb.name, files=kb.files, slug=kb.slug, createdBy=kb.createdBy).model_dump()
    return JSONResponse({"success": True, "status": 200, "body": kb_parsed})

@router.put("/{kb_id}")
async def edit_files_in_kb(kb_id: str, knowledgeBaseRepository: Annotated[KnowledgeBaseRepository, Depends(get_kb_repo)]):
    return {"message": "Knowledge Base Edited"}


@router.delete("/{kb_id}")
async def delete_kb(kb_id: str, knowledgeBaseRepository: Annotated[KnowledgeBaseRepository, Depends(get_kb_repo)]):
    return {"message": "Knowledge Base Deleted"}