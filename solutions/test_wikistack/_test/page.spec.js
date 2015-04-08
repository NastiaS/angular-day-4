var chai = require('chai');
var expect = chai.expect;
var spies = require('chai-spies');
var things = require('chai-things');
chai.use(spies);
chai.use(things);

var Page = require('../models').Page;

describe('Page Model', function() {

  var page;
  beforeEach(function(done) {
    page = new Page();
    Page.remove({}, done);
  });

  describe('Validations', function() {
    it('should err without title', function(done) {
      page.validate(function(err) {
        expect(err.errors).to.have.property('title');
        if (err.errors.title) {
          expect(err.errors.title.message).to.equal('Path `title` is required.');
        }
        done();
      });
    });
    it('should err with title of zero length', function() {
      page.title = '';
      page.validate(function(err) {
        expect(err.errors).to.have.property('title');
        if (err.errors.title) {
          expect(err.errors.title.message).to.equal('Path `title` is required.');
        }
        done();
      });
    });
    it('should err without body', function() {
      page.validate(function(err) {
        expect(err.errors).to.have.property('body');
        if (err.errors.title) {
          expect(err.errors.title.message).to.equal('Path `body` is required.');
        }
        done();
      });
    });
  });

  describe('Statics', function() {
      describe('findByTag', function() {
        var page = new Page({
          title: 'foo',
          body: 'bar',
          tags: ['foo', 'bar']
        });
        beforeEach(function(done) {
          page.save(done);
          // Page.create({
          //     title: 'foo',
          //     body: 'bar',
          //     tags: ['foo', 'bar']
          // }, done );
        });
        it('should get pages with the search tag', function(done) {
          Page.findByTag('foo', function(err, pages){
            expect(pages).to.have.length(1);
            expect(pages[0].title).to.equal('foo');
            expect(pages[0].body).to.equal('bar');
            expect(pages[0].tags).to.have.members(['foo', 'bar']);
            expect(pages[0].tags.length).to.equal(2);
            done();
          });
        });
        it('should not get pages without the search tag', function() {
          Page.findByTag('falafel', function(err, pages) {
            expect(pages).to.have.length(0);
            done();
          });
        });
      });
  });

  describe('Methods', function() {
      describe('computeUrlName', function() {
          it('should convert non-word-like chars to underscores', function() {
              page.title = 'two words';
              page.computeUrlName();
              expect(page.url_name).to.equal('two_words');
          });
      });
      describe('getSimilar', function() {
        var russiaPage, panamaPage, watermelonPage;
        beforeEach(function (done) {
          Page.create({
            title: 'Russia',
            body: 'A glorious country. I\'ve heard it\'s cold in winter.',
            tags: ['winter', 'country']
          }, function (err, page) {
            russiaPage = page;
            done();
          });
        });
        beforeEach(function (done) {
          Page.create({
            title: 'Panama',
            body: 'Another glorious country. I\'ve heard it\'s warm in summer.',
            tags: ['country', 'summer']
          }, function (err, page) {
            panamaPage = page;
            done();
          });
        });
        beforeEach(function (done) {
          Page.create({
            title: 'Watermelon',
            body: 'A fruit often eaten in the summer. Not to be confused with Russia.',
            tags: ['summer', 'fruit']
          }, function (err, page) {
            watermelonPage = page;
            done();
          });
        });

        it('should never get itself', function(done) {
          russiaPage.getSimilar(function (err, pages) {
            expect(pages).to.not.contain.a.thing.with.property('title', russiaPage.title);
            done();
          });
        });
        it('should get other pages with any common tags', function(done) {
          russiaPage.getSimilar(function (err, pages) {
            expect(pages).to.contain.a.thing.with.property('title', panamaPage.title);
            done();
          });
        });
        it('should not get other pages without any common tags', function(done) {
          russiaPage.getSimilar(function (err, pages) {
            expect(pages).to.not.contain.a.thing.with.property('title', watermelonPage.title);
            done();
          });
        });
      });
  });

  describe('Virtuals', function() {
      describe('full_route', function() {
          it('should return the url_name prepended by "/wiki/"', function() {
            page.url_name = 'Suite_Judy_Blue_Eyes';
            expect(page.full_route).to.equal('/wiki/Suite_Judy_Blue_Eyes');
          });
      });
  });

  describe('Hooks', function() {
    it('should call computeUrlName before save', function(done) {
      page.title = 'An Interesting Article';
      page.body = 'A suprisingly dull article, actually, sorry.';
      page.computeUrlName = chai.spy(page.computeUrlName);
      page.save(function (err, page) {
        expect(page.computeUrlName).to.have.been.called();
        done();
      });
    });
  });

});
