"use strict";

module.exports = function(options) {
  
  var app
  var config    = options.config
  var directory = options.dir
  var common    = require(directory + "/lib/common")

  // Validate startup
  function startup() {
    let startup_ok = true
    
    if (config && config.port) {
      // we are good from config perspective
      let express = require("express")
      
      app = express()
      // Assign application serving attributes
      app.set('views', directory + '/views')
      app.set('view engine', 'jade')
      app.use(express.static(directory + '/public'))
      app.use(function(req, res, next) {
        console.log("req@", req.path)
        return next()
      })
    }
    else {
      startup_ok = false
      throw new Error(
        "Missing configuration (See config template: config/template.json)"
      )
    }
  }

  // Execute startup upon requiring this module
  startup()

  return {
    config    : options.config,
    common    : common,
    dir       : directory,
    app       : app,
    controller: require(directory + "/lib/controller")(app)
  }
}