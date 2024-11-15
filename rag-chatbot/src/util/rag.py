from langchain_pinecone import PineconeVectorStore
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from ..dto.Query import Query
from ..dto.QueryResponse import QueryResponse
from typing import List
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from dotenv import load_dotenv
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.chains.history_aware_retriever import create_history_aware_retriever
from langchain.chains.retrieval import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_pinecone import PineconeVectorStore
from pinecone import Pinecone, ServerlessSpec
from ..util import WebsitePineconeLoader
from fastapi import WebSocket
import time
import requests
import os

load_dotenv()

class RetrievalAugmentedGenerator:
    def __init__(self):
        self.pc = Pinecone(api_key=os.getenv('PINECONE_API_KEY'))
    
    async def create_or_get_index(self, index_name: str) -> str:
        if index_name not in self.pc.list_indexes().names():
            print(f"Creating index {index_name}")
            self.pc.create_index(name=index_name, metric="cosine", dimension=768, spec=ServerlessSpec(cloud="aws", region="us-east-1"))
        else:
            print(f"Index {index_name} already exists")
        return index_name
    
    async def fetch_website_data_to_store(self, vector_store: PineconeVectorStore, urls: List[str]):
        loader = WebsitePineconeLoader(urls)
        await loader.store(vector_store)
    
    async def get_vectorstore(self, chat_id: str):
        index_name = await self.create_or_get_index(chat_id)
        embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001", request_options={"timeout": 1000})
        vector_store = PineconeVectorStore.from_existing_index(index_name=index_name, embedding=embeddings)

        return vector_store
    
    async def get_context_retriever_chain(self, vector_store: PineconeVectorStore):
        llm = ChatGoogleGenerativeAI(model='gemini-1.5-flash')
        
        retriever = vector_store.as_retriever()
        
        prompt = ChatPromptTemplate.from_messages([
            MessagesPlaceholder(variable_name="chat_history"),
            ("user", "{input}"),
            ("user", "Given the above conversation, generate a search query to look up in order to get information relevant to the conversation")
        ])
        
        retriever_chain = create_history_aware_retriever(llm, retriever, prompt)
        
        return retriever_chain
    
    async def get_chat_history(self, chat_id: str, dev: bool = True):
        if dev:
            return []
        response = requests.get(f"{os.getenv('CHAT_SERVICE_URL')}/chat?chatId={chat_id}", headers={"Authorization": f"Bearer {os.getenv('CHAT_SERVICE_TOKEN')}"})
        json_data = response.json()
        messages = json_data.get('body', [])
        chat_history = []
        for message in messages:
            msg = f"[{message.get('senderType')}]: {message.get('message')}"
            chat_history.append(msg.strip('\n'))
        return chat_history
    
    async def get_conversational_rag_chain(self, retriever_chain): 
        
        llm = ChatGoogleGenerativeAI(model='gemini-1.5-flash')
        
        prompt = ChatPromptTemplate.from_messages([
            ("system", "Answer the user's questions based on the below context and the chat history:\n\nContext:\n\n{context}\n\nChat History:\n\n"),
            MessagesPlaceholder(variable_name="chat_history"),
            ("user", "{input}"),
        ])
        
        stuff_documents_chain = create_stuff_documents_chain(llm,prompt)
        
        return create_retrieval_chain(retriever_chain, stuff_documents_chain)
    
    async def send_answer(self, websocket: WebSocket, request: Query):
        try:
            start = time.time()
            vector_store = await self.get_vectorstore(request.chat_id)
            retriever_chain = await self.get_context_retriever_chain(vector_store)
            conversation_rag_chain = await self.get_conversational_rag_chain(retriever_chain)
            if (request.chat_id is not None):
                print(f"Fetching chat history for chat_id {request.chat_id}")
                chat_history = await self.get_chat_history(request.chat_id, False)
            else:
                chat_history = []

            print(f"Using Chat History: {chat_history}")
            print("Querying Model for answer")

            ctr = 0

            async for response in conversation_rag_chain.astream({
                "chat_history": chat_history,
                "input": request.text
            }):
                ctr += 1
                print(f"Streaming reponse: {ctr}")
                resp = QueryResponse.make_response(request.id, duration=-1, answer=response.get('answer'), message=None, done=False)
                await websocket.send_json(resp.to_json())
            end = time.time()
            duration = round(end - start, 2)
            query_response = QueryResponse.make_response(request.id, answer=None, duration=duration, message="Done", done=True, chat_id=request.chat_id)
            await websocket.send_json(query_response.to_json())
        except Exception as e:
            await websocket.send_json({"id": request.id, "message": f"Error: {e}", "chat_id": request.chat_id, "type": "QUERY_RESULT"})

    async def store_to_vector_store(self, request: Query):
        try:
            vector_store = await self.get_vectorstore(request.chat_id)
            await self.fetch_website_data_to_store(vector_store, request.urls)
        except Exception as e:
            print(f"Error: {e}")
            raise e
        

    


