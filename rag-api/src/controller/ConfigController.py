from fastapi import APIRouter
from fastapi.responses import JSONResponse

router = APIRouter(prefix="/api/v1/rag")

@router.get("/health")
async def health():
    return JSONResponse({"status": "ok"})