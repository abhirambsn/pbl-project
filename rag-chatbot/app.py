import os
from dotenv import load_dotenv
import streamlit as st
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_community.document_loaders import WebBaseLoader
from langchain.text_splitter import CharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores import Pinecone
import pinecone


load_dotenv()

google_api_key = os.environ['GOOGLE_API_KEY']
supabase_url = os.environ['SUPABASE_URL']
supabase_service_key = os.environ['SUPABASE_SERVICE_KEY']

with st.sidebar:
    website = st.text_input("Enter Website URL")
    web_submit=st.button("Submit")

if web_submit:
    loader = WebBaseLoader(website)
    documents = loader.load()
    text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=4)
    docs = text_splitter.split_documents(documents)
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
    retriever_llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash")
    
    pinecone.init(
    api_key= os.getenv('PINECONE_API_KEY'),
    )

    index_name = 'temp'

    if index_name not in pinecone.list_indexes():
        # Create new Index
        pinecone.create_index(name=index_name, metric="cosine", dimension=768)
        docsearch = Pinecone.from_documents(docs, embeddings, index_name=index_name)
    else:
        # Link to the existing index
        docsearch = Pinecone.from_existing_index(index_name, embeddings)

    from langchain import PromptTemplate

    template = """
    You are a fortune teller. These Human will ask you a questions about their life. 
    Use following piece of context to answer the question. 
    If you don't know the answer, just say you don't know. 
    Keep the answer within 2 sentences and concise.

    Context: {context}
    Question: {question}
    Answer: 

    """

    prompt = PromptTemplate(
    template=template, 
    input_variables=["context", "question"]
    )

#     retriever = SelfQueryRetriever.from_llm(
#     retriever_llm, vectorstore)

#     retriever.invoke("What's new in tennis")
#     st.write("Message")
#     #message = st.chat_input("Your message")



else:
    st.info("Enter website url first")

#print(loader)

# llm = ChatGoogleGenerativeAI(
#     model="gemini-1.5-flash",
#     temperature=0.9
# )
