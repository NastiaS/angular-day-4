var express = require('express');
var router = express.Router();
var Page = require('../models/').Page;

/* GET users listing. */
// remember — since we mount this middleware router onto '/add/' in our
// app.js, the '/' here refers to '/add/' — not the root route.
router.get('/', function(req, res, next) {
  res.render('add', {});
});

// likewise, this corresponds to 'add/submit'.
router.post('/submit', function(req, res) {

  var page = new Page({
    title: req.body.title,
    text: req.body.text
  });

  page.save(function(err, theSavedPage){
    // console.log(theSavedPage);
    res.redirect('/');
  });

  // An alternative to creating a new page and then saving it is to
  // do both in a single step with Page.create({title:'abc'}, cb)
  // where `cb` is a callback function.
});

module.exports = router;
