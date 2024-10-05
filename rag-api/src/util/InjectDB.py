from db import SessionLocal
from repository.KnowledgeBaseRepository import KnowledgeBaseRepository

async def get_kb_repo():
    db = SessionLocal()
    try:
        knowledgeBaseRepository = KnowledgeBaseRepository(db)
        yield knowledgeBaseRepository
    except:
        db.close()
        raise