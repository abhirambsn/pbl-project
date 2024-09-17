FROM python:3.11-alpine as builder
WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

RUN apk add --no-cache build-base

COPY ./requirements.txt /tmp
RUN pip install --user --no-cache-dir -r /tmp/requirements.txt

FROM python:3.11-alpine

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PATH="/root/.local/bin:$PATH"

WORKDIR /app

COPY --from=builder /root/.local /root/.local
COPY . .
EXPOSE 8000

CMD ["fastapi", "run", "src/main.py"]
