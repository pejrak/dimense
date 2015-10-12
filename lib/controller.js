// controller.js
"use strict";

module.exports = function(app) {

  // Assign routes
  app.get("/", home)

  function home(req, res) {
    res.render("home")
  }
}