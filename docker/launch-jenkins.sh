#!/bin/bash
docker run \
  --name jenkins-docker \
  --rm \
  --detach \
  --privileged \
  --network deployment \
  --network-alias docker \
  --env DOCKER_TLS_CERTDIR=/certs \
  --volume jenkins-docker-certs:/certs/client \
  --volume jenkins-data:/var/jenkins_home \
  --publish 2376:2376 \
  docker:dind \
  --storage-driver overlay2

docker run \
    --name pbl-jenkins \
    --restart=on-failure \
    --detach \
    --network deployment \
    --env DOCKER_HOST=tcp://docker:2376 \
    --env DOCKER_CERT_PATH=/certs/client \
    --env DOCKER_TLS_VERIFY=1 \
    --publish 10001:8080 \
    --publish 50000:50000 \
    --volume jenkins-data:/var/jenkins_home \
    --volume jenkins-docker-certs:/certs/client:ro ghcr.io/abhirambsn/pbl-jenkins-image:latest

docker run --name='mailcatcher' -d \
  --publish=1080:1080 \
  --publish=1025:1025 \
  --restart=on-failure \
  --network deployment \
dockage/mailcatcher:latest