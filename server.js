const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const cheerio = require('cheerio');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const colors = require('colors')
const logger = require('morgan');
const nodemon = require('nodemon');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');


const app = express();

app.use(logger('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


dotenv.config({ path: './config/config.env' });


connectDB();

app.use(express.static(path.join(__dirname, 'public')));

app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

var routes = require("./controller/controller.js");
app.use("/", routes);


const PORT = process.env.PORT || 4000;



const server = app.listen(PORT, () => {
    console.log(
      `server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
    );
  });


// Handle unhandled rejections

process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red.bold);
    // close server and exit
    server.close(() => process.exit(1));
})