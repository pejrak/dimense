// app.js serves to start the application server
"use strict";

// Execute below in scope
(function() {

  var DIMENSE     = require("./lib/core")({
        config    : require("./config/instance"),
        dir       : __dirname
      })

  // Listen to assigned port
  DIMENSE.app.listen(DIMENSE.config.port)
} ())
