const Joi = require("joi");

const schemas = {
  userPOST: Joi.object().keys({
    name: Joi.string().required(),
    username: Joi.string().email().required(),
    password: Joi.string().min(6).max(15).required(),
    confirmPassword: Joi.any()
      .equal(Joi.ref("password"))
      .required()
      .label("Confirm password")
      .messages({ "any.only": "{{#label}} does not match" }),
  }),
  userLOGIN: Joi.object().keys({
    username: Joi.string().email().required(),
    password: Joi.string().min(6).max(15).required(),
  }),
  bookingPost: Joi.object().keys({
    tripId: Joi.string().required(),
    seatNumber: Joi.number().required(),
    bookingDateTime: Joi.string().required(),
    to: Joi.string().required(),
    from: Joi.string().required(),
    tripName: Joi.string().required(),
    status:Joi.string().required(),
  }),
  tripPOST:Joi.object().keys({
    tripName: Joi.string().required(),
    seats: Joi.number().required(),
    price:Joi.number().required(),
    to: Joi.string().required(),
    from: Joi.string().required(),
    status:Joi.string().required(),
  }),
};

module.exports = schemas;
