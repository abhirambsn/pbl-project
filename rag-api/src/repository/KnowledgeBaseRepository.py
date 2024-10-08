from typing import List, Union
from sqlalchemy.orm import Session
from slugify import slugify
from model import KnowledgeBase
from dto.KnowledgeBase import KnowledgeBaseCreate
from util import Logger
import uuid
import time

class KnowledgeBaseRepository:
    db: Session
    logger: Logger

    def __init__(self, _db: Session):
        self.db = _db
        self.logger = Logger("knowledge-base-repository")
    
    def _gen_id(self):
        return str(uuid.uuid4())
    
    def _build_filepath_from_ids(self, files: List[str]) -> List[str]:
        return files
    
    def save(self, kb: KnowledgeBaseCreate, createdBy: str) -> str:
        start_time = time.time()
        _id = self._gen_id()
        new_kb = KnowledgeBase(id = _id, name = kb.name, files = kb.files, urls = kb.urls, slug = slugify(kb.name), createdBy = createdBy)
        self.db.add(new_kb)
        self.db.commit()
        self.db.refresh(new_kb)
        process_time = time.time() - start_time
        self.logger.info({
            "request.id": _id,
            "request.type": "db",
            "request.method": "insert", 
            "response.process-time": round(process_time, 3),
            "misc.message": f"Knowledge Base with id {_id} has been created"
        })
        return new_kb.id
    
    def findById(self, id: str) -> Union[KnowledgeBase, None]:
        req_id = str(uuid.uuid4())
        start_time = time.time()
        kb = self.db.query(KnowledgeBase).filter(KnowledgeBase.id == id).first()
        if not kb:
            self.logger.error({
                "request.id": req_id,
                "request.type": "db",
                "request.method": "insert", 
                "response.process-time": 0,
                "misc.message": f"Knowledge Base with requested id: {id} not found"
            })
            return None
        
        process_time = time.time() - start_time

        self.logger.info({
            "request.id": req_id,
            "request.type": "db",
            "request.method": "insert", 
            "response.process-time": round(process_time, 3),
            "misc.message": f"Fetched Knowledge Base with id: {id}"
        })

        kb.files = self._build_filepath_from_ids(kb.files)
        return kb
    
    def findAll(self, skip: int = 0, limit: int = 10) -> List[KnowledgeBase]:
        kbs = self.db.query(KnowledgeBase).filter(KnowledgeBase.isPrivate == False).offset(skip).limit(limit).all()

        for kb_idx in range(len(kbs)):
            kbs[kb_idx].files = self._build_filepath_from_ids(kbs[kb_idx].files)
        return kbs
    
    def findKnowledgeBasesByUser(self, user_id: str, skip: int = 0, limit: int = 10, is_self: str = False) -> List[KnowledgeBase]:
        if is_self:
            kbs = self.db.query(KnowledgeBase).filter(KnowledgeBase.createdBy == user_id).offset(skip).limit(limit).all()
            for kb_idx in range(len(kbs)):
                kbs[kb_idx].files = self._build_filepath_from_ids(kbs[kb_idx].files)
            return kbs
        else:
            kbs = self.db.query(KnowledgeBase).filter(KnowledgeBase.createdBy == user_id, KnowledgeBase.isPrivate == False).offset(skip).limit(limit).all()
            for kb_idx in range(len(kbs)):
                kbs[kb_idx].files = self._build_filepath_from_ids(kbs[kb_idx].files)
            return kbs
    
    

