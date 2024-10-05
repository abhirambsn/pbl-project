from service import BotWebSocketClient

async def get_bot_client():
    bot_client = BotWebSocketClient()
    yield bot_client