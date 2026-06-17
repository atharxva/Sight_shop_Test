pipeline {
  agent any
  options {
    timestamps()
  }
  environment {
    BACKEND_URL = "http://localhost:8000"
    JAVA_HOME = "/opt/homebrew/opt/openjdk@21"
    PATH = "/opt/homebrew/bin:/opt/homebrew/opt/openjdk@21/bin:${env.PATH}"
  }
  stages {
    stage('Start backend') {
        steps {
            dir("backend") {
            sh 'npm install --legacy-peer-deps'
            sh 'nohup npm run dev > ../backend-jenkins.log 2>&1 &'
            }
        sh '''
          for i in $(seq 1 30); do
            if curl -fsS "$BACKEND_URL/api/getkey" >/dev/null; then
              exit 0
            fi
            sleep 2
          done
          echo "Backend did not become ready in time"
          exit 1
        '''
      }
    }
    stage('Cypress') {
      steps {
        dir("test") {
          sh 'npx cypress run --config-file cypress.config.js --browser chrome --spec "cypress/e2e/api-tests.cy.js"'
        }
      }
    }
    stage('Selenium') {
      steps {
        dir("test/selenium") {
          sh 'npm install --no-save selenium-webdriver'
          sh 'node --experimental-default-type=module api-tests.spec.js'
        }
      }
    }
    stage('JMeter') {
      steps {
        dir("test/jmeter") {
          sh 'jmeter -n -t api-tests.jmx -l jmeter-results.jtl'
        }
      }
    }
  }
  post {
    always {
      sh 'pkill -f "nodemon index.js" || true'
      archiveArtifacts artifacts: "test/jmeter/jmeter-results.jtl", allowEmptyArchive: true
    }
  }
}