FROM python:3.9-bookworm as builder
WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

RUN apt-get update && \
    apt-get -y install build-essential linux-headers-$(uname -r) cmake && \
    apt-get clean

COPY ./requirements.txt /tmp
RUN pip install --user --no-cache-dir -r /tmp/requirements.txt

FROM python:3.9-bookworm

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PATH="/root/.local/bin:$PATH"

RUN apt-get update && \
    apt-get install --no-cache linux-headers-$(uname -r) && \
    apt-get clean

WORKDIR /app

COPY --from=builder /root/.local /root/.local
COPY . .
EXPOSE 8000

CMD ["fastapi", "run", "src/app.py"]
