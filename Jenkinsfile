pipeline {
    agent any
    parameters {
        choice(name: 'build-env', choices: ['prod', 'pre-prod'], description: 'Select the environment of the build')
    }
    environment {
        REGISTRY = "ghcr.io"
        REGISTRY_USERNAME = "abhirambsn"
        DOCKER_CREDS_ID = 'github-docker-creds'
        DOCKER_TAG = "${params['build-env']}"
    }
    stages {
        stage('Determine Modules to Build') {
            steps {
                stage('Checkout') {
                    checkout scm
                }
            }
        }

        stage('Determine Modules to Build') {
            steps {
                script {
                    def changes = sh(script: "git diff --name-only HEAD~1 HEAD", returnStdout: true).trim().split('\n')

                    def modulesToBuild = []

                    if (changes.any { it.startsWith('api-gateway/') }) {
                        modulesToBuild.add('api-gateway')
                    }
                    if (changes.any { it.startsWith('discovery-server/') }) {
                        modulesToBuild.add('discovery-server')
                    }
                    if (changes.any { it.startsWith('chat-api/') }) {
                        modulesToBuild.add('chat-api')
                    }
                    if (changes.any { it.startsWith('profile-api/') }) {
                        modulesToBuild.add('profile-api')
                    }
                    if (changes.any { it.startsWith('rag-api/') }) {
                        modulesToBuild.add('rag-api')
                    }
                    if (changes.any { it.startsWith('ui/') }) {
                        modulesToBuild.add('ui')
                    }

                    if (modulesToBuild) {
                        env.MODULES_TO_BUILD = modulesToBuild.join(',')
                    } else {
                        error('No modules to build')
                    }

                    echo "Modules to build: ${env.MODULES_TO_BUILD}"
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
                            sh "cd ${module} && pip install --no-cache -r requirements.txt && pytest src/tests"
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
                            sh "docker build -t ${REGISTRY}/${REGISTRY_USERNAME}/pbl-${module}:${DOCKER_TAG} ."
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
            cleanWs()
        }
    }
}