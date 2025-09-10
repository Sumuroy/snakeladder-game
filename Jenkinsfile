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
                    
                    // Build the Docker image
                    docker.build(imageName)
                    
                    // Also tag as latest
                    docker.build(latestImage)
                    
                    echo "✅ Docker image built: ${imageName}"
                }
            }
        }
        
        stage('🧪 Test Docker Image') {
            steps {
                echo '🧪 Testing if Docker image works...'
                script {
                    // Test that the image can run
                    docker.image("snakeladder-game:latest").withRun('-p 3001:3000') { container ->
                        echo '⏳ Container started, testing...'
                        sleep 5
                        echo '✅ Docker image test completed!'
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
