const express = require("express");
const { User } = require("../models/user");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Joi = require("joi");
const router = express.Router();
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid password or email");
  const userPassword = await bcrypt.compare(req.body.password, user.password);
  if (!userPassword) return res.status(400).send("Invalid password or email");
  //generate JSON web

  const token = user.generateAuthToken();
  res.send(token);
});

function validate(req) {
  const schema = {
    email: Joi.string()
      .min(5)
      .max(255)
      .required()
      .email(),
    password: Joi.string()
      .min(5)
      .max(255)
      .required()
  };
  return Joi.validate(req, schema);
}
module.exports = router;
