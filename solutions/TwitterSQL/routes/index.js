var express = require('express');
var router = express.Router();
var tweetBank = require('../tweetBank');
module.exports = router;

var models = require('../models'),
    User = models.User,
    Tweet = models.Tweet;

// // testing out our new toy
// User
// .find(1)
// .complete(function (err, user) {
//     console.log('users', user);
//     console.log('JSON stringified', JSON.stringify(user));
//     console.log('data values', user.dataValues);
//     console.log('user name', user.name);
//     console.log('plainified', user.get({plain: true}));
// });

router.get('/', function (req, res) {
    // var tweets = tweetBank.list();

    // find all tweets
    // asynchronous!!!
    Tweet
    .findAll()
    .complete(function (err, tweets) {
        console.log('tweets', tweets.map(function (tweet) {
            return tweet.get({plain: true});
        }));
        res.render('index', {
            title: 'Twitter.js',
            tweets: tweets
        });
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