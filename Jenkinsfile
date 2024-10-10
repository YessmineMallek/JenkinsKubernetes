pipeline{
    environment{
        dockerimagename="yessminemallek/nodeapp"
        dockerImage=""
    }
    
    agent any
    
    stages{
        stage("Checkout Source"){
            steps{
               git branch: 'main', credentialsId: 'github', url: 'https://github.com/YessmineMallek/JenkinsKubernetes.git'
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
                            sh 'npm install sonar-scanner'
                            sh 'npm run sonar'
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