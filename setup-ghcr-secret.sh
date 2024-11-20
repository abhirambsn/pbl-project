#!/bin/zsh

read -p "Enter Username for Github Container Registry: " GH_USERNAME
read -p "Enter Email for Github Container Registry: " GH_EMAIL

read -sp "Enter Github Token for Pull Access to Github Container Registry: " GH_TOKEN
echo

kubectl -n pbl create secret docker-registry ghcr --docker-server=ghcr.io --docker-username=$GH_USERNAME --docker-password=$GH_TOKEN  --docker-email=$GH_EMAIL