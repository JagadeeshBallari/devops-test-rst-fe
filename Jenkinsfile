pipeline {
    agent any

    tools {
        nodejs 'node-18'  // This must match the NodeJS tool name in Jenkins config
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm install'
            }
        }

        stage('Build') {
            steps {
                bat 'npm run build'  // Adjust if your build command is different
            }
        }

        // stage('Test') {
        //     steps {
        //         sh 'npm test'  // Optional, skip if no tests
        //     }
        // }
        stage('Archive Artifacts') {
            steps {
                archiveArtifacts artifacts: '.next/**', fingerprint: true
            }
        }
    }
}
