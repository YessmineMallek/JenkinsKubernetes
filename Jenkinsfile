pipeline{
    agent any
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
                script {
                   bat "npm cache clean --force"
                   bat "rm -f package-lock.json"
                   bat "npm config set registry https://registry.npmjs.org/"
                   bat "npm install"
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
         
        stage('Run Tests') {
            steps {
                script{bat 'npm run test'}
            }
        }
        
        stage('Publish to Nexus') {
            steps {
                script {
                    def packageJson = readJSON file: 'package.json'
                    packageJson.version = VERSION
                    writeJSON file: 'package.json', json: packageJson
                }
                withCredentials([usernamePassword(credentialsId: NEXUS_CREDENTIALS_ID, passwordVariable: 'NEXUS_PASSWORD', usernameVariable: 'read_write_user')]) {
                    bat "npm publish --registry=${NEXUS_URL}/repository/${REPO_NAME}/ --username=${NEXUS_USER} --password=${NEXUS_PASS}"
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