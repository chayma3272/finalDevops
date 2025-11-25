pipeline {
    agent any

    environment {
        FRONTEND_PORT = '3001'
        BACKEND_PORT = '5000'
        MONGODB_PORT = '27017'
        DOCKER_IMAGE_NAME = 'chayma9/devops'
        FRONTEND_SERVICE_NAME = 'frontend'
        BACKEND_SERVICE_NAME = 'backend'
    }

    stages {

        stage('Determine Pipeline') {
            steps {
                script {
                    if (env.CHANGE_ID) {
                        env.PIPELINE_TYPE = 'BUILD_SMOKE_PR'
                        echo "Pipeline 1: Pull Request (PR-${env.CHANGE_ID})"
                    } else if (env.TAG_NAME && env.TAG_NAME =~ /^v\d+\.\d+\.\d+$/) {
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

        stage('Checkout') {
            steps {
                checkout scm
                bat 'git log -1 --oneline'
            }
        }

        stage('Setup') {
            steps {
                parallel(
                    "Setup Frontend": {
                        dir('client') {
                            bat 'npm install'
                        }
                    },
                    "Setup Backend": {
                        dir('server') {
                            bat 'npm install'
                        }
                    }
                )
            }
        }

        stage('Build Docker') {
            steps {
                bat 'docker-compose build --no-cache'
            }
        }

        stage('Run Docker') {
            steps {
                bat 'docker-compose up -d'
                bat 'ping 127.0.0.1 -n 16 > nul' // simulate sleep
            }
        }

        stage('Smoke Test') {
            steps {
                bat 'curl -sSf http://localhost:3001 || exit 1'
                bat 'echo Smoke Test Passed > smoke-test-result.txt'
            }
        }

        stage('Tests Unitaires & Linting') {
            when {
                expression { env.PIPELINE_TYPE == 'BUILD_COMPLET_DEV' || env.PIPELINE_TYPE == 'TAG_VERSIONNE' }
            }
            steps {
                parallel(
                    "Frontend Tests": {
                        dir('client') { bat 'echo Tests frontend simulés' }
                    },
                    "Backend Tests": {
                        dir('server') { bat 'echo Tests backend simulés' }
                    }
                )
            }
        }

        stage('Tag & Push Docker (Tag Versionné uniquement)') {
            when {
                expression { env.PIPELINE_TYPE == 'TAG_VERSIONNE' }
            }
            steps {
                withCredentials([usernamePassword(credentialsId: 'id', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                    script {
                        def tag = env.TAG_NAME
                        def fullImageName = "${DOCKER_USERNAME}/${DOCKER_IMAGE_NAME}"
                        bat """
                        docker tag ${FRONTEND_SERVICE_NAME}:latest ${fullImageName}:${tag}
                        docker tag ${FRONTEND_SERVICE_NAME}:latest ${fullImageName}:latest
                        echo %DOCKER_PASSWORD% | docker login -u %DOCKER_USERNAME% --password-stdin
                        docker push ${fullImageName}:${tag}
                        docker push ${fullImageName}:latest
                        """
                    }
                }
            }
        }

        stage('Archive Artifacts') {
            steps {
                bat 'docker-compose logs > build.log || exit 0'
                bat 'echo Simulated test results > test-results.json || exit 0'
                archiveArtifacts artifacts: 'smoke-test-result.txt, build.log, test-results.json', fingerprint: true
            }
        }

        stage('Cleanup') {
            steps {
                bat 'docker-compose down -v --remove-orphans || exit 0'
            }
        }

    } // end stages

    post {
        success {
            echo "Pipeline terminé avec succès !"
        }
        failure {
            echo "Pipeline terminé avec échec. Vérifiez les logs."
        }
        always {
            bat 'docker-compose down -v || exit 0'
        }
    }
}
