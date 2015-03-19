var express = require('express');
var router = express.Router();
var Page = require('../models').Page;

// the : means that url_name is a variable
// express puts the actual value onto req.params.url_name
router.get('/:url_name', function(req, res){
  Page.findOne({url_name: req.params.url_name}, function(err, page){
    // this is jus to demonstrate that our findSimilar model instance method works — check the backend (terminal) console
    page.findSimilar(function(err, pages){
      if (err) throw err;
      console.log('similar pages', pages);
    });
    // when figuring out what to pass in the locals object — that is,
    // which key names to use — look at your template! What does it have
    // in its template tags? For example, here the "show" template
    // is expecting a `page` variable.
    res.render('show', { page: page });
  });
});

router.get('/tags/:tagname', function(req, res) {
  // these Mongo matching funcs ($etc.) are simpler than they seem.
  // http://docs.mongodb.org/manual/reference/operator/query/elemMatch/
  Page.find({
    tags: {$elemMatch: {$in: [req.params.tagname]}}
  }, function(err, pages) {
    if (err) throw err;
    res.render('index', {title: 'Pages matching ' + req.params.tagname, pages: pages});
  });
});

module.exports = router;
