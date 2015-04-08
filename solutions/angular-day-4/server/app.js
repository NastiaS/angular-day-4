var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
module.exports = app;

var publicPath = path.join(__dirname, '../public');
var indexHtmlPath = path.join(__dirname, '../index.html');

var FlashCardModel = require('./models/flash-card-model');

app.use(express.static(publicPath));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
    res.sendFile(indexHtmlPath);
});


app.get('/cards', function (req, res) {

    var modelParams = req.query.category ? { category: req.query.category } : {};

    FlashCardModel.find(modelParams, function (err, cards) {
        setTimeout(function () {
            res.send(cards);
        }, Math.random() * 1000);
    });

});

app.post('/cards', function (req, res, next) {

    var card = req.body;

    FlashCardModel.create(card).then(function (card) {
        setTimeout(function () {
            res.send(card);
        }, 2000);
    }, function (err) {
        console.error(err);
        res.status(500).send(err);
    });

});