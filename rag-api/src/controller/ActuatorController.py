from fastapi import APIRouter
from util.Metrics import metrics_keys, get_metrics

router = APIRouter(prefix="/actuator", tags=["actuator"])

@router.get("/")
async def actuator():
    return {
        "_links": {
            "self": {
                "href": "/actuator"
            },
            "health": {
                "href": "/actuator/health"
            },
            "info": {
                "href": "/actuator/info"
            },
            "metrics": {
                "href": "/actuator/metrics"
            },
            "metrics-requiredMetricName": {
                "href": "/actuator/metrics/{requiredMetricName}"
            }
        }
    }

@router.get("/health")
async def health():
    return {"status": "UP"}

@router.get("/info")
async def info():
    return {
        "app": "rag-api",
        "version": "0.0.1"
    }

@router.get("/metrics")
async def metrics():
    return {
        "names": metrics_keys
    }

@router.get("/metrics/{name}")
async def metric(name: str):
    metric_data = get_metrics(name)
    if not metric_data:
        return {"error": "Metric not found"}
    return metric_data