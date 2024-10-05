from langchain_community.document_loaders import RecursiveUrlLoader
from langchain_community.document_loaders.web_base import WebBaseLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from uuid import uuid4
from langchain_pinecone import PineconeVectorStore
from typing import List

class WebsitePineconeLoader:
    def __init__(self, urls: List[str]):
        self.urls = urls
        # self.webloaders = [RecursiveUrlLoader(url) for url in urls]
        self.loader = WebBaseLoader(urls)
    
    def _load(self):
        # documents = []
        # for loader in self.webloaders:
        #     documents.extend(await loader.aload())
        print("Loading documents")
        documents = self.loader.load()
        print("Documents loaded")
        return documents
    
    def load_and_split(self):
        documents = self._load()
        print("Splitting documents")
        text_splitter = RecursiveCharacterTextSplitter()
        document_chunks = text_splitter.split_documents(documents)
        print("Documents split")
        return document_chunks
    
    async def store(self, vector_store: PineconeVectorStore):
        document_chunks = self.load_and_split()
        print("Assigning IDs")
        ids = [str(uuid4()) for _ in range(len(document_chunks))]
        print("Adding documents to vector store")
        vector_store.add_documents(document_chunks, ids=ids) 
        print("Documents stored")
        return ids

