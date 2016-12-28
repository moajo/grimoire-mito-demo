serve 'hs'
port 8080

before_build {
  run 'npm install'
  run 'npm install -g http-server'
}