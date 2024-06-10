/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Helper = require('hubot-test-helper');
const helper = new Helper('../../src/scripts/metadeploy.js');
const co = require('co');
const {
  expect
} = require('chai');
const mockrequire = require('mock-require');

let calls = [];
let postCalled = false;


class FakeDeployment {
  constructor(...args) {
    calls.push(args);
  }

  post(callback) {
    return postCalled = true;
  }
}


describe('deploying from chat', function () {

  beforeEach(function () {
    calls = [];
    postCalled = false;
    mockrequire('@realgeeks/hubot-deploy/src/github/api/deployment', { Deployment: FakeDeployment });
    return this.room = helper.createRoom();
  });

  afterEach(function () {
    return this.room.destroy();
  });

  context('user asks for deploy', function () {
    beforeEach(function () {
      return co(function* () {
        return yield this.room.user.say('alice', '@hubot mdeploy web');
      }.bind(this));
    });

    return it('should create Deployments', function () {
      expect(calls[0]).to.eql(['rg2-rackspace', 'master', 'task', 'production', undefined, undefined]);
      expect(calls[1]).to.eql(['rg2-aws', 'master', 'task', 'production', undefined, undefined]);
      expect(calls[2]).to.eql(['rg2-emailupdates', 'master', 'task', 'rg2-emailupdates-prod', undefined, undefined]);
      return expect(postCalled).to.equal(true);
    });
  });


  return context('user asks for deploy to a nonexistent environment', function () {
    beforeEach(function () {
      return co(function* () {
        return yield this.room.user.say('alice', '@hubot mdeploy web to flarb');
      }.bind(this));
    });

    return it('should respond with an error', function () {
      return expect(this.room.messages).to.eql([
        ['alice', '@hubot mdeploy web to flarb'],
        ['hubot', '@alice Sorry, environment flarb isn\'t defined for web'],
      ]);
    });
  });
});
