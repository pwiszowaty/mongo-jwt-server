//load ENV variables
require('dotenv').load();

const express = require('express');
const util = require('util');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const userRoutes = require('./user/routes');
const morgan = require('morgan');
const passport = require('passport');

//SET UP MONGO
mongoose.connect('mongodb://' + process.env.DB_HOST + '/' + process.env.DB_NAME);

//SET UP CONSOLE REPORTER
app.use(morgan('combined'));

//SET UP PASSPORT
app.use(passport.initialize());
require('./config/passport')(passport);

//READ REQUESTS BODY AS JSON
app.use(bodyParser.json());

//ENABLE CORS
app.use(function(req, res, next){
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Authorization, Accept');
  next();
});

//ROUTES CONFIG
app.use('/user', userRoutes);

//START
app.listen(1337, function(req, res){
	console.log('Listening on port 1337');
});

// app.get('/user/profile', passport.authenticate('jwt', { session: false }), function(){
// 	res.send('It worked! User id is: ' + req.user._id + '.');
// });

function gracefulExit() { 
  mongoose.connection.close(function () {
    console.log('Mongoose default connection with DB is disconnected through app termination');
    process.exit(0);
  });
}

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', gracefulExit).on('SIGTERM', gracefulExit);
