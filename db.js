const mongoose = require("mongoose");

const connectToDb = async () => {
  await mongoose
    .connect(process.env.MONGO_URI)
    .then((data) => {
      console.log(`Mongodb connected with server: ${data.connection.host}`);
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = connectToDb;
