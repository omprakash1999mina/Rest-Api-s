// "use strict";
import express from 'express';
import { APP_PORT, DB_URL }  from './config';
import errorHandler from './middleware/errorHandler';
const app= express();
import routes from './routes';
import mongoose from 'mongoose';
import path from "path";
import cors from "cors";

const handler = require('serve-handler');
var fs = require('fs');
var https = require('https');
var http = require('http');
var url = require('url');

global.appRoot = path.resolve(__dirname);

app.use(function(req, res, next){
  res.header('Access-Control-Allow-Origin',"*"); // or specify your domain name
  res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");
  next();
});
// app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(cors({
  origin: '*',
  methods: ["GET", "POST","DELETE","PUT"]
}));

//Database connection
try{

  mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('DB connected...');
});
}catch(err){
  console.log('DB connection faild');
}

app.use(express.json());
// const bodyParser = require("body-parser");
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: false}));


// app.post()
app.use('/api', routes);

app.use('/uploads', express.static('uploads'));

app.use(errorHandler);

app.set('build',path.join(__dirname, '/build'));
app.set('view engine', 'ejs');

app.get('/',(req,res)=>{
  res.render('index')
})

app.listen(APP_PORT,() => console.log(`Listening on port ${APP_PORT}. `));