from fastapi import FastAPI
from .db import engine, Base
from .controller import KnowledgeBaseController, WsController, ConfigController
from .middleware import LoggingMiddleware

Base.metadata.create_all(bind=engine)

def create_app() -> FastAPI:
    app = FastAPI()
    app.add_middleware(LoggingMiddleware)
    app.include_router(ConfigController.router)
    app.include_router(WsController.router)
    app.include_router(KnowledgeBaseController.router)
    return app

app = create_app()