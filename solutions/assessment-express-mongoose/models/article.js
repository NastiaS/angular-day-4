var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/assessjs');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));


var Article;
var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
  title: {type: String, required: true},
  body: {type: String, required: true},
  // the custom getter aspect of a schema field was (presumably) wholly new to you — this was a test of reading and understanding new documentation.
  tags: {type: [String], get: function(arr){
    return arr.join(',');
  }}
});

// read up on methods/statics

ArticleSchema.methods.asJSON = function () {
  // why not `return this.toJSON();` (which was a good try)?
  // MDN for JSON.stringify: If an object being stringified has a property named toJSON whose value is a function, then the toJSON() method customizes JSON stringification behavior: instead of the object being serialized, the value returned by the toJSON() method when called will be serialized.
  // console.log('what am I in pre-JSON?', this.toJSON());
  // console.log('what am I in actual JSON?', JSON.stringify(this));
  // side note: .toJSON omits new (unsaved) properties!
  return JSON.stringify(this);
  // reminder: inside a Mongoose `method`, `this` is an instance (a representation of a single document) of a model
};

ArticleSchema.statics.findByTitle = function (title, callback) {
  // remember: `.find` returns an ARRAY, even if it is only an array of one element. We want to use `.findOne`, which returns the actual instance.
  // async methods like `.find` don't (usually) `return` anything. So how can we communicate the results of the `.findOne` back to the part of the code that called it? With a callback! Our function takes a callback, and when we complete our async, we call the callback. So the user of the function can decide what to do with the results by passing in their own callback function.
  this.findOne({title: title}, callback);
};

Article = mongoose.model('Article', ArticleSchema);


module.exports = Article;
