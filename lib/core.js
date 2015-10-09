"use strict";

module.exports = function(options) {
  
  var app
  var config    = options.config
  var directory = options.dir

  // Validate startup
  function startup() {

    let startup_ok = true
    
    if (config && config.port) {
      // we are good from config perspective
      app = require("express")()
      // Assign application serving attributes
      app.set('views', directory + '/views')
      app.set('view engine', 'jade')
    }
    else {
      startup_ok = false
      throw new Error("Missing configuration")
    }
  }

  startup()

  return {
    config    : options.config,
    dir       : directory,
    app       : app,
    controller: require(directory + "/lib/controller")(app)
  }
}