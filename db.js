function dbConnect() {
  const mongoose = require("mongoose");
  const url = "";

  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log("Connected to DB !!!");
    })
    .catch((error) => {
      console.log({ ERROR: error, MSG: "Connection failed..." });
    });
}

module.exports = dbConnect;
