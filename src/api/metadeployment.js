/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
let MetaDeployment;
const Fs                 = require("fs");
const Path               = require("path");
const {
  Deployment
} = require("@realgeeks/hubot-deploy/src/github/api/deployment");
const {
  DeployPattern
} = require("@realgeeks/hubot-deploy/src/models/patterns");

module.exports = (MetaDeployment = (function() {
  MetaDeployment = class MetaDeployment {
    static initClass() {
      this.META_FILE = process.env['HUBOT_METADEPLOY_APPS_JSON'] || 'meta.json';
    }

    constructor(name, ref, task, env, force, hosts) {
      let meta_applications;
      this.name = name;
      this.ref = ref;
      this.task = task;
      this.env = env;
      this.force = force;
      this.hosts = hosts;
      try {
        meta_applications = JSON.parse(Fs.readFileSync(this.constructor.META_FILE).toString());
      } catch (error) {
        throw new Error("Unable to parse your meta.json file in hubot-metadeploy");
      }

      this.meta_application = meta_applications[this.name];

      if (this.meta_application != null) {
        this.environment = this.meta_application[this.env];
      }
    }

    isValid() {
      return this.meta_application && this.environment;
    }

    post(callback) {
      return (() => {
        const result = [];
        for (var app of Array.from(this.environment)) {
          var deployment           = new Deployment(app['name'], this.ref, this.task, app['environment'], this.force, this.hosts);
          deployment.user      = this.user;
          deployment.room      = this.room;
          deployment.userName  = this.userName;
          deployment.robotName = this.robotName;
          result.push(deployment.post(callback));
        }
        return result;
      })();
    }
  };
  MetaDeployment.initClass();
  return MetaDeployment;
})());
