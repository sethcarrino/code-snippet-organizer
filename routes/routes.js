const express = require('express');
const routes = express.Router();
const User = require('../models/user');
const Snippet = require('../models/snippet');
const flash = require('express-flash-messages');
const session = require('express-session');
const bodyParser = require('body-parser');

// passport
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

routes.use(
  session({
    secret: 'V4P3N4710N',
    resave: false,
    saveUninitialized: true
  })
);

// connect passport to express
routes.use(passport.initialize());
routes.use(passport.session());
routes.use(flash());

routes.use(bodyParser.json());
routes.use(bodyParser.urlencoded({extended: false}));

// configure passport
passport.use(
  new LocalStrategy(function(email, password, done) {
    User.authenticate(email, password)
      .then(user => {
        if (user) {
          done(null, user);
        } else {
          done(null, null, { message: 'There was no user with this email and password.' });
        }
      })
      .catch(err => done(err));
  })
);

// store the user's id in the session
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// get the user from the session based on the id
passport.deserializeUser((id, done) => {
  User.findById(id).then(user => done(null, user));
});

const requireLogin = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect('/login');
  }
};

routes.get('/', requireLogin, function(request, response) {

  User.find()
  .then(users => response.render('home', {users: users, user: request.user}))
  .catch(err => response.send('You got errors!'));
});



routes.get('/login', (req, res) => {

  res.render('login', { failed: req.query.failed });
});

routes.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login?failed=true',
    failureFlash: true
  })
);

routes.get('/newSnippet', (req, res) => {
  if (req.query.id) {
    Snippet.findById(req.query.id)
      .then(snippet => res.render('newSnippet', { snippet: snippet }));
  } else {
    res.render('newSnippet');
  }
});

routes.post('/saveSnippet', (req, res) => {

  if (req.body.id) {
      Snippet.findByIdAndUpdate(req.body.id, req.body, { upsert: true })

      .then(() => console.log(req.body))
      .then(() => res.redirect('/'))
    } else {
      new Snippet(req.body)
        .save()
        // then redirect to the homepage
        .then(() => console.log(req.body))
        .then(() => res.redirect('/'))
        // catch validation errors
        .catch(err => {
          console.log(err);
          res.render('newSnippet', {
            errors: err.errors,
            snippet: req.body
          });
        });
    }

});

routes.get('/deleteSnippet', (req, res) => {
  Snippet.findById(req.query.id)
    .remove()

    .then(() => res.redirect('/'));
});


routes.get('/users/:user', function(request, response) {
  let userName = request.params.user;

  User.find({username: userName})
  .then(users => response.render('user', {users: users}))
  .catch(err => response.send('You got errors!'));
});


routes.post('/search', function(request, response) {
  let search = request.body.search;

  User.find({$or: [{type: search}]})
  .then(snippets => response.render('search', {snippets: snippets}))
  .catch(err => response.send('You got errors!'));
});

routes.get('/signup', (req, res) => {
  res.render('register');
});

routes.post('/register', (req, res) => {
  let user = new User(req.body);
  user.provider = 'local';
  user.setPassword(req.body.password);

  user
    .save()

    .then(() => res.redirect('/'))

    .catch(err => console.log(err));
});

routes.get('/edit', (req, res) => {
  if (req.query.id) {
    User.findById(req.query.id)
    .then(user => res.render('edit', {user: user}))
  } else {
    res.redirect('/');
  }
});

routes.post('/save', (req, res) => {
  console.log(req.body.id);
  if (req.body.id) {
    User.findByIdAndUpdate(req.body.id, req.body, { upsert: true })
    .then(() => res.redirect('/'));
  }

});

routes.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

module.exports = routes;
