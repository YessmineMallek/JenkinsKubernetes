pipeline{
    agent any
    tools {nodejs "NODEJS14" }
    environment{
        dockerimagename="yessminemallek/nodeapp"
        dockerImage=""
        NEXUS_URL = 'http://localhost:8081/' 
        NEXUS_CREDENTIALS_ID = 'nexusId' 
        GROUP_NAME = 'npm-group-repo' 
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
                    bat 'del %USERPROFILE%\\.npmrc'          

                }
                
            }
        }
         
        stage('SonarQube Analysis') {
            steps {
                script {
                    withSonarQubeEnv('sonar') {
                        bat "npm run sonar --version"
                        bat "npm install sonar-scanner"
                        bat "npm run sonar"
                    }
                }
            }
        }
        
        
        stage('Publish to Nexus') {
         steps {
                
                withCredentials([usernamePassword(credentialsId: NEXUS_CREDENTIALS_ID)]) {
                   nexusArtifactUploader(
                        nexusVersion: 'nexus3',
                        protocol: 'http',
                        nexusUrl: NEXUS_URL,
                        groupId: GROUP_NAME,
                        version: tagG,
                        repository: 'myRepo',
                        credentialsId: NEXUS_CREDENTIALS_ID,
                        artifacts: [
                            [artifactId: 'myArchive',
                            type:'tgz',
                            classifier: '',
                            file: "node-app-0.0.1.tgz"]
                        ]
                    )
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