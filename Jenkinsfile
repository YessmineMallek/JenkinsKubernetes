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
           steps {
                  script{
                    withCredentials([file(credentialsId: 'nexusId', variable: 'nexusFile')]) {
                        bat "npm install --userconfig $nexusFile --registry http://localhost:8081/repository/npm-group-repo --loglevel verbose"
                    }
                  }    
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