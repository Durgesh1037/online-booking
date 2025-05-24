const jwt = require("jsonwebtoken");

const verifyToken = async (token) => {
  try {
    return new Promise((resolve, reject) => {
      jwt.verify(token, process.env.JWTAUTH, async function (err, decode) {
        console.log("decode", decode);
        return resolve(decode);
      });
    });
  } catch (error) {
    return reject("token is invalid");
    // throw new Error(error)
  }
};
const verify = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    console.log("token", token);
    if (token) {
      console.log("in if");
      const payload = await verifyToken(token);
      if (payload) {
        console.log("payload", payload);
        req.userId = payload.user.username;
        console.log("userId", req.userId);
        return next();
      }
      return res
        .status(401)
        .send({ message: "token is invalid", status: false });
    }
    // return
    console.log("after if");
    return res.status(401).send({ message: "token not found", status: true });
  } catch (error) {
    console.log("error", error);
  }
};

module.exports = verify;
