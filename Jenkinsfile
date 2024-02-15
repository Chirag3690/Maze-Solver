pipeline{
  agent {label: 'Jenkins-Agent'}
  tools{
    jdk 'Java17'
    maven 'Maven3'
  }
  stages{
    stage("Clean Workspace"){
      steps{
        cleansWs()
      }
    }
    stage("Checkout from SCM"){
      steps{
        git branch: 'main', credentials: 'github',  url: 'https://github.com/Chirag3690/Maze-Solver'
      }
    }
    stage("Build Application"){
      steps{
        sh "mvn clean package"
      }
    }
    stage("Test Application"){
      steps{
        sh "mvn test"
      }
    }
    
}
