// "use strict";
import express from 'express';
import { APP_PORT, DB_URL }  from './config';
import errorHandler from './middleware/errorHandler';
const PORT = process.env.PORT || APP_PORT;
const app= express();
import routes from './routes';
import mongoose from 'mongoose';
import path from "path";
import cors from "cors";


global.appRoot = path.resolve(__dirname);

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

//The 404 Route (ALWAYS Keep this as the last route)
app.get('*',(req, res)=>{
  res.render('NotFound')
})

app.listen(APP_PORT,() => console.log(`Listening on port ${PORT}. `));