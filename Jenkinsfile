pipeline {
    agent any

    environment {
        // Variables globales
    FRONTEND_PORT = '3000'
    BACKEND_PORT = '5000'
    MONGODB_PORT = '27017'
    DOCKER_IMAGE_NAME = 'chayma9/devops' 
    }

    stages {

        stage('Déterminer le Pipeline') {
            steps {
                script {
                    if (env.CHANGE_ID) {
                        env.PIPELINE_TYPE = 'BUILD_SMOKE_PR'
                        echo "Pipeline 1: Pull Request (PR-${env.CHANGE_ID})"
                    } else if (env.TAG_NAME) {
                        env.PIPELINE_TYPE = 'TAG_VERSIONNE'
                        echo "Pipeline 3: Tag ${env.TAG_NAME} sur la branche ${env.BRANCH_NAME}"
                    } else if (env.BRANCH_NAME == 'dev') {
                        env.PIPELINE_TYPE = 'BUILD_COMPLET_DEV'
                        echo "Pipeline 2: Push sur dev"
                    } else {
                        env.PIPELINE_TYPE = 'AUTRE'
                        echo "Pipeline non géré pour ${env.BRANCH_NAME}"
                    }
                }
            }
        }

        stage('Nettoyage Préalable') {
            steps {
                script {
                    if (isUnix()) {
                        sh '''
                        docker-compose down -v --rmi all --remove-orphans || true
                        docker rm -f mongodb backend frontend || true
                        '''
                    } else {
                        bat '''
                        docker-compose down -v --rmi all --remove-orphans || exit 0
                        docker rm -f mongodb backend frontend || exit 0
                        '''
                    }
                }
            }
        }

        stage('Checkout') {
            steps {
                checkout scm
                script {
                    if (isUnix()) {
                        sh 'git log -1 --oneline'
                    } else {
                        bat 'git log -1 --oneline'
                    }
                }
            }
        }

        stage('Build des Images Docker') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'docker-compose build --no-cache'
                    } else {
                        bat 'docker-compose build'
                    }
                }
            }
        }

stage('Démarrer les Conteneurs') {
    steps {
        script {
            if (isUnix()) {
                sh '''
                docker-compose up -d
                sleep 15
                '''
            } else {
                bat '''
                docker-compose up -d
                ping 127.0.0.1 -n 16 > nul
                '''
            }
        }
    }
}

        stage('Smoke Test') {
            steps {
                script {
                    if (isUnix()) {
                        sh '''
                        echo "Smoke Test Frontend sur le port ${FRONTEND_PORT}"
                        curl -sSf http://localhost:${FRONTEND_PORT} || (echo "FAIL" && exit 1)
                        echo "Smoke Test OK"
                        '''
                    } else {
                        bat 'echo "Smoke Test Frontend simulé"'
                    }
                }
            }
        }

        stage('Tests et Linting (dev & tag)') {
            when {
                expression { env.PIPELINE_TYPE == 'BUILD_COMPLET_DEV' || env.PIPELINE_TYPE == 'TAG_VERSIONNE' }
            }
            steps {
                script {
                    echo "Exécution des tests et linting..."
                    if (isUnix()) {
                        sh '''
                        echo "Tests unitaires et linting simulés"
                        '''
                    } else {
                        bat 'echo "Tests unitaires et linting simulés"'
                    }
                }
            }
        }

        stage('Tag et Push Docker (tag uniquement)') {
            when {
                expression { env.PIPELINE_TYPE == 'TAG_VERSIONNE' }
            }
            steps {
                withCredentials([usernamePassword(credentialsId: 'id', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {

                    script {
                        def tag = env.TAG_NAME
                        def fullImageName = "${DOCKER_USERNAME}/${DOCKER_IMAGE_NAME}"
                        if (isUnix()) {
                            sh """
                            docker tag ${FRONTEND_SERVICE_NAME}:latest ${fullImageName}:${tag}
                            docker tag ${FRONTEND_SERVICE_NAME}:latest ${fullImageName}:latest
                            echo ${DOCKER_PASSWORD} | docker login -u ${DOCKER_USERNAME} --password-stdin
                            docker push ${fullImageName}:${tag}
                            docker push ${fullImageName}:latest
                            """
                        } else {
                            bat """
                            docker tag ${FRONTEND_SERVICE_NAME}:latest ${fullImageName}:${tag}
                            docker tag ${FRONTEND_SERVICE_NAME}:latest ${fullImageName}:latest
                            echo %DOCKER_PASSWORD% | docker login -u %DOCKER_USERNAME% --password-stdin
                            docker push ${fullImageName}:${tag}
                            docker push ${fullImageName}:latest
                            """
                        }
                        echo "Docker images poussées : ${fullImageName}:${tag} et latest"
                    }
                }
            }
        }

        stage('Archivage des Artefacts') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'echo "Smoke Test Passed" > smoke-test-result.txt'
                    } else {
                        bat 'echo Smoke Test Passed > smoke-test-result.txt'
                    }
                    archiveArtifacts artifacts: 'smoke-test-result.txt', fingerprint: true
                }
            }
        }
    }

    post {
        always {
            script {
                if (isUnix()) {
                    sh 'docker-compose down -v || true'
                } else {
                    bat 'docker-compose down -v || exit 0'
                }
            }
        }
        success {
            echo 'Pipeline terminé avec succès !'
        }
        failure {
            echo 'Pipeline terminé avec échec. Vérifiez les logs.'
        }
    }
}
