function dbConnect() {
  const mongoose = require("mongoose");
  const url =
    "mongodb+srv://User1:tamlong123456@cluster0.czfye.mongodb.net/?retryWrites=true&w=majority";

  mongoose
    .connect(url)
    .then(() => {
      console.log("Connected to DB !!!");
    })
    .catch((error) => {
      console.log({ ERROR: error, MSG: "Connection failed..." });
    });
}

module.exports = dbConnect;
