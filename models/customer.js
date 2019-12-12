const mongoose = require("mongoose");
const Joi = require("joi");
const customerSchema = new mongoose.Schema({
  name: { type: String, minlength: 3, maxlength: 50, required: true },
  isGold: { type: Boolean, required: true, default: false },
  phone: { type: String, minlength: 3, maxlength: 50, required: true }
});
const Customer = mongoose.model("Customer", customerSchema);
function validateCustomer(customer) {
  const schema = {
    name: Joi.string()
      .min(5)
      .max(50)
      .required(),
    phone: Joi.string()
      .min(5)
      .max(50)
      .required(),
    isGold: Joi.boolean()
  };
  return Joi.validate(customer, schema);
}

exports.Customer = Customer;
exports.validate = validateCustomer;
