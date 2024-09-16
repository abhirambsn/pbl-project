from ..controller import KnowledgeBaseController
from ..repository import KnowledgeBaseRepository
import pytest

@pytest.mark.asyncio
async def test_create_kb():
    kbRepo = KnowledgeBaseRepository.KnowledgeBaseRepository()
    response = await KnowledgeBaseController.create_kb()
    assert response == {"message": "Knowledge Base Created"}