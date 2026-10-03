const mongoose = require("mongoose");
require("dotenv").config();

const dbUser = process.env.MONGO_USER;
const dbPass = process.env.MONGO_PASS;
const dbHost = process.env.MONGO_HOST;
const dbName = process.env.MONGO_DB_NAME;
const dbApp = process.env.MONGO_DB_APP;

const dbURI = `mongodb+srv://${dbUser}:${dbPass}@${dbHost}/${dbName}?appName=${dbApp}`;

mongoose
  .connect(dbURI)
  .then(() =>
    console.log(`Securely connected to ${dbName} database on ${dbApp}.`),
  )
  .catch((err) => console.error("Database connection failure:", err));

module.exports = mongoose;
