/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
// Description
//   Trigger multiple GitHub deployments
//
// Commands:
//   hubot metadeploy <app-group>

const MetaDeployment = require("../api/metadeployment");
const Verifiers     = require('@realgeeks/hubot-deploy/src/models/verifiers');

const scriptPrefix = process.env['HUBOT_METADEPLOY_PREFIX'] || 'mdeploy';

const validSlug = "([-_\.0-9a-z]+)";

const DEPLOY_SYNTAX = new RegExp(`\
(${scriptPrefix}(?:\\:[^\\s]+)?)\
(!)?\\s+\
${validSlug}\
(?:\\/([^\\s]+))?\
(?:\\s+(?:to|in|on)\\s+\
${validSlug}\
(?:\\/([^\\s]+))?)?\\s*\
(?:([cbdefghijklnrtuv]{32,64}|\\d{6})?\\s*)?$\
`, 'i');

module.exports = robot => robot.respond(DEPLOY_SYNTAX, function(msg) {
  const name = msg.match[3];
  const sha = msg.match[4] || 'master';
  const env = msg.match[5] || 'production';
  const metadeployment = new MetaDeployment(name, sha, 'task', env);

  if (!metadeployment.isValid()) {
    msg.reply(`Sorry, environment ${env} isn't defined for ${name}`);
    return;
  }

  metadeployment.user   = msg.message.user.name;
  metadeployment.room   = msg.message.user.room;
  metadeployment.userName  = msg.message.user.name;
  metadeployment.robotName = robot.name;

  return metadeployment.post(function(err, status, body, headers, responseMessage) {
    if (responseMessage != null) { return msg.reply(responseMessage); }
  });
});
