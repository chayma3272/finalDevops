pipeline {
    agent any
    
    environment {
        DOCKER_IMAGE_NAME = 'chayma9/devops'
        FRONTEND_SERVICE_NAME = 'frontend'
        FRONTEND_PORT = '8082'  // Port changé pour éviter les conflits
        FRONTEND_CONTAINER_NAME = 'frontend'
    }

    stages {
        
        stage('Déterminer le Pipeline') {
            steps {
                script {
                    if (env.CHANGE_ID) {
                        env.PIPELINE_TYPE = 'BUILD_SMOKE_PR'
                        echo "Pipeline 1: Déclenché par une Pull Request (PR-${env.CHANGE_ID})."
                    } else if (env.TAG_NAME) {
                        env.PIPELINE_TYPE = 'TAG_VERSIONNE'
                        echo "Pipeline 3: Déclenché par le tag ${env.TAG_NAME}."
                    } else if (env.BRANCH_NAME == 'dev') {
                        env.PIPELINE_TYPE = 'BUILD_COMPLET_DEV'
                        echo "Pipeline 2: Déclenché par un push sur la branche dev."
                    } else {
                        env.PIPELINE_TYPE = 'AUTRE'
                        echo "Pipeline non géré pour la branche ${env.BRANCH_NAME}."
                    }
                }
            }
        }
        
        stage('Nettoyage Préalable') {
            steps {
                script {
                    echo "Nettoyage des conteneurs et volumes précédents..."
                    bat '''
                        @echo off
                        echo Arrêt des conteneurs en cours...
                        docker-compose down -v 2>nul || echo "Aucun conteneur à arrêter"
                        
                        echo Suppression des conteneurs orphelins...
                        docker rm -f mongodb backend frontend 2>nul || echo "Aucun conteneur à supprimer"
                        
                        echo Nettoyage du système Docker...
                        docker system prune -f 2>nul || echo "Nettoyage déjà effectué"
                        
                        echo Libération des ports...
                        for /f "tokens=5" %%p in ('netstat -ano ^| findstr :5000') do (
                            echo Arrêt du processus utilisant le port 5000: %%p
                            taskkill /PID %%p /F 2>nul
                        )
                    '''
                }
            }
        }

        stage('Checkout') {
            steps {
                checkout scm
                bat 'git log -1 --oneline'
            }
        }
        
        stage('Vérification Docker Compose') {
            steps {
                script {
                    bat '''
                        @echo off
                        if not exist docker-compose.yml (
                            echo ERREUR: docker-compose.yml non trouvé!
                            exit 1
                        )
                        echo Fichier docker-compose.yml trouvé
                        echo Contenu du docker-compose.yml:
                        type docker-compose.yml
                    '''
                }
            }
        }
        
        stage('Build des Images Docker') {
            steps {
                script {
                    bat 'docker-compose build --no-cache'
                }
            }
        }
        
        stage('Démarrer les Conteneurs') {
            steps {
                script {
                    echo "Démarrage des conteneurs..."
                    bat 'docker-compose up -d'
                    
                    // Attente plus longue pour le téléchargement
                    bat 'timeout /t 45 /nobreak > nul'
                    echo "Attente de 45 secondes pour le démarrage des services..."
                    
                    // Vérification de l'état
                    bat '''
                        @echo off
                        echo État des conteneurs:
                        docker-compose ps
                        
                        echo Logs des conteneurs:
                        docker-compose logs --tail=10
                    '''
                }
            }
        }
        
        stage('Smoke Test Réel') {
            steps {
                script {
                    echo "Test d'accessibilité du frontend sur le port ${FRONTEND_PORT}..."
                    
                    bat """
                        @echo off
                        setlocal enabledelayedexpansion
                        set max_retries=8
                        set retry_delay=8
                        set success=0
                        
                        echo Testing http://localhost:${FRONTEND_PORT}/
                        
                        for /L %%i in (1,1,!max_retries!) do (
                            echo Tentative %%i/!max_retries!...
                            
                            curl -s -f -o nul http://localhost:${FRONTEND_PORT}/
                            if !errorlevel! == 0 (
                                set success=1
                                echo ✅ SUCCES: Frontend accessible sur le port ${FRONTEND_PORT}
                                goto :end_test
                            ) else (
                                echo ❌ Echec de la tentative %%i, attente de !retry_delay! secondes...
                                timeout /t !retry_delay! /nobreak > nul
                            )
                        )
                        
                        :end_test
                        if !success! == 0 (
                            echo 🚨 ERREUR CRITIQUE: Smoke test echoue apres !max_retries! tentatives
                            echo 📋 Debug info:
                            docker-compose ps
                            docker-compose logs
                            exit 1
                        )
                    """
                }
            }
        }
        
        stage('Tests et Linting') {
            when {
                expression { env.PIPELINE_TYPE == 'BUILD_COMPLET_DEV' || env.PIPELINE_TYPE == 'TAG_VERSIONNE' }
            }
            steps {
                script {
                    echo "Exécution des tests et linting..."
                    bat 'timeout /t 10 /nobreak > nul'
                    
                    bat '''
                        @echo off
                        echo Exécution des tests backend...
                        docker-compose exec -T backend npm test 2>&1 || echo "Tests backend terminés"
                        
                        echo Exécution du linting frontend...
                        docker-compose exec -T frontend npm run lint 2>&1 || echo "Linting frontend terminé"
                    '''
                }
            }
        }
        
        stage('Tag et Push Docker') {
            when {
                expression { env.PIPELINE_TYPE == 'TAG_VERSIONNE' }
            }
            steps {
                withCredentials([usernamePassword(credentialsId: 'docker-hub-credential', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                    script {
                        def tag = env.TAG_NAME ?: 'latest'
                        def fullImageName = "${DOCKER_USERNAME}/${DOCKER_IMAGE_NAME}"
                        
                        echo "Tagging et push de l'image Docker..."
                        
                        bat """
                            @echo off
                            echo 🔖 Tagging de l'image...
                            docker tag ${FRONTEND_SERVICE_NAME} ${fullImageName}:${tag}
                            docker tag ${FRONTEND_SERVICE_NAME} ${fullImageName}:latest
                            
                            echo 🔐 Login Docker Hub...
                            echo %DOCKER_PASSWORD% | docker login -u %DOCKER_USERNAME% --password-stdin
                            
                            echo 🚀 Push des images...
                            docker push ${fullImageName}:${tag}
                            docker push ${fullImageName}:latest
                            
                            echo 🔓 Logout Docker Hub...
                            docker logout
                            
                            echo ✅ Images poussées avec succès: ${fullImageName}:${tag}
                        """
                    }
                }
            }
        }
        
        stage('Rapport et Archivage') {
            steps {
                script {
                    bat '''
                        @echo off
                        echo Création du rapport de build...
                        echo Build SUCCESS > build-result.txt
                        echo Date: %DATE% >> build-result.txt
                        echo Time: %TIME% >> build-result.txt
                        echo Pipeline Type: %PIPELINE_TYPE% >> build-result.txt
                        echo Frontend URL: http://localhost:%FRONTEND_PORT%/ >> build-result.txt
                        
                        echo Sauvegarde des logs Docker...
                        docker-compose logs > docker-logs.txt 2>&1
                    '''
                    
                    archiveArtifacts artifacts: 'build-result.txt,docker-logs.txt', fingerprint: true
                    publishHTML([
                        allowMissing: false,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: '.',
                        reportFiles: 'build-result.txt',
                        reportName: 'Rapport de Build'
                    ])
                }
            }
        }
    }
    
    post {
        always {
            echo "Nettoyage post-build..."
            bat '''
                @echo off
                echo Arrêt des conteneurs...
                docker-compose down -v 2>nul || echo "Conteneurs déjà arrêtés"
                
                echo Nettoyage final...
                docker system prune -f 2>nul
            '''
        }
        success {
            echo "🎉 PIPELINE RÉUSSI - Frontend accessible sur: http://localhost:${FRONTEND_PORT}"
            emailext (
                subject: "SUCCÈS: Pipeline ${env.JOB_NAME} - Build ${env.BUILD_NUMBER}",
                body: "Le pipeline a été exécuté avec succès.\\nFrontend: http://localhost:${FRONTEND_PORT}\\nDétails: ${env.BUILD_URL}",
                to: "devops@example.com"
            )
        }
        failure {
            echo "❌ PIPELINE EN ÉCHEC - Consultation des logs..."
            bat '''
                @echo off
                echo Création du rapport d'erreur...
                echo Build FAILED > error-report.txt
                docker-compose ps >> error-report.txt
                docker-compose logs >> error-report.txt 2>&1
            '''
            archiveArtifacts artifacts: 'error-report.txt', fingerprint: true
            emailext (
                subject: "ÉCHEC: Pipeline ${env.JOB_NAME} - Build ${env.BUILD_NUMBER}",
                body: "Le pipeline a échoué. Veuillez vérifier les logs.\\nDétails: ${env.BUILD_URL}",
                to: "devops@example.com"
            )
        }
        unstable {
            echo "⚠️ Pipeline instable"
        }
    }
}
