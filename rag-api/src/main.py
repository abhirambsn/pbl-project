from fastapi import FastAPI
from db import engine, Base
from controller import KnowledgeBaseController, ActuatorController
from middleware import LoggingMiddleware
import py_eureka_client.eureka_client as eureka_client
from contextlib import asynccontextmanager
from dotenv import load_dotenv
from util import Logger
from util.Metrics import set_start_time
import os
import time

load_dotenv()

Base.metadata.create_all(bind=engine)

@asynccontextmanager
async def lifespan(app: FastAPI):
    start_time = time.time()
    logger = Logger("rag-api-eureka")
    try:
        logger.info("Registering with Eureka")
        await eureka_client.init_async(
            eureka_server=os.getenv("EUREKA_SERVER"),
            app_name="rag-api",
            instance_port=8000
        )
        logger.info(f"Registered with Eureka Server @ {os.getenv('EUREKA_SERVER')}")
        app_start_time = time.time() - start_time
        set_start_time(app_start_time)
        logger.info(f"Application started in {app_start_time} seconds")
        yield
    except Exception as e:
        logger.error(f"Error registering with Eureka: {e}")

def create_app() -> FastAPI:
    app = FastAPI(lifespan=lifespan)
    app.add_middleware(LoggingMiddleware)
    app.include_router(ActuatorController.router)
    app.include_router(KnowledgeBaseController.router)
    return app

app = create_app()