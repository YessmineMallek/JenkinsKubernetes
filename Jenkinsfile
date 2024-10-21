pipeline{
    agent any
    tools {nodejs "NODEJS14" }
    environment{
        dockerimagename="yessminemallek/nodeapp"
        dockerImage=""
        NEXUS_URL = 'http://localhost:8081/' 
        NEXUS_CREDENTIALS_ID = 'nexusId' 
        REPO_NAME = 'npm-group-repo' // Update with your Nexus repository name
        ARTIFACT_NAME = 'your-app-name' // Update with your application name
        VERSION = '1.0.${BUILD_NUMBER}' // Versioning scheme
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
                    bat 'cp .npmrc ~/.npmrc'
                    bat 'npm install'
                    bat 'rm ~/.npmrc'
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
                withCredentials([usernamePassword(credentialsId: NEXUS_CREDENTIALS_ID, passwordVariable: 'NEXUS_PASSWORD', usernameVariable: 'read_write_user')]) {
                    bat 'npm pack'  // This will create a .tgz file of your package
                    def artifactFile = "${ARTIFACT_NAME}-${VERSION}.tgz" // Dynamically create artifact name
                    // Publish to Nexus using curl
                    bat "curl -v -u %read_write_user%:%NEXUS_PASSWORD% --upload-file %WORKSPACE%\\${artifactFile} ${NEXUS_URL}/repository/${REPO_NAME}/${artifactFile}"
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