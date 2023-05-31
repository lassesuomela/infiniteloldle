const mysql2 = require("mysql2");

require("dotenv").config();

const pool = mysql2.createPool({
  host: "loldle-mysql",
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  multipleStatements: true,
});

pool.query("SELECT * FROM items LIMIT 1", (error, result) => {
  if (error) throw error;
  console.log("Db is connected");
});

console.log(process.env.DB_HOST);
console.log(process.env.DB_USERNAME);
console.log(process.env.DB_PASSWORD);
console.log(process.env.DB_DATABASE);

module.exports = pool;
