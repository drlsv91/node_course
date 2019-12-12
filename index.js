require("express-async-errors");
require("winston-mongodb");
const config = require("config");
const Joi = require("joi");
const winston = require("winston");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");
const express = require("express");
const genres = require("./routes/genres");
const movies = require("./routes/movies");
const rentals = require("./routes/rentals");
const customers = require("./routes/customers");
const auth = require("./routes/auth");
const users = require("./routes/users");
const error = require("./middleware/error");

const app = express();
// for sync error handling
winston.handleExceptions(
  new winston.transports.File({
    filename: "uncaughtExceptions.log"
  })
);
process.on("unhandledRejection", ex => {
  throw ex;
});
winston.add(winston.transports.File, { filename: "logfile.log" });
winston.add(winston.transports.MongoDB, { db: "mongodb://localhost/vidly" });
const p = Promise.reject(new Error("something failed miserably"));
p.then(() => console.log("Done"));
if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR: jwtPrivateKey is not defined.");
  process.exit(1);
}
mongoose
  .connect("mongodb://localhost/vidly")
  .then(() => console.log("Connected to MongoDB..."))
  .catch(err => console.error("could not connect to mongoDB..."));

app.use(express.json());
app.use("/api/genres", genres);
app.use("/api/customers", customers);
app.use("/api/movies", movies);
app.use("/api/rentals", rentals);
app.use("/api/users", users);
app.use("/api/auth", auth);

// do this after all the route have been registered
app.use(error);
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
