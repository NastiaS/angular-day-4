var express = require('express');
var router = express.Router();
var tweet = require('../models/index').Tweet;
var user = require('../models/index').User;


module.exports = function(io){
        //SELECT tweet FROM tweets;
    router.get('/', function (req, res) {


        user.findAll({include: [tweet]}).then(function(TweetTable){
            res.render('index', {
                    title: 'Twitter.js',
                    tweets: TweetTable
            });
        });



    });

    router.get('/users/:name', function (req, res) {
        var name = req.params.name.substring(1);

        user.findAll({include: [tweet], where: ["name = ?", name]}).then(function(UserTable){
            console.log(UserTable);
            res.render('index',{
                title: 'Welcome to Twitter.js, posts by ' + name + "!",
                tweets: UserTable,
                showForm: true
            });
        });

    });

    router.get('/users/:name/tweets/:id', function (req, res) {
        var name = req.params.name.substring(1);
        var id = parseInt(req.params.id.substring(1));

        user.findAll({include: [tweet], where: ["name = ? AND UserId = ?", name, id]}).then(function(TweetIdTable){
              res.render('index',{
                title: 'Welcome to Twitter.js, posts by ' + name + "!",
                tweets: TweetIdTable,
                showForm: false
            });
        });

        // var tweets = tweetBank.find({ id: id, name: name });
        // res.render('index', {
        //     title: 'Twitter.js - Tweet by ' + name,
        //     tweets: tweets,
        //     showForm: true
        // });
    });

    router.post('/submit', function(req, res) {
        var name = req.body.name;
        var text = req.body.text;
        user.create({name: name}).then(function(newUser){
            tweet.create({tweet: text, UserId: newUser.id}).then(function(newTweet){
                var tweetArray = [];
                tweetArray.push(newTweet.get('tweet'));
                console.log(tweetArray);
                io.sockets.emit('new_tweet', { name: newUser.get('name'), text: tweetArray});
                res.redirect('/');
            });
        });
        // tweetBank.add(name, text);
        
    });
        return router;
};


