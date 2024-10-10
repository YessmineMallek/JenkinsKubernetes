pipeline{
    environment{
        dockerimagename="yessminemallek/nodeapp"
        dockerImage=""
    }
    
    agent any
    
    stages{
        stage("Checkout Source"){
            steps{
               git branch: 'main', credentialsId: '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', url: 'https://github.com/YessmineMallek/JenkinsKubernetes.git'
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
        
        stage('Deploying App to Kubernetes') {
            steps {
                script {
                    kubernetesDeploy(configs: "deploymentservice.yml", kubeconfigId: "kubernetes")
                }
            }
        }
        
    }
}