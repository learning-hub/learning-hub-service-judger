/* eslint-disable @typescript-eslint/no-var-requires */
const mysql = require('mysql');
require('dotenv').config();

const connect = mysql.createConnection({
  host: process.env.TYPEORM_HOST,
  user: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  port: process.env.TYPEORM_PORT,
});

connect.query(
  'CREATE DATABASE `' +
    process.env.TYPEORM_DATABASE +
    "` CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_general_ci';",
  () => {
    connect.end();
    console.log('create ' + process.env.TYPEORM_DATABASE + ' ok');
  },
);
