from src.main import create_app
from fastapi.testclient import TestClient

app = create_app()
client = TestClient(app)

def test_health():
    resp = client.get('/health')
    assert resp.status_code == 200