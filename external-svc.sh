# the 1st param is a command start or stop if its start then it will start all the services else stop

CMD="$1"

if [[ $CMD == "start" ]]; then
    kubectl apply -f k8s/mongodb-dev.yml
    kubectl apply -f k8s/postgres-dev.yml
    kubectl apply -f k8s/keycloak-dev.yml
    exit 0
elif [[ $CMD == "stop" ]]; then
    kubectl delete -f k8s/mongodb-dev.yml
    kubectl delete -f k8s/postgres-dev.yml
    kubectl delete -f k8s/keycloak-dev.yml
    exit 0
else
    echo "Invalid command. Please use start or stop."
    exit 1
fi