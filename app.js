const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('express-flash-messages');
const mongoose = require('mongoose');
const bluebird = require('bluebird');
mongoose.Promise = bluebird;

// require schema models
const User = require('./models/user');
const Snippet = require('./models/snippet');

const passport = require('passport');

const loginRoutes = require('./routes/login');
const snippetsRoutes = require('./routes/snippets');
const searchRoutes = require('./routes/search')

// setup url for mongoose
let url = 'mongodb://localhost:27017/code-snippet';

const app = express();


// setup template engine
app.engine('handlebars', exphbs());
app.set('views', './views');
app.set('view engine', 'handlebars');

// setup express session
app.use(session({
  secret: 'V4P3N4710N',
  resave: false,
  saveUninitialized: true
}));

// serve static files
app.use(express.static('public'));

// setup middle ware for parsing data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(expressValidator());

app.use(passport.initialize());

app.use(passport.session());

app.use(flash());


const requireLogin = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect('/login');
  }
};

app.get('/', requireLogin, function(req, res) {
  Snippet.find({author: req.user.username})
    .then((snippets) => {
      res.render('home', {user: req.user, snippets: snippets})
    })
    .catch(err => res.send('No snippets found'));
});

app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', (req, res) => {
  let user = new User(req.body);
  user.provider = 'local';
  user.setPassword(req.body.password);

  user.save()
    .then(() => res.redirect('/'))
    .catch(err => console.log(err));
});

app.use('/', loginRoutes);
app.use('/', snippetsRoutes);
app.use('/', searchRoutes);


mongoose.connect(url, (err, connection) => {
  if (!err) {
    console.log('connected to mongo');
  }

// listen on port
  app.listen(3000, function() {
    console.log('Successfully started application!')
  });
});
