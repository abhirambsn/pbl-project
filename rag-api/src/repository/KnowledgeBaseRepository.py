from typing import List
from sqlalchemy.orm import Session
from ..model import File, KnowledgeBase
from ..dto import KnowledgeBase
from ..util import Logger
import uuid

class KnowledgeBaseRepository:
    db: Session
    logger: Logger

    def __init__(self, _db: Session):
        self.db = _db
        self.logger = Logger("knowledge-base-repository")
    
    def _gen_id():
        return uuid.uuid4()
    
    def _build_filepath_from_ids(files: List[str]) -> List[str]:
        pass
    
    def save(self, kb: KnowledgeBase.KnowledgeBaseCreate):
        _id = self._gen_id()
        new_kb = KnowledgeBase(id = _id, name = kb.name, files = kb.files)
        self.db.add(new_kb)
        self.db.commit()
        self.db.refresh()
        self.logger.info(f"Knowledge Base with id {_id} has been created")
        return new_kb
    
    def findById(self, id: str):
        kb = self.db.query(KnowledgeBase).filter(KnowledgeBase.id == id).first()
        if not kb:
            raise RuntimeError()
        
        kb.files = self._build_filepath_from_ids(kb.files)
        return kb
    
    def findAll(self, skip: int = 0, limit: int = 10):
        kbs = self.db.query(KnowledgeBase).filter(KnowledgeBase.isPrivate == False).offset(skip).limit(limit).all()

        for kb_idx in range(len(kbs)):
            kbs[kb_idx].files = self._build_filepath_from_ids(kbs[kb_idx].files)
        return kbs
    
    def findKnowledgeBasesByUser(self, user_id: str, skip: int = 0, limit: int = 10, is_self: str = False):
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
    
    

