var express = require('express');
var router = express.Router();
var Article = require('../models/article');

/**
 *
 *___ _____ _   ___ _____   _  _ ___ ___ ___
 / __|_   _/_\ | _ \_   _| | || | __| _ \ __|
 \__ \ | |/ _ \|   / | |   | __ | _||   / _|
 |___/ |_/_/ \_\_|_\ |_|   |_||_|___|_|_\___|
            CREATE ADDITIONAL ROUTES
 */


/**
 * List
 */
router.get('/articles', function(req, res) {
  Article.find({}, function(err, articles){
    if (err) return next(err);
    res.json(articles);
  });
});


/**
 * Show
 */

router.get('/articles/:id', function(req, res, next) {
  // Article.findOne({_id: req.params.id}, function(err, article){
  //   res.json(article);
  // });
  Article.findById(req.params.id, function(err, article){
    // why `return` error sending? Purely to stop the function from continuing.
    // if (err) return res.status(500).end();
    if (err) {
      // if we wanted to customize the error, we might set its status before passing it along to `next` (this would fail our current spec as written, but in the real world it's a more specific error):
      // err.status = 404;
      return next(err);
    }
    res.json(article);
  });
});


/**
 * Create an article
 */
router.post('/articles', function (req, res, next) {
  Article.create(req.body, function(err, article){
    if (err) return next(err);
    res.json({
      message: 'Created Successfully',
      article: article
    });
  });
});



/**
 * Update article
 */
router.put('/articles/:id', function (req, res) {
  // you could do this in two steps: find the article, then change & save it.
  // Article.findById(req.params.id, function(err, foundArticle){
  //   if (err) return next(err);
  //   foundArticle.title = req.body.title;
  //   foundArticle.save(function(err, savedArticle){
  //     if (err) return next(err);
  //     res.json({
  //       message: 'Updated Successfully',
  //       article: savedArticle
  //     });
  //   });
  // });
  // Or you can do so in a single db call, like this. HOWEVER, this method skips pre-save hooks, so be careful about if and when you use it!
  Article.findByIdAndUpdate(req.params.id, req.body, function(err, article){
    if (err) return next(err);
    res.json({
      message: 'Updated Successfully',
      article: article
    });
  });
});


 /**
 * END ROUTES
 */

module.exports = router;
