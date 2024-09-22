pipeline {
    agent any
    parameters {
        choice(name: 'build-env', choices: ['prod', 'pre-prod'], description: 'Select the environment of the build')
        extendedChoice(
            defaultValue: 'api-gateway,discovery-server,profile-api,chat-api,rag-api,ui',
            description: 'Select the modules to build',
            multiSelectDelimiter: ',',
            name: 'modules-to-build',
            quoteValue: false,
            type: 'PT_MULTI_SELECT',
            value: 'api-gateway,discovery-server,profile-api,chat-api,rag-api,ui',
            visibleItemCount: 6
        )
    }
    environment {
        REGISTRY = "ghcr.io"
        REGISTRY_USERNAME = "abhirambsn"
        DOCKER_CREDS_ID = 'github-docker-creds'
        DOCKER_TAG = "${params['build-env']}"
        POSTGRES_IMAGE = 'postgres:15.5'
        POSTGRES_DB = 'rag'
        POSTGRES_USER = 'dev-postgres'
        POSTGRES_PASSWORD = 'dev-postgres'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Determine Modules to Build') {
            steps {
                script {
                    def modulesToBuild = params['modules-to-build'].split(',').collect { it.trim() }

                    if (modulesToBuild) {
                        env.MODULES_TO_BUILD = modulesToBuild.join(',')
                    } else {
                        error('No modules to build')
                    }

                    echo "Modules to build: ${env.MODULES_TO_BUILD}"
                }
            }
        }

        stage('Setup PostgreSQL Database') {
            steps {
                script {
                    echo "Starting PostgreSQL container for tests"
                    sh """
                        docker run --name postgres-test -d \
                        -e POSTGRES_DB=${POSTGRES_DB} \
                        -e POSTGRES_USER=${POSTGRES_USER} \
                        -e POSTGRES_PASSWORD=${POSTGRES_PASSWORD} \
                        -p 5432:5432 ${POSTGRES_IMAGE}
                    """
                    
                    sleep 10
                }
            }
        }


        stage('Setup Test Environemnt') {
            when {
                expression {
                    env.MODULES_TO_BUILD != null
                }
            }
            steps {
                script {
                    def modules = env.MODULES_TO_BUILD.split(',')
                    modules.each { module ->
                        echo "Setting up test environment for module: ${module}"
                    }
                }
            }
        }

        stage('Test Modules') {
            when {
                expression {
                    env.MODULES_TO_BUILD != null
                }
            }

            steps {
                script {
                    def modules = env.MODULES_TO_BUILD.split(',')
                    modules.each { module ->
                        echo "Testing module: ${module}"

                        if (module == 'ui') {
                            sh "cd ${module} && npm install && npm run test"
                        } else if (module == 'rag-api') {
                            sh '''
                            python3 -m venv /tmp/venv
                            . /tmp/venv/bin/activate
                            cd rag-api && pip install --no-cache -r requirements.txt && pytest src/tests
                            deactivate
                            rm -rf /tmp/venv
                            '''
                        } else {
                            sh "cd ${module} && ./mvnw test"
                        }
                    }
                }
            }
        }

        stage('Build Docker Image') {
            when {
                expression {
                    env.MODULES_TO_BUILD != null
                }
            }
            steps {
                script {
                    def modules = env.MODULES_TO_BUILD.split(',')
                    modules.each { module ->
                        echo "Building Docker image for module: ${module}"

                        if (module == 'ui') {
                            sh "cd ${module} && docker build -t ${REGISTRY}/${REGISTRY_USERNAME}/pbl-${module}:${DOCKER_TAG} ."
                        } else if (module == 'rag-api') {
                            sh "cd ${module} && docker build -t ${REGISTRY}/${REGISTRY_USERNAME}/pbl-${module}:${DOCKER_TAG} ."
                        } else {
                            sh "cd ${module} && ./mvnw -DskipTests package"
                            sh "cd ${module} && docker build -t ${REGISTRY}/${REGISTRY_USERNAME}/pbl-${module}:${DOCKER_TAG} ."
                        }
                    }
                }
            }
        }

        stage("Push to Container Registry") {
            when {
                expression {
                    env.MODULES_TO_BUILD != null
                }
            }

            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: "${DOCKER_CREDENTIALS_ID}", passwordVariable: 'PASSWORD', usernameVariable: 'USERNAME')]) {
                        sh 'echo $PASSWORD | docker login ${REGISTRY} -u $USERNAME --password-stdin'
                    }

                    def modules = env.MODULES_TO_BUILD.split(',')
                    modules.each { module ->
                        echo "Pushing Docker image for module: ${module}"
                        sh "docker push ${REGISTRY}/${REGISTRY_USERNAME}/pbl-${module}:${DOCKER_TAG}"
                    }
                }
            }
        }
    }

    post {
        always {
            sh 'docker stop postgres-test && docker rm postgres-test'
            cleanWs()
        }
    }
}