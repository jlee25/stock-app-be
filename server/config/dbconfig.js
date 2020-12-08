const mongoose = require("mongoose");

// Replace this with your MONGOURI.
const MONGOURI = "mongodb://testing:testing1@ds145302.mlab.com:45302/stock";

const InitiateMongoServer = async () => {
  try {
    await mongoose.connect(MONGOURI, {
      useNewUrlParser: true
    });
    console.log("Connected to DB !!");
  } catch (e) {
    console.log(e);
    throw e;
  }
};

module.exports = InitiateMongoServer;