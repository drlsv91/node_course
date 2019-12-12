const mongoose = require("mongoose");
const express = require("express");
const Fawn = require("fawn");
const { Rental, validate } = require("../models/rental");
const { Customer } = require("../models/customer");
const { Movies } = require("../models/movie");
const auth = require("../middleware/auth");
const router = express.Router();
Fawn.init(mongoose);
router.get("/", async (req, res) => {
  const rentals = await Rental.find().sort("-dateOut");
  res.send(rentals);
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  //get customer
  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(404).send("Invalid customer");
  //get movie
  const movie = await Movies.findById(req.body.movieId);
  if (!movie) return res.status(404).send("Invalid movie");
  if (movie.numberInStock === 0)
    return res.status(400).send("Movie not in Stock");
  let rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate
    }
  });
  try {
    new Fawn.Task()
      .save("rentals", rental)
      .update("movies", { _id: movie._id }, { $inc: { numberInStock: -1 } })
      .run();
    res.send(rental);
  } catch (ex) {
    return res.status(500).send("Something went wrong");
  }
});
module.exports = router;
