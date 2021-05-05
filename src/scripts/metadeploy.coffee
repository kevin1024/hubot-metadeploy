# Description
#   Trigger multiple GitHub deployments
#
# Commands:
#   hubot metadeploy <app-group>

MetaDeployment = require "../api/metadeployment"
Verifiers     = require('@realgeeks/hubot-deploy/src/models/verifiers')

scriptPrefix = process.env['HUBOT_METADEPLOY_PREFIX'] || 'mdeploy'

validSlug = "([-_\.0-9a-z]+)"

DEPLOY_SYNTAX = ///
  (#{scriptPrefix}(?:\:[^\s]+)?)        # / prefix
  (!)?\s+                               # Whether or not it was a forced deployment
  #{validSlug}                          # application name, from apps.json
  (?:\/([^\s]+))?                       # Branch or sha to deploy
  (?:\s+(?:to|in|on)\s+                 # http://i.imgur.com/3KqMoRi.gif
  #{validSlug}                          # Environment to release to
  (?:\/([^\s]+))?)?\s*                  # Host filter to try
  (?:([cbdefghijklnrtuv]{32,64}|\d{6})?\s*)?$ # Optional Yubikey
///i

module.exports = (robot) ->
  robot.respond DEPLOY_SYNTAX, (msg) ->
    name = msg.match[3]
    sha = msg.match[4] || 'master'
    env = msg.match[5] || 'production'
    metadeployment = new MetaDeployment(name, sha, 'task', env)

    unless metadeployment.isValid()
      msg.reply "Sorry, environment #{env} isn't defined for #{name}"
      return

    metadeployment.user   = msg.message.user.name
    metadeployment.room   = msg.message.user.room
    metadeployment.userName  = msg.message.user.name
    metadeployment.robotName = robot.name

    metadeployment.post (err, status, body, headers, responseMessage) ->
      msg.reply responseMessage if responseMessage?
