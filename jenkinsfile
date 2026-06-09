pipeline {
    agent any

    environment {
        ACR_NAME            = 'lokkadevopsacr'
        ACR_LOGIN           = 'lokkadevopsacr.azurecr.io'
        IMAGE               = 'devops-project'
        RG                  = 'lokka-devops-rg'
        AKS                 = 'lokka-devops-aks'
        SUBSCRIPTION        = 'be6974ca-26a7-41ac-a5e6-ba2577ca2e81'
        AZURE_CLIENT_ID     = credentials('azure-client-id')
        AZURE_CLIENT_SECRET = credentials('azure-client-secret')
        AZURE_TENANT_ID     = credentials('azure-tenant-id')
    }

    stages {
        stage('Checkout') {
            steps { checkout scm }
        }

        stage('Build') {
            steps {
                sh 'docker build -t $ACR_LOGIN/$IMAGE:$BUILD_NUMBER .'
            }
        }

        stage('Test') {
            steps {
                sh 'docker run --rm $ACR_LOGIN/$IMAGE:$BUILD_NUMBER npm test'
            }
        }

        stage('Azure Login') {
            steps {
                sh '''
                  az login --service-principal -u $AZURE_CLIENT_ID -p $AZURE_CLIENT_SECRET --tenant $AZURE_TENANT_ID
                  az account set --subscription $SUBSCRIPTION
                '''
            }
        }

        stage('Push') {
            steps {
                sh '''
                  az acr login --name $ACR_NAME
                  docker push $ACR_LOGIN/$IMAGE:$BUILD_NUMBER
                '''
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                  az aks get-credentials --resource-group $RG --name $AKS --overwrite-existing
                  kubectl set image deployment/devops-app devops-app=$ACR_LOGIN/$IMAGE:$BUILD_NUMBER
                  kubectl rollout status deployment/devops-app
                '''
            }
        }
    }
}