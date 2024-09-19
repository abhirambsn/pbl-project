from fastapi import FastAPI
from db import engine, Base
from controller import KnowledgeBaseController, ConfigController
from middleware import LoggingMiddleware
import py_eureka_client.eureka_client as eureka_client
from contextlib import asynccontextmanager
from dotenv import load_dotenv
from util import Logger
import os

load_dotenv()

Base.metadata.create_all(bind=engine)

print(os.getenv("EUREKA_SERVER"))

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger = Logger("rag-api-eureka")
    try:
        logger.info("Registering with Eureka")
        await eureka_client.init_async(
            eureka_server=os.getenv("EUREKA_SERVER"),
            app_name="rag-api",
            instance_port=8000
        )
        logger.info(f"Registered with Eureka Server @ {os.getenv('EUREKA_SERVER')}")
        yield
    except Exception as e:
        logger.error(f"Error registering with Eureka: {e}")

def create_app() -> FastAPI:
    app = FastAPI(lifespan=lifespan)
    app.add_middleware(LoggingMiddleware)
    app.include_router(ConfigController.router)
    app.include_router(KnowledgeBaseController.router)
    return app

app = create_app()