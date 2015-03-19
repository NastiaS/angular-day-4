var mongoose = require('mongoose');
// Notice the `mongodb` protocol; Mongo is basically a kind of server,
// which handles database requests and sends responses. It's async!
mongoose.connect('mongodb://localhost/wikistack2');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongodb connection error:'));

var pageSchema = new mongoose.Schema({
  title:    String,
  url_name: String,
  owner_id: String,
  text:     String,
  date:     { type: Date, default: Date.now },
  status:   Number,
  tags:     [String]
});


// getting a virtual field actually runs this function
pageSchema.virtual('full_route').get(function(){
  return '/page/' + this.url_name;
});

// setting a virtual field actually runs this function
pageSchema.virtual('full_route').set(function(url){
  this.url_name = url.slice(7);
});

// remember, virtuals don't get saved to the DB, they're just convenient things for us to use while the data is represented in our application as a model instance

// Mongoose `methods` are methods (Javascript function properties) placed on **model instances** (individual doc representations). In other words, a Mongoose method is a function that individual documents have. Inside a Mongoose method, `this` is the specific document.

// This method is async, so it needs to take a callback and run the callback with its results.
pageSchema.methods.findSimilar = function(cb) {
  // the Page model (represents collections!) doesn't exist until we build it from the schema… but we are writing the schema before we build the model! How can we access the collection then? One way is to ask for this instance's constructor. When this function is called, the constructor will be the model that built this instance.
  var Page = this.constructor;
  var pages;
  Page.find({
    _id: {$ne : this.id},
    tags: {$elemMatch: {$in: this.tags}}
  }, cb);
  // above, note that we simply call the callback given to us by the user of this function. "Let them decide what to do with the pages".
};

// Mongoose `statics` are methods (JS function properties) placed on the **model** (the object representing a collection of documents). They are generally not going to relate to a specific documents properties. They behave just like methods except their `this` is not an individual doc — it's the model.

// static method way
pageSchema.statics.generateUrlName = function(name) {
  if (typeof name != "undefined" && name !== "") {
    // Removes all non-alphanumeric characters from name
    // And make spaces underscore
    return name.replace(/\s/ig, '_').replace(/\W/ig,'');
  } else {
    // Generates random 5 letter string
    return Math.random().toString(36).substring(2,7);
  }
};

// Hooks are behavior that runs when a certain named event related to the model is "fired". Internally, when mongoose does various operations, it broadcasts event names for those operations. We can "hook into" those events and run some specific behavior. Here we create a pre-save hook — whenever the `save` event occurs for a page, we first run this function. Specifically, we generate the safe URL name for the page automatically! This is better than having to manually remember to generate a safe url name in our router, for instance.

// pre save hook way
pageSchema.pre('save', function(next){
  function generateUrlName(name) {
    if (typeof name != "undefined" && name !== "") {
      // Removes all non-alphanumeric characters from name
      // And make spaces underscore
      return name.replace(/\s/ig, '_').replace(/\W/ig,'');
    } else {
      // Generates random 5 letter string
      return Math.random().toString(36).substring(2,7);
    }
  }
  this.url_name = generateUrlName(this.title);
  // hooks are middleware, so you need to explicitly tell them when they are done (so that they trigger the next middleware in the application).
  next();
});

var userSchema = new mongoose.Schema({
  name:  { first: String, last: String },
  email: String
});

var Page = mongoose.model('Page', pageSchema);
var User = mongoose.model('User', userSchema);

module.exports = {
  Page: Page,
  User: User
};
