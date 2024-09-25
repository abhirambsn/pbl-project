#!/usr/bin/bash

echo "Launching production environment"
docker compose -f ./compose.monitoring.yml -f ./compose.prod.yml up -d

if [ $? -eq 0 ]; then
  echo "Production environment launched successfully"
else
  echo "Failed to launch production environment"
fi