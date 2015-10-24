// app.js serves to start the application server
"use strict";

// Execute below in scope
(function() {

  var DIMENSE     = require("./lib/core")({
        config    : require("./config/instance"),
        dir       : __dirname
      })
  var PORT 		  = DIMENSE.config.port
  // Listen to assigned port
  DIMENSE.app.listen(PORT, function() {
  	console.log("App listening on port:", PORT)
  })
} ())
