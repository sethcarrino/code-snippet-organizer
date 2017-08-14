const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const snippetSchema = new Schema({

  type : {type: String, required: true},
  body : {type: String, required: true},
  notes : {type: String},
  language : {type: String, required: true},
  tags : {type: String}
});


const Snippet = mongoose.model('snippets', snippetSchema);

module.exports = Snippet;
