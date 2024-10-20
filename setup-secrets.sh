#/bin/zsh

# This script is used to setup the secrets for the project.
# The script will prompt the user for the secrets and create k8s secrets for the project.

SECRET_NAMES=("pinecone-api-key" "pg-db-url" "eureka-server" "google-api-key")

for SECRET_NAME in "${SECRET_NAMES[@]}"; do
    read -sp "Enter value for secret [$SECRET_NAME]: " SECRET_VALUE
    echo

    kubectl create secret generic $SECRET_NAME --from-literal=$SECRET_NAME=$SECRET_VALUE

    echo "Secret [$SECRET_NAME] created successfully."
done