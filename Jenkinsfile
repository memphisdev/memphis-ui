def gitBranch = env.BRANCH_NAME
def imageName = "memphis-ui"
def gitURL = "git@github.com:Memphisdev/memphis-ui.git"
def repoUrlPrefix = "memphisos"
def test_suffix = "test"

String unique_id = org.apache.commons.lang.RandomStringUtils.random(4, false, true)

node {
  git credentialsId: 'main-github', url: gitURL, branch: gitBranch
  def versionTag = readFile "./version.conf"
  
  try{
	  
    stage('Login to Docker Hub') {
      withCredentials([usernamePassword(credentialsId: 'docker-hub', usernameVariable: 'DOCKER_HUB_CREDS_USR', passwordVariable: 'DOCKER_HUB_CREDS_PSW')]) {
	sh 'docker login -u $DOCKER_HUB_CREDS_USR -p $DOCKER_HUB_CREDS_PSW'
      }
    }
	  
	  
    ////////////////////////////////////////
    ////////////  Build & Push  ////////////
    ////////////////////////////////////////


    stage('Build and push image to Docker Hub') {
    	  sh "docker buildx build --push --tag ${repoUrlPrefix}/${imageName}-${gitBranch}:${versionTag} --tag ${repoUrlPrefix}/${imageName}-${gitBranch} --platform linux/amd64,linux/arm64 ."
    }
	  
	  
    ///////////////////////////////////////
    //////////////  SANDBOX  //////////////
    ///////////////////////////////////////

      stage('Push to sandbox'){
        sh "aws eks --region eu-central-1 update-kubeconfig --name sandbox-cluster"
	sh "rm -rf memphis-infra"
      	dir ('memphis-infra'){
       	  git credentialsId: 'main-github', url: 'git@github.com:memphisdev/memphis-infra.git', branch: gitBranch
      	}
	sh "helm uninstall my-memphis --kubeconfig ~/.kube/config -n memphis"
      	sh "helm install my-memphis memphis-infra/kubernetes/helm/memphis --set cluster.enabled=“true”,analytics="false",sandbox="true" --create-namespace --namespace memphis"
        sh "rm -rf memphis-infra"
      }
    }
 
	  
    notifySuccessful()
	  
  } catch (e) {
      currentBuild.result = "FAILED"
      cleanWs()
      notifyFailed()
      throw e
  }
}

def notifySuccessful() {
  emailext (
      subject: "SUCCESSFUL: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'",
      body: """<p>SUCCESSFUL: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]':</p>
        <p>Check console output at &QUOT;<a href='${env.BUILD_URL}'>${env.JOB_NAME} [${env.BUILD_NUMBER}]</a>&QUOT;</p>""",
      recipientProviders: [[$class: 'DevelopersRecipientProvider']]
    )
}

def notifyFailed() {
  emailext (
      subject: "FAILED: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'",
      body: """<p>FAILED: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]':</p>
        <p>Check console output at &QUOT;<a href='${env.BUILD_URL}'>${env.JOB_NAME} [${env.BUILD_NUMBER}]</a>&QUOT;</p>""",
      recipientProviders: [[$class: 'DevelopersRecipientProvider']]
    )
}
