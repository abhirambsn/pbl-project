from ..main import create_app
from fastapi.testclient import TestClient

client = TestClient(create_app())

def test_healthcheck():
    response = client.get('/api/v1/rag/health')
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}