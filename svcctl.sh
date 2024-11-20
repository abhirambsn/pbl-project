# the 1st param is a command start or stop if its start then it will start all the services else stop

CMD="$1"

if [[ $CMD == "start" ]]; then
    kubectl apply -f discovery-server/k8s/*.yml
    kubectl apply -f chat-api/k8s/*.yml
    kubectl apply -f profile-api/k8s/*.yml
    kubectl apply -f rag-api/k8s/*.yml
    kubectl apply -f rag-chatbot/k8s/*.yml
    kubectl apply -f api-gateway/k8s/*.yml
    kubectl apply -f k8s/ingress.yml
    exit 0
elif [[ $CMD == "stop" ]]; then
    kubectl delete -f k8s/ingress.yml
    kubectl delete -f discovery-server/k8s/*.yml
    kubectl delete -f chat-api/k8s/*.yml
    kubectl delete -f profile-api/k8s/*.yml
    kubectl delete -f rag-api/k8s/*.yml
    kubectl delete -f rag-chatbot/k8s/*.yml
    kubectl delete -f api-gateway/k8s/*.yml
    exit 0
else
    echo "Invalid command. Please use start or stop."
    exit 1
fi