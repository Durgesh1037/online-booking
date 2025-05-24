const mongoose = require("mongoose");
const dbConnect = () => {
  mongoose
    .connect(process.env.DATABASEURL)
    .then(() => {
      console.log("database connected");
    })
    .catch((err) => {
      console.log("error", err);
    });
};

module.exports = dbConnect;
