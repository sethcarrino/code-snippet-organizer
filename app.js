const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
mongoose.Promise = require('bluebird');
const bodyParser = require('body-parser');
const generalRouter = require('./routes/general');
const apiRouter = require('./routes/api');
const Snippet = require('./models/snippet.js');
const User = require('./models/user.js');
const exphbs = require('express-handlebars');

// create application with express
const app = express();

// mongoose connection
mongoose.connect('mongodb://localhost:27017/code-snippet');
var db = mongoose.connection;

// parse data with body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// create template engine
app.engine('handlebars', exphbs());
app.set('views', './views');
app.set('view engine', 'handlebars');

// serve static files
app.use(express.static('./public'));


app.use("/app", mainRouter);
app.use("/api", apiRouter);

app.get('/', function(req, res){
  res.redirect('/app/home');
})

app.listen(3000, function(req, res){
  console.log("Successfullty Started Application");
})
