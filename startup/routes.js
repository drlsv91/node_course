const express = require("express");
const genres = require("../routes/genres");
const movies = require("../routes/movies");
const rentals = require("../routes/rentals");
const customers = require("../routes/customers");
const returns = require("../routes/returns");
const auth = require("../routes/auth");
const users = require("../routes/users");
const error = require("../middleware/error");
module.exports = function(app) {
  app.use(express.json());
  app.use("/api/genres", genres);
  app.use("/api/customers", customers);
  app.use("/api/movies", movies);
  app.use("/api/rentals", rentals);
  app.use("/api/users", users);
  app.use("/api/auth", auth);
  app.use("/api/returns", returns);
  // do this after all the route have been registered
  app.use(error);
};