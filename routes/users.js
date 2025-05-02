var express = require("express");
var router = express.Router();

const Joi = require('joi');


const jwt = require("jsonwebtoken");

const User = require("../models/user.model");

const verify = require("../middleware/verify");


const schema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  age: Joi.number().integer().min(18).max(100),
});

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/register", function (req, res) {
  const { error, value } = schema.validate(req.body);
  const { name, username, password, role } = req.body;

  if(error){
    return res.status(400).send({messgae:"bad client request",status:false});
  }
  try {
    const userData = new User({ name, username, password, role });
    userData.save();
    res
      .status(200)
      .send({ message: "user successfully registered", status: true });
  } catch (err) {
    res.send({ message: "something went wrong", status: false });
  }
});

router.post("/login", async function (req, res) {
  const { username, password } = req.body;
  try {
    const userFind = await User.find({ username });
    if (userFind.username) {
      if (password == userFind.password) {
        const token = await jwt.sign({ username });
        console.log("token", token);
        const updatToken = await User.updateOne(
          { username },
          { $set: { token } }
        );
        return res
          .status(200)
          .send({ message: "user successfully loggedin", status: true });
      }
      return res
        .status(200)
        .send({ message: "username or password invalid", status: false });
    }
    return res.status(404).send({ message: "user not found", status: false });
  } catch (err) {
    res.send({ message: "something went wrong", status: false });
  }
});

router.post("/me", verify, async function (req, res) {
  const username = req.userId;
  try {
    const userFind = await User.find({ username });
    if (userFind) {
      return res
        .status(200)
        .send({ message: "user found", user: userFind, status: false });
    }
    return res.status(404).send({ message: "user not found", status: false });
  } catch (err) {
    res.send({ message: "something went wrong", status: false });
  }
});

module.exports = router;

// 3. Authentication APIs:
// • POST /auth/register Public Register a new user
// • POST /auth/login Public Login user
// • GET /auth/me Private Get logged-in user
