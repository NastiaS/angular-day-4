var express = require('express');
var router = express.Router();
var tweetBank = require('../tweetBank');
module.exports = router;

router.get('/', function (req, res) {
    var tweets = tweetBank.list();
    res.render('index', {
        title: 'Twitter.js',
        tweets: tweets
    });
});

router.get('/users/:name', function (req, res) {
    var name = req.params.name;
    var tweets = tweetBank.find({ name: name });
    res.render('index', {
        title: 'Twitter.js - Posts by ' + name,
        tweets: tweets,
        showForm: true
    });
});

router.get('/users/:name/tweets/:id', function (req, res) {
    var name = req.params.name;
    var id = parseInt(req.params.id);
    var tweets = tweetBank.find({ id: id, name: name });
    res.render('index', {
        title: 'Twitter.js - Tweet by ' + name,
        tweets: tweets,
        showForm: true
    });
});

router.post('/submit', function(req, res) {
    var name = req.body.name;
    var text = req.body.text;
    tweetBank.add(name, text);
    io.sockets.emit('new_tweet', { /* tweet info */ });
    res.redirect('/');
});