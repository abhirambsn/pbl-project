from hypercorn.config import Config
from hypercorn.asyncio import serve
from main import create_app
from util import HypercornLoggerAdapter, Logger
import asyncio
import tracemalloc

tracemalloc.start()

err_logger = Logger("rag-api", file_path=".logs/rag-error.log")

config = Config()
config.bind = ["0.0.0.0:8000"]
config.logger_class = HypercornLoggerAdapter

app = create_app()

async def main_fn():
    try:
        await serve(app, config)
    except Exception as e:
        err_logger.error(f"An error occurred: {e}")
        snapshot = tracemalloc.take_snapshot()
        top_stats = snapshot.statistics('lineno')
        for stat in top_stats[:10]:
            err_logger.error(stat)
            pass
        raise
    finally:
        tracemalloc.stop()

if __name__ == '__main__':
    asyncio.run(main_fn())

