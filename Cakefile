{exec} = require 'child_process'

responder = (err, stdout, stderr) ->
  throw err if err
  console.log   stdout if stdout
  console.error stderr if stderr

task 'build', 'Build project from src/*.coffee to lib/*.js', ->
  exec 'coffee --compile --output lib/ src/', responder

task 'test', 'Run the test suite', ->
  exec './node_modules/.bin/mocha --compilers coffee:coffee-script --reporter spec --ui bdd --colors', responder

