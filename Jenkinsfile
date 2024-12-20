pipeline{
    agent any
    tools {nodejs "NODEJS14" }
    environment{
        dockerimagename="yessminemallek/nodeapp:latest"
        dockerImage=""
        //Nexus    
        NEXUS_URL = 'localhost:8081' 
        NEXUS_CREDENTIALS_ID = 'nexus-cred' 
        REPO_NAME = 'npm-hosted-repo-jenkins'
        ARTIFACT_NAME = 'your-app-name' 
        VERSION = '1.0.${BUILD_NUMBER}'
        TEST_PORT=3002 
        TRIVY_HOST  ='D:/trivy_0.45.1_windows-64bit'
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
                        bat "npm run sonar --version"
                        bat "npm install sonar-scanner"
                        bat "npm run sonar"
                    }
                }
            }
        }
             
       stage("Build") {
            steps {
                  bat "npm install webpack webpack-cli --save-dev"
                  bat "npm run build"                    
                }    
        }
        
        stage('OWASP Dependency-Check Vulnerabilities') {
            steps {
                dependencyCheck additionalArguments: '--scan package.json --nvdApiKey 3a27b9a5-e7d0-4e1c-8c4e-e3c3b31599c9', odcInstallation: 'OWASP Dependency-Check Vulnerabilities'
                dependencyCheckPublisher pattern: '**/dependency-check-report.xml'
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
   
        
        stage('Build Docker image'){
            steps{
                script{
                    dockerImage = docker.build(dockerimagename)
                }
            }
        } 
        
        
        stage("Trivy") {
            steps {
                  bat "${TRIVY_HOST}/trivy.exe --version"
                  bat "${TRIVY_HOST}/trivy.exe image ${dockerimagename} > scan.txt"                    
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
       
        stage('K8S Deploy to Aks Cluster') {
            steps {
                script {
                    kubernetesDeploy(configs: "deploymentservice.yaml", kubeconfigId: "kubernetes",enableConfigSubstitution: true)
                }
            }
        }
    }
    
    post {
        success {
            echo "Build and deployment succeeded!"
        }
        
        failure {
            echo "Build or deployment failed."
        }
        
        always {
            emailext(
                subject: "Pipline status: ${BUILD_NUMBER}",
                body:'''
                <html>
                    <body>
                        <p> Build status : ${BUILD_STATUS} </p>
                        <p> Build Number : ${BUILD_NUMBER} </p>
                        <p> Check the <a href="${BUILD_URL}"> console output </a>.</p>

                    </body>
                </html>
                ''',
                to: 'mallek.yessmin@gmail.com',
                from: 'mallek.yessmin@gmail.com',
                replyTo : 'mallek.yessmin@gmail.com',
                mimeType : 'text/html' 
            )
            deleteDir() 
        }
    }
}