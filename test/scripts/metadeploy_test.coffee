Helper = require('hubot-test-helper')
helper = new Helper('../../src/scripts/metadeploy.coffee')
co     = require('co')
expect = require('chai').expect
mockrequire = require('mock-require')

calls = []
postCalled = false


class FakeDeployment
  constructor: (args...) ->
    calls.push(args)

  post: (callback) ->
    postCalled = true


describe 'deploying from chat', ->

  beforeEach ->
    calls = []
    postCalled = false
    mockrequire('hubot-deploy/src/github/api/deployment', {Deployment: FakeDeployment})
    @room = helper.createRoom()

  afterEach ->
    @room.destroy()

  context 'user asks for deploy', ->
    beforeEach ->
      co =>
        yield @room.user.say 'alice', '@hubot mdeploy web'

    it 'should create Deployments', ->
      expect(calls[0]).to.eql(['rg2-rackspace', 'master', 'task', 'production', undefined, undefined])
      expect(calls[1]).to.eql(['rg2-aws', 'master', 'task', 'production', undefined, undefined])
      expect(calls[2]).to.eql(['rg2-emailupdates', 'master', 'task', 'rg2-emailupdates-prod', undefined, undefined])
      expect(postCalled).to.equal(true)


  context 'user asks for deploy to a nonexistent environment', ->
    beforeEach ->
      co =>
        yield @room.user.say 'alice', '@hubot mdeploy web to flarb'

    it 'should respond with an error', ->
      expect(@room.messages).to.eql [
        ['alice', '@hubot mdeploy web to flarb'],
        ['hubot', '@alice Sorry, environment flarb isn\'t defined for web'],
      ]
