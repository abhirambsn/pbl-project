from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from db import engine, Base
from controller import KnowledgeBaseController, ActuatorController, QueryController
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
        log_body = {
            "request.url": os.getenv("EUREKA_SERVER"),
            "request.method": None,
            "request.host": None,
            "request.user-agent": None,
            "request.remote-address": None,
            "response.status_code": None,
            "response.content-length": None,
            "response.content-type": None,
        }
        logger.info({
            **log_body,
            "misc.message": "Registering with Eureka Server"
        })
        await eureka_client.init_async(
            eureka_server=os.getenv("EUREKA_SERVER"),
            app_name="rag-api",
            instance_port=8000,
            instance_host="rag-api"
        )


        logger.info({
            **log_body,
            "misc.message": f"Registered with Eureka Server @ {os.getenv('EUREKA_SERVER')}"
        })
        app_start_time = time.time() - start_time
        set_start_time(app_start_time)
        logger.info({
            **log_body,
            "misc.message": f"App started in {app_start_time} seconds"
        })
        yield
    except Exception as e:
        logger.error(f"Error registering with Eureka: {e}")


def create_app() -> FastAPI:
    app = FastAPI(lifespan=lifespan)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    app.add_middleware(LoggingMiddleware)
    app.include_router(ActuatorController.router)
    app.include_router(KnowledgeBaseController.router)
    app.include_router(QueryController.router)
    return app