const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;


const snippetSchema = new Schema({
  id : {type: String},
  title : {type: String, required: true},
  body : {type: String, required: true},
  notes: {type: String},
  language: {type: String, required: true},
  tags: {type: Array, required: true, default: []},
  author: {type: String, required: true}
});


const Snippet = mongoose.model('Snippet', snippetSchema);

module.exports = Snippet;
