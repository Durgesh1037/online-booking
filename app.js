var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const hbs=require('hbs');

var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');
var bookingRouter = require('./routes/booking');
const dotenv=require("dotenv").config();

// const swaggerUI = require('swagger-ui-express');


// const swaggerJSDoc = require('swagger-jsdoc');

// const swaggerDefinition = {
// openapi: '3.0.0',
// info: {
// title: 'My API',
// version: '1.0.0',
// description: 'My API Description',
// },
// };

// const options = {
// swaggerDefinition,
// apis: ['./routes/users.js'], // Path to the API routes in your Node.js application
// };

// const swaggerSpec = swaggerJSDoc(options);
// const swaggerSpec = require(‘./swagger’);

var app = express();

// app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));



const dbConnect=require("./db/index");

dbConnect();

// view engine setup
app.set('views', path.join(__dirname, './views/user'));
app.set('view engine', 'jade');
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
