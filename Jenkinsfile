pipeline{
    agent any
    tools {nodejs "NODEJS14" }
    environment{
        dockerimagename="yessminemallek/nodeapp"
        dockerImage=""
        //Nexus    
        NEXUS_URL = 'localhost:8081' 
        NEXUS_CREDENTIALS_ID = 'nexus-cred' 
        REPO_NAME = 'npm-hosted-repo-jenkins'
        ARTIFACT_NAME = 'your-app-name' 
        VERSION = '1.0.${BUILD_NUMBER}' 
    }
   
    
    stages{
       
          stage('Clean Workspace') {
            steps {
                script {
                    deleteDir() 
                }
            }
        } 
        
        
        stage("Checkout Source"){
            steps{
                git branch: 'main', credentialsId: 'github', url: 'https://github.com/YessmineMallek/JenkinsKubernetes.git'
            }
        }
     
        stage("Install Dependencies") {
            steps {
                  withCredentials([file(credentialsId: 'nexussFileTokens', variable: 'mynpmrc')]) {
                    bat 'copy .npmrc %USERPROFILE%\\.npmrc'  
                    bat 'npm install'                       

                }
                
            }
        }
         
        stage('SonarQube Analysis') {
            steps {
                script {
                    withSonarQubeEnv('sonar') {
                        echo "sonaaar"
                        /*bat "npm run sonar --version"
                        bat "npm install sonar-scanner"
                        bat "npm run sonar"*/
                    }
                }
            }
        }
        
        
        stage('Publish to Nexus') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'nexusCredentials', 
                                                 usernameVariable: 'NEXUS_USERNAME', 
                                                 passwordVariable: 'NEXUS_PASSWORD')]) {
                    bat "npm config set registry=http://localhost:8081/repository/npm-hosted-repo-jenkins/"
                    bat """
                        echo //localhost:8081/repository/npm-hosted-repo-jenkins/:username=${NEXUS_USERNAME} >> .npmrc
                        echo //localhost:8081/repository/npm-hosted-repo-jenkins/:_password=${NEXUS_PASSWORD.bytes.encodeBase64().toString()} >> .npmrc
                        echo //localhost:8081/repository/npm-hosted-repo-jenkins/:email=mallek.yessmin@gmail.com >> .npmrc
                    """
                    bat "cat .npmrc"
                    bat 'npm publish --registry=http://localhost:8081/repository/npm-hosted-repo-jenkins/'
                    bat 'del .npmrc'
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