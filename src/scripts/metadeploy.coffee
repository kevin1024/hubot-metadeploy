# Description
#   Trigger multiple GitHub deployments
#
# Commands:
#   hubot metadeploy <app-group>

MetaDeployment = require "../api/metadeployment"
Verifiers     = require('hubot-deploy/src/models/verifiers')

TokenForBrain = Verifiers.VaultKey

module.exports = (robot) ->
  robot.respond /mdeploy (.+?)(?: to (.+))?$/i, (msg) ->
    name = msg.match[1]
    env = msg.match[2] || 'production'
    metadeployment = new MetaDeployment(name, 'master', 'task', env)

    unless metadeployment.isValid()
      msg.reply "Sorry, environment #{env} isn't defined for #{name}"
      return

    metadeployment.user   = msg.message.user.name
    metadeployment.room   = msg.message.user.room
    metadeployment.userName  = msg.message.user.name
    metadeployment.robotName = robot.name

    metadeployment.post (err, status, body, headers, responseMessage) ->
      msg.reply responseMessage if responseMessage?
