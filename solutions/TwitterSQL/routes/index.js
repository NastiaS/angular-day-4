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
    // find all tweets
    // asynchronous!!!
    Tweet
    .findAll({include: [User]}) // eager loading, i.e join
    .complete(function (err, tweets) {
        // console.log('tweets', tweets.map(function (tweet) {
        //     return tweet.get({plain: true});
        // }));
        res.render('index', {
            title: 'Twitter.js',
            tweets: tweets
        });
    });
});

router.get('/users/:name', function (req, res) {
    var name = req.params.name;
    User
    .find({
        where: {name: name}
    })
    .complete(function (err, user) {
        Tweet
        .findAll({
            include: [User],
            where: {
                UserId: user.id
            }
        })
        .complete(function (err, tweets) {
            console.log('tweets', tweets.map(function (tweet) {
                return tweet.get({plain: true});
            }));
            res.render('index', {
                title: 'Twitter.js - Posts by ' + name,
                tweets: tweets,
                showForm: true
            });
        });
    });
});

router.get('/users/:name/tweets/:id', function (req, res) {
    var name = req.params.name;
    var id = parseInt(req.params.id);
    Tweet
    .find({include: [User]}, id)
    .complete(function (err, tweet) {
        console.log('tweet', tweet.get({plain: true}));
        res.render('index', {
            title: 'Twitter.js - Tweet by ' + name,
            tweets: [tweet],
            showForm: true
        });
    });
});

router.post('/submit', function(req, res) {
    var name = req.body.name;
    var text = req.body.text;
    // always create tweet
    // find or create a user for it
    User
    .findOrCreate({
        where: {name: name}
    })
    .complete(function (err, result) {
        var user = result[0];
        console.log('user', user.get({plain: true}));
        Tweet
        .create({
            tweet: text,
            UserId: user.id
        })
        .complete(function () {
            // console.log('tweet', tweet.get({plain: true}));
            // io.sockets.emit('new_tweet', { /* tweet info */ });
            res.redirect('/');
        });
    });
});