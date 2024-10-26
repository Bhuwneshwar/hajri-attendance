const mongoose = require("mongoose");
require("dotenv").config();

const connectDatabase = () => {
  mongoose
    //.connect(process.env.DB_URI, {useNewUrlParser: true,useUnifiedTopology: true// useCreateIndex: true,
    .connect(process.env.DB_URI)
    .then((data) => {
      console.log(`Mongodb connected with server: ${data.connection.host}`);
    })
    .catch((e) => {
      console.log("No Internet connection \n", e);
      //require("../ErrorsStore").errorsStore(e, "at connectDatabase");
    });
};

module.exports = { connectDatabase };
