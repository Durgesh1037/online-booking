var express = require("express");
var router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const verify = require("../middleware/verify");
const schemaValidate = require("../middleware/schema-validate");
const schemas = require("../helper/schemas");
const bcrypt = require("bcrypt");
/* GET users listing. */
router.get("/", function (req, res, next) {
  // res.send("respond with a resource");
  res.render("register.hbs");
});

router.get("/login", function (req, res, next) {
  res.render("login.hbs");
});

router.post(
  "/register",
  [schemaValidate(schemas.userPOST)],
  async function (req, res) {
    const { name, username, password, role } = req.body;
    try {
      const userFind = await User.find({ username });
      if (userFind.length > 0) {
        return res.render("register.hbs", {
          msg: "User already registered , login first",
        });
      }
      const hash = bcrypt.hashSync(password, 10);
      const userData = new User({ name, username, password: hash, role });
      userData.save();
      return res.render("register.hbs", { msg: "User succssfully registered" });
    } catch (err) {
      res.send({ message: "Something went wrong", status: false });
    }
  }
);

router.post(
  "/login",
  [schemaValidate(schemas.userLOGIN)],
  async function (req, res) {
    const { username, password } = req.body;
    try {
      const userFind = await User.find({ username });
      if (userFind.length > 0) {
        const result = bcrypt.compareSync(password, userFind[0].password);
        if (result) {
          const token = jwt.sign({ user: userFind[0] }, process.env.JWTAUTH, {
            expiresIn: "1d",
          });
          await User.updateOne({ username }, { $set: { token } });
          return res.render("login.hbs", {
            msg: "User successfully loggedin",
          });
        }
        return res.render("login.hbs", {
          msg: "Username or password is invalid",
        });
      }
      return res.render("login.hbs", {
        msg: "User not found , register first",
      });
    } catch (err) {
      console.log("err", err);
      res.send({ message: "something went wrong", status: false });
    }
  }
);

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
