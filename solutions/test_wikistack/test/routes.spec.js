var Page = require('../models').Page;

var supertest = require('supertest');
var app = require('../app');
var agent = supertest.agent(app);
var expect = require('chai').expect;

describe('http requests', function() {

  // start with a bare database so we know exactly what we're testing
  beforeEach(function(done) {
    Page.remove({}, done);
  });

  // we're going to have one doc in the db for every test
  beforeEach(function(done) {
    Page.create({
      title: 'Anolis carolinensis',
      body: 'Small dewlapping lizard native to the southeastern USA.',
      tags: ['lizard', 'USA']
    }, done);
  });

  // make sure it gets something from the root
  describe('GET /', function() {
    it('should get 200 on index', function(done) {
      agent
        .get('/')
        .expect(200, done);
    });
  });

  // getting a specific wiki page
  describe('GET /wiki/:title', function() {
    it("should get 404 on page that doesn't exist", function(done) {
      agent
        .get('/wiki/something_that_hasnt_been_made')
        .expect(404, done);
    });
    it('should get 200 on page that does exist', function(done) {
      agent
        .get('/wiki/Anolis_carolinensis')
        .expect(200, done);
    });
  });

  // getting pages with a certain tag — a result, maybe of an empty page
  describe('GET /wiki/tags/:tag', function() {
    it('should get 200', function(done) {
      agent
        .get('/wiki/tags/anyTagRegardlessOfIfItsGivenToAnyPageYet')
        .expect(200, done);
    });
  });

  // getting similar pages
  describe('GET /wiki/:title/similar', function(done) {
    it("should get 404 for page that doesn't exist", function(done) {
      agent
        .get('/wiki/doesnt_exist')
        .expect(404, done);
    });
    it('should get 200 for similar page', function(done) {
      agent
        .get('/wiki/Anolis_carolinensis/similar')
        .expect(200, done);
    });
  });

  // the Edit Page page
  describe('GET /wiki/:title/edit', function() {
    it("should get 404 for page that doesn't exist", function(done) {
      agent
        .get('/wiki/non_existent/edit')
        .expect(404, done);
    });
    it('should get 200 for a page that can be edited', function(done) {
      agent
        .get('/wiki/Anolis_carolinensis/edit')
        .expect(200, done);
    });
  });

  // the Add a Page page
  describe('GET /add', function() {
    it('should get 200', function(done) {
      agent
        .get('/add')
        .expect(200, done);
    });
  });

  // editing a page
  describe('POST /wiki/:title/edit', function() {
    it("should get 404 for page that doesn't exist", function(done) {
      agent
        .post('/wiki/totally_not_there/edit')
        .send({
          title: 'A valid title',
          body: 'A valid body',
          tags: ['aTag']
        })
        .expect(404, done);
    });
    it('should update db', function(done) {
      agent
        .post('/wiki/Anolis_carolinensis/edit')
        // HTTP posts have a `body` on the request; this whole object is the body. The body-parser module turns this into req.body.title and req.body.body.
        .send({
          body: 'An updated article about the green anole.',
          tags: 'green,carolina,anole'
        })
        .end(function(err, response) {
          Page.findOne({
            title: 'Anolis carolinensis'
          }, function(err, page) {
            expect(page.body).to.equal('An updated article about the green anole.');
            expect(page.tags).to.have.lengthOf(3);
            done();
          });
        });
    });
  });

  // adding an article
  describe('POST /add/submit', function() {
    it('should create in db', function(done) {
      agent
        .post('/add/submit')
        .send({
          title: 'The',
          body: 'A new article, or maybe a very old one.',
          tags: 'grammar,humor'
        })
        .end(function(err, response) {
          Page.find({
            title: 'The'
          }, function(err, pages) {
            expect(pages).to.have.lengthOf(1);
            done();
          });
        });
    });
  });

});
