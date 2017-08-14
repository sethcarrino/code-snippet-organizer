const mongoose = require('mongoose');

const snippetSchema = new mongoose.Schema({
  title: { type:String, required:true},
  body: { type:String, required:true},
  notes: { type:String},
  language: { type:String, required:true},
  tags: [
    {
      tagContent : {type:String}
    }
  ]
})

const Snippet = mongoose.model('Snippet', snippetSchema);

module.exports = Snippet;


//Finds all activities
module.exports.getSnippet = function(callback, limit){
  Snippet.find(callback).limit(limit);
}

//finds Activity by the Id
module.exports.getSnippetById = function(id, callback){
  Snippet.findById(id, callback);
}

//Creates a new activity
module.exports.createSnippet = function(activity, callback){
  Snippet.create(activity, callback);
}

//updates activity.
module.exports.updateSnippet = function(id, snippet, options, callback){
  var query = {_id: id};
  var update = {
    title: snippet.title,
    body: snippet.body,
    language: snippet.language
  }
  Snippet.findOneAndUpdate(query, update, options, callback);
}

module.exports.deleteSnippet = function(id, callback){
  var query = {_id: id}
  Snippet.remove(query, callback);
}
