pipeline {
    agent any
    
    stages {
        stage('📥 Get Code from GitHub') {
            steps {
                echo '📥 Getting latest code from GitHub...'
                checkout scm
                echo '✅ Code downloaded successfully!'
            }
        }
        
        stage('🔍 Check Project') {
            steps {
                echo '🔍 Checking what files we have...'
                script {
                    if (isUnix()) {
                        sh 'ls -la'
                        sh 'echo "Current directory: $(pwd)"'
                    } else {
                        bat 'dir'
                        bat 'echo Current directory: %cd%'
                    }
                }
            }
        }
        
        stage('🐳 Build Docker Image') {
            steps {
                echo '🐳 Building Docker image for Snake Ladder game...'
                script {
                    def imageName = "snakeladder-game:${BUILD_NUMBER}"
                    def latestImage = "snakeladder-game:latest"
                    
                    if (isUnix()) {
                        // Build with build number tag
                        sh "docker build -t ${imageName} ."
                        // Tag the same image as latest
                        sh "docker tag ${imageName} ${latestImage}"
                    } else {
                        // Build with build number tag
                        bat "docker build -t ${imageName} ."
                        // Tag the same image as latest
                        bat "docker tag ${imageName} ${latestImage}"
                    }
                    
                    echo "✅ Docker image built: ${imageName}"
                }
            }
        }
        
        stage('🧪 Test Docker Image') {
            steps {
                echo '🧪 Testing if Docker image works...'
                script {
                    def containerName = "snakeladder-test-${BUILD_NUMBER}"
                    
                    try {
                        if (isUnix()) {
                            // Start container
                            sh "docker run -d --name ${containerName} -p 3001:3000 snakeladder-game:latest"
                            echo '⏳ Container started, testing...'
                            sleep 5
                            
                            // Check if container is still running
                            sh "docker ps | grep ${containerName}"
                            echo '✅ Docker image test completed!'
                            
                        } else {
                            // Start container
                            bat "docker run -d --name ${containerName} -p 3001:3000 snakeladder-game:latest"
                            echo '⏳ Container started, testing...'
                            sleep 5
                            
                            // Check if container is still running
                            bat "docker ps | findstr ${containerName}"
                            echo '✅ Docker image test completed!'
                        }
                        
                    } catch (Exception e) {
                        echo "❌ Test failed: ${e.getMessage()}"
                        throw e
                    } finally {
                        // Always clean up test container
                        if (isUnix()) {
                            sh "docker stop ${containerName} || true"
                            sh "docker rm ${containerName} || true"
                        } else {
                            bat "docker stop ${containerName} || exit 0"
                            bat "docker rm ${containerName} || exit 0"
                        }
                    }
                }
            }
        }
        
        stage('🚀 Deploy Game') {
            steps {
                echo '🚀 Deploying Snake Ladder game...'
                script {
                    try {
                        // Stop existing container if running
                        echo '🛑 Stopping existing game container...'
                        if (isUnix()) {
                            sh 'docker stop snakeladder-game || true'
                            sh 'docker rm snakeladder-game || true'
                        } else {
                            bat 'docker stop snakeladder-game || exit 0'
                            bat 'docker rm snakeladder-game || exit 0'
                        }
                    } catch (Exception e) {
                        echo 'No existing container to stop'
                    }
                    
                    // Start new container
                    echo '🎮 Starting new game container...'
                    if (isUnix()) {
                        sh 'docker run -d --name snakeladder-game -p 3000:3000 snakeladder-game:latest'
                    } else {
                        bat 'docker run -d --name snakeladder-game -p 3000:3000 snakeladder-game:latest'
                    }
                    
                    echo '🎉 Snake Ladder game is now running!'
                    echo '🌐 Access your game at: http://localhost:3000'
                }
            }
        }
    }
    
    post {
        always {
            echo '🏁 Pipeline finished!'
            // Clean up any leftover test containers
            script {
                def containerName = "snakeladder-test-${BUILD_NUMBER}"
                if (isUnix()) {
                    sh "docker stop ${containerName} || true"
                    sh "docker rm ${containerName} || true"
                } else {
                    bat "docker stop ${containerName} || exit 0"
                    bat "docker rm ${containerName} || exit 0"
                }
            }
        }
        success {
            echo '🎉 SUCCESS! Your Snake Ladder game is deployed!'
            echo '🌐 Play your game at: http://localhost:3000'
        }
        failure {
            echo '❌ Something went wrong. Check the logs above.'
        }
    }
}
