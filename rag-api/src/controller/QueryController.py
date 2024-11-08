from fastapi import APIRouter, Depends
from typing import Annotated
from repository.KnowledgeBaseRepository import KnowledgeBaseRepository
from util.InjectDB import get_kb_repo
from util.InjectBotWS import get_bot_client
from dto.QueryRequest import QueryRequest, QueryType
from dto.StoreRequest import StoreRequest
from service import BotWebSocketClient

router = APIRouter()


@router.post("/{kb_id}/store")
async def store_context_bot(kb_id: str, request: StoreRequest, knowledgeBaseRepository: Annotated[KnowledgeBaseRepository, Depends(get_kb_repo)], bot_client: Annotated[BotWebSocketClient, Depends(get_bot_client)]):
    knowledgeBase = knowledgeBaseRepository.findById(kb_id)
    if not knowledgeBase:
        return -1
    
    urls = knowledgeBase.urls
    print(f"Sending store request for urls: {urls}")
    request_id = bot_client.send_request(QueryType.store, request.chat_id, urls)

    return {"message": "Store Request Sent", "request_id": request_id}

@router.post("/{kb_id}/query")
async def query_bot(kb_id: str, request: QueryRequest, knowledgeBaseRepository: Annotated[KnowledgeBaseRepository, Depends(get_kb_repo)], bot_client: Annotated[BotWebSocketClient, Depends(get_bot_client)]):
    knowledgeBase = knowledgeBaseRepository.findById(kb_id)
    if not knowledgeBase:
        return -1
    
    query = request.query
    print(f"Sending query request for query: {query}")
    request_id = bot_client.send_request(QueryType.query, request.chat_id, query=query)

    return {"message": "Query Request Sent", "request_id": request_id}
