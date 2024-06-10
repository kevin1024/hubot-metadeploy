/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Path = require('path');

module.exports = (robot, scripts) => robot.loadFile(Path.resolve(__dirname, "src", "scripts"), "metadeploy.js");
