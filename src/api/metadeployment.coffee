Fs        = require "fs"
Path      = require "path"
Deployment = require("hubot-deploy/src/github/api/deployment").Deployment

module.exports = class MetaDeployment
  @META_FILE = process.env['HUBOT_METADEPLOY_APPS_JSON'] or 'meta.json'

  constructor: (@name, @ref, @task, @env, @force, @hosts) ->
    try
      meta_applications = JSON.parse(Fs.readFileSync(@constructor.META_FILE).toString())
    catch
      throw new Error("Unable to parse your meta.json file in hubot-metadeploy")

    @meta_application = meta_applications[@name]

    if @meta_application?
      @environment = @meta_application[@env]

  isValid: ->
    @meta_application && @environment

  post: (callback) ->
    for app in @environment
      deployment           = new Deployment(app['name'], @ref, @task, app['environment'], @force, @hosts)
      deployment.user      = this.user
      deployment.room      = this.room
      deployment.userName  = this.userName
      deployment.robotName = this.robotName
      deployment.post(callback)
