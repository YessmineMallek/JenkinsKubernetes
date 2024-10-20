pipeline{
    environment{
        dockerimagename="yessminemallek/nodeapp"
        dockerImage=""
    }
    tools {nodejs "NODEJS" }
    agent any
    
    stages{
        stage("Checkout Source"){
            steps{
               git branch: 'main', credentialsId: 'github', url: 'https://github.com/YessmineMallek/JenkinsKubernetes.git'
            }
        }
        stage("Install dependencies"){
            steps{
                script {bat  'npm install'}
            }
        }
        stage("build script"){
            steps{
                script {bat  'ng build '}
            }
        }
        stage('Build image'){
            steps{
                script{
                    dockerImage = docker.build(dockerimagename)
                }
            }
        }  
        stage('Publish Image'){
            environment{
                registryCredential='dockerhublogin'
            }
            steps{
                script{
                    docker.withRegistry('https://registry.hub.docker.com', registryCredential){
                        dockerImage.push("latest")
                    }
                }
            } 
        }
       stage('SonarQube Analysis') {
            steps {
                script {
                        bat 'sh npm install'
                        withSonarQubeEnv('sonar'){
                           bat 'sh npm install sonar-scanner'
                           bat 'sh npm run sonar'
                        }
                    }
                }
        }      
        stage('Deploying App to Kubernetes') {
            steps {
                script {
                    kubernetesDeploy(configs: "deploymentservice.yml", kubeconfigId: "kubernetes")
                }
            }
        }
        
    }
}