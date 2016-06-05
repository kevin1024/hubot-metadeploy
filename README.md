#hubot-metadeploy [![Build Status](https://travis-ci.org/kevin1024/hubot-metadeploy.svg?branch=master)](https://travis-ci.org/kevin1024/hubot-metadeploy)

Integrates with [hubot-deploy](https://github.com/atmos/hubot-deploy) to allow you to deploy multiple apps with one command

## Installation

* Add hubot-metadeploy to your `package.json` file.
* Add hubot-metadeploy to your `external-scripts.json` file.
* Add a meta.json configuration file to the root of your hubot installation

## Configuration

You will need a meta.json.  Here is an example:

```json
{
  "web": {
    "production": [
      {"name": "rg2-rackspace", "environment": "production"},
      {"name": "rg2-aws", "environment": "production"},
      {"name": "rg2-emailupdates", "environment": "rg2-emailupdates-prod"}
    ]
  }
}

```

## usage

```
hubot mdeploy web to production
```

This will actually call:

```
hubot deploy rg2-rackspace to production
hubot deploy rg2-aws to production
hubot deploy rg2-emailupdates to rg2-emailupdates-prod
```

