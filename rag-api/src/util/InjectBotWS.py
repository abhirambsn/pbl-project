from service import BotWebSocketClient
import boto3, os

sqs = boto3.client("sqs", 
    region_name=os.getenv("AWS_REGION", "us-east-1"), 
    endpoint_url=os.getenv("AWS_ENDPOINT_URL", "http://localhost.localstack.cloud:4566"),
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY", "test"),
    aws_secret_access_key=os.getenv("AWS_SECRET_KEY", "test")
)

async def get_bot_client():
    bot_client = BotWebSocketClient(sqs)
    yield bot_client