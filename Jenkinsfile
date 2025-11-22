pipeline {

    agent any

    environment {
        FRONTEND_SERVICE_NAME = 'frontend'
        FRONTEND_PORT = '3000'
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
                sh 'git log -1 --oneline'
            }
        }

        stage('Nettoyage') {
            steps {
                sh '''
                docker-compose down -v --remove-orphans || true
                docker rm -f mongodb backend frontend || true
                '''
            }
        }

        stage('Build Docker Images') {
            steps {
                sh 'docker-compose build --no-cache'
            }
        }

        stage('Start Containers') {
            steps {
                sh '''
                docker-compose up -d
                sleep 10
                docker-compose ps
                '''
            }
        }

        stage('Smoke Test Backend') {
            steps {
                sh '''
                echo "Testing backend on port 5000..."
                curl -sSf http://localhost:5000 || (echo "Backend FAILED" && exit 1)
                echo "Backend OK"
                '''
            }
        }

        stage('Smoke Test Frontend') {
            steps {
                sh '''
                echo "Testing frontend on port 3000..."
                curl -sSf http://localhost:3000 || (echo "Frontend FAILED" && exit 1)
                echo "Frontend OK"
                '''
            }
        }

    }

    post {
        always {
            sh 'docker-compose logs > logs.txt || true'
            archiveArtifacts artifacts: 'logs.txt', fingerprint: true
        }
    }
}
