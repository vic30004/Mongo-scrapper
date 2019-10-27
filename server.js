const express = require('express');
const cheerio = require('cheerio');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const logger = require('morgan');
const nodemon = require('nodemon');
const bodyParser = require('body-parser');


const app = express();


app.use(logger("dev"));
app.use(
    bodyParser.urlencoded({
        extended:false
    })
);

app.engine("handlebards", exphbs({defaultLayout:"main"}));
app.set("view engine","handlebars");

const PORT = process.env.PORT || 5000;

app.get("/", (req,res,next)=>{
    res.send("Welcome")
})

app.listen(PORT, function(){
    console.log(`server running on Port ${PORT}`)
})