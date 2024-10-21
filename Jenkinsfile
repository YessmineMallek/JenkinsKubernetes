pipeline{
    agent any
    tools {nodejs "NODEJS14" }
    environment{
        dockerimagename="yessminemallek/nodeapp"
        dockerImage=""
    }
   
    
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
       
       stage('SonarQube Analysis') {
            steps {
                script {
                        withSonarQubeEnv('sonar'){
                           bat 'sh npm install sonar-scanner'
                           bat 'sh npm run sonar'
                        }
                    }
                }
        }  
        stage('Build from nexus') {
            steps {
                    withCredentials([file(credentialsId: 'nexusCode', variable: 'nexusnpm')]) {
                        bat "npm install --userconfig $nexusnpm --registry http://192.168.1.66:8081/repository/group-node-app --loglevel verbose"
                    }
                }
        }    
        stage('Build image'){
            steps{
                script{
                    dockerImage = docker.build(dockerimagename)
                }
            }
        }  
        stage('Publish Image to docker hub'){
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
       
        stage('Deploying App to Kubernetes') {
            steps {
                script {
                    kubernetesDeploy(configs: "deploymentservice.yml", kubeconfigId: "kubernetes")
                }
            }
        }
        
        
        
    }
}