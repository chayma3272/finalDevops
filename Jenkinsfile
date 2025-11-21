// Jenkinsfile pour le projet MERN-Todo-DevOps
// Implémente les trois pipelines requis : PR, Dev Push, et Tag Versionné.

pipeline {
    agent any
    
    // Définition des variables globales
    environment {
        // Le nom de l'image Docker sera "chayma9/devops"
        DOCKER_IMAGE_NAME = 'chayma9/devops'
        // Le nom du service frontend dans docker-compose.yml est 'frontend'
        FRONTEND_SERVICE_NAME = 'frontend'
        // Le port exposé par le frontend dans docker-compose.yml est 8080 (hôte)
        FRONTEND_PORT = '8080'
        // Le nom du conteneur frontend est 'frontend' (défini dans docker-compose.yml)
        FRONTEND_CONTAINER_NAME = 'frontend'
    }

    stages {
        
        stage('Déterminer le Pipeline') {
            steps {
                script {
                    // Déterminer le type de build (PR, Dev, Tag)
                    if (env.BRANCH_NAME == 'dev') {
                        if (env.TAG_NAME) {
                            env.PIPELINE_TYPE = 'TAG_VERSIONNE'
                            echo "Pipeline 3: Déclenché par le tag ${env.TAG_NAME} sur dev."
                        } else {
                            env.PIPELINE_TYPE = 'BUILD_COMPLET_DEV'
                            echo "Pipeline 2: Déclenché par un push sur la branche dev."
                        }
                    } else if (env.BRANCH_NAME.startsWith('PR-') || env.CHANGE_ID) {
                        env.PIPELINE_TYPE = 'BUILD_SMOKE_PR'
                        echo "Pipeline 1: Déclenché par une Pull Request."
                    } else {
                        env.PIPELINE_TYPE = 'AUTRE'
                        echo "Pipeline non géré pour la branche ${env.BRANCH_NAME}."
                        // Optionnel: fail fast si ce n'est pas une branche gérée
                        // error "Pipeline non géré pour la branche ${env.BRANCH_NAME}."
                    }
                }
            }
        }
        
        stage('Checkout') {
            steps {
                // Récupère le code
                checkout scm
                sh 'git log -1 --oneline'
            }
        }
        
        stage('Build des Images Docker') {
            steps {
                script {
                    // Utiliser docker-compose pour construire les images (client et server)
                    sh 'docker-compose build'
                }
            }
        }
        
        stage('Démarrer les Conteneurs') {
            steps {
                script {
                    // Démarrer les services en arrière-plan (mongodb, backend, frontend)
                    sh 'docker-compose up -d'
                    // Attendre quelques secondes pour que les services démarrent
                    sh 'sleep 10'
                }
            }
        }
        
        stage('Smoke Test') {
            steps {
                script {
                    // Exécuter le script de smoke test sur le service frontend
                    // Le script vérifie l'accessibilité sur le port 8080 de l'hôte
                    sh "./smoke-test.sh ${FRONTEND_CONTAINER_NAME} ${FRONTEND_PORT}"
                }
            }
        }
        
        stage('Tests et Linting (Pipeline 2 & 3 uniquement)') {
            when {
                expression { env.PIPELINE_TYPE == 'BUILD_COMPLET_DEV' || env.PIPELINE_TYPE == 'TAG_VERSIONNE' }
            }
            steps {
                script {
                    // Simuler des tests plus complets (à implémenter si nécessaire)
                    echo "Exécution des tests unitaires et du linting..."
                    // sh 'docker-compose exec backend npm test'
                    // sh 'docker-compose exec frontend npm run lint'
                    sh 'echo "Tests unitaires et Linting simulés avec succès."'
                }
            }
        }
        
        stage('Tag et Push Docker (Pipeline 3 uniquement)') {
            when {
                expression { env.PIPELINE_TYPE == 'TAG_VERSIONNE' }
            }
            steps {
                withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                    script {
                        def tag = env.TAG_NAME
                        def fullImageName = "${DOCKER_USERNAME}/${DOCKER_IMAGE_NAME}"
                        
                        // 1. Tagger l'image du frontend (React/Nginx)
                        sh "docker tag ${FRONTEND_SERVICE_NAME}:latest ${fullImageName}:${tag}"
                        sh "docker tag ${FRONTEND_SERVICE_NAME}:latest ${fullImageName}:latest"
                        
                        // 2. Se connecter et pousser les images
                        sh "echo \"${DOCKER_PASSWORD}\" | docker login -u ${DOCKER_USERNAME} --password-stdin"
                        sh "docker push ${fullImageName}:${tag}"
                        sh "docker push ${fullImageName}:latest"
                        
                        echo "Image Docker ${fullImageName}:${tag} et :latest poussées sur Docker Hub."
                    }
                }
            }
        }
        
        stage('Nettoyage et Archivage') {
            steps {
                script {
                    // Arrêter et supprimer les conteneurs et le réseau
                    sh 'docker-compose down -v'
                    
                    // Archivage des artefacts (logs, résultats de tests, etc.)
                    // Créer un fichier de log simulé pour l'archivage
                    sh 'echo "Smoke Test Passed" > smoke-test-result.txt'
                    archiveArtifacts artifacts: 'smoke-test-result.txt', fingerprint: true
                }
            }
        }
    }
    
    post {
        always {
            // S'assurer que les conteneurs sont arrêtés même en cas d'échec
            sh 'docker-compose down -v || true'
        }
        success {
            echo 'Pipeline terminé avec succès !'
        }
        failure {
            echo 'Pipeline terminé avec échec. Vérifiez les logs.'
        }
    }
}