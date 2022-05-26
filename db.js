function dbConnect() {
  const mongoose = require("mongoose");
  const url = "";

  mongoose
    .connect(
      `mongodb+srv://User1:WmzCpim0QMwV8Ea8@cluster0.czfye.mongodb.net/?retryWrites=true&w=majority`
    )
    .then(() => {
      console.log("Connected to DB !!!");
    })
    .catch((error) => {
      console.log({ ERROR: error, MSG: "Connection failed..." });
    });
}

module.exports = dbConnect;
