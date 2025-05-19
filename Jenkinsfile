pipeline {
    agent any

    stages {
        stage('Clone Repository') {
            steps {
                git 'https://github.com/talhaDev07/taskmanager-mern.git'
            }
        }

        stage('Build with Docker Compose') {
            steps {
                sh 'docker-compose -p jenkins-taskflow -f docker-compose.yml up --build -d'
            }
        }
    }
}
