const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const hbs=require('hbs');
let helmet = require("helmet");
const usersRouter = require('./routes/users');
const adminRouter = require('./routes/admin');
const bookingRouter = require('./routes/booking');
const dotenv=require("dotenv").config();


const app = express();
app.use(helmet.hidePoweredBy());




const dbConnect=require("./db/index");

dbConnect();

// view engine setup
app.set('views', path.join(__dirname, './views/user'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get("/",(req,res)=>{
  try{
    res.send("Welcome to the home page.");
  }
  catch(err){
    console.log(err);
  }
});


app.use('/auth', usersRouter);
app.use("/admin",adminRouter);
app.use("/bookings",bookingRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development

  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
