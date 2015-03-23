var supertest = require('supertest');
var app = require('../app');
var agent = supertest.agent(app);

describe('http requests', function() {

  describe('GET /', function() {

    it('should get 200 on index', function(done) {
      agent.get('/').expect(200, done);
    });

  });

  describe('GET /wiki/:title', function() {

    xit('should get 404 on page that doesnt exist', function() {});
    xit('should get 200 on page that does exist', function() {});

  });

  describe('GET /wiki/tags/:tag', function() {

    xit('should get 200', function() {});

  });

  describe('GET /wiki/:title/similar', function() {

    xit('should get 404 for page that doesn\'t exist', function() {});
    xit('should get 200 for similar page', function() {});

  });

  describe('GET /wiki/:title/edit', function() {

    xit('should get 404 for page that doesn\'t exist', function() {});
    xit('should get 200 for similar page', function() {});

  });

  describe('GET /add', function() {

    xit('should get 200', function() {});

  });

  describe('POST /wiki/:title/edit', function() {

    xit('should get 404 for page that doesn\'t exist', function() {});
    xit('should update db', function() {});

  });

  describe('POST /add/submit', function() {

    xit('should create in db', function() {});

  });

});
