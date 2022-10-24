const mongoose = require("mongoose");

//Connecting to database
const dbUrl =
  process.env.DB_URL || "mongodb://localhost:27017/bodyfat-calculator";
mongoose.connect(dbUrl);

//making db variable saves you from saying mongoose.connection.on
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connnection error:"));
db.once("open", () => {
  console.log("Database connected");
});

module.exports = dbUrl;
