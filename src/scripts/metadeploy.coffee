# Description
#   Trigger multiple GitHub deployments
#
# Commands:
#   hubot metadeploy <app-group>

MetaDeployment = require "../api/metadeployment"

module.exports = (robot) ->
  robot.respond /mdeploy (.+?)(?: to (.+))?$/i, (msg) ->
    name = msg.match[1]
    env = msg.match[2] || 'production'
    metadeployment = new MetaDeployment(name, 'master', 'task', env)

    unless metadeployment.isValid()
      msg.reply "Sorry, environment #{env} isn't defined for #{name}"
      return

    metadeployment.post (err, status, body, headers, responseMessage) ->
      msg.reply responseMessage if responseMessage?
