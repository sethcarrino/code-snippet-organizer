const express = require('express');
const routes = express.Router();
const User = require('../models/user');
const Snippet = require('../models/snippet')
const mongoose = require('mongoose');

const requireLogin = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect('/login');
  }
};

routes.use(requireLogin);


routes.get('/snippets/createSnippet', (req, res) => {

    if (req.query.id) {
      Snippet.findById(req.query.id)
        .then(snippet => res.render('createSnippet', { snippet: snippet }));
    } else {
      res.render('createSnippet');
    }
});

routes.post('/snippets', (req, res) => {
  if (!req.body._id) {
    req.body._id = new mongoose.mongo.ObjectID();
  }

req.body.author = req.user.username;




  Snippet.findByIdAndUpdate(req.body._id, req.body, {upsert: true})
  .then(() => res.redirect('/'))
  .catch(err => {
    console.log(err);
    res.render('snippets', {
      errors: err.errors,
      item: req.body
    });
  });
});

routes.get('/deleteSnippet', (req, res) => {
  Snippet.findById(req.query.id).remove()

    .then(() => res.redirect('/'));
});

module.exports = routes;
