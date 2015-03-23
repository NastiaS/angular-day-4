var chai = require('chai');
var expect = chai.expect;
var spies = require('chai-spies');
var things = require('chai-things');
chai.use(things);
chai.use(spies);

var Page = require('../models').Page;

describe('Page Model', function(){

  var page;
  beforeEach(function(done){
    page = new Page();
    Page.remove({}, done);
  });

  describe('validations', function(){

    it('should err without title', function(done){
      page.validate(function(err){
        // console.log(err);
        expect(err).to.exist;
        expect(err.errors).to.have.property('title');
        if (err.errors.title) {
          expect(err.errors.title.message).to.equal('Path `title` is required.');
        }
        done();
      });
    });

    it('should error with title of zero length', function(done){
      page.title = '';
      page.validate(function(err){
        // console.log(err);
        expect(err).to.exist;
        expect(err.errors).to.have.property('title');
        if (err.errors.title) {
          expect(err.errors.title.message).to.equal('Path `title` is required.');
        }
        done();
      });
    });

    it('should err without body', function(done){
      page.validate(function(err){
        // console.log(err);
        expect(err).to.exist;
        expect(err.errors).to.have.property('body');
        if (err.errors.body) {
          expect(err.errors.body.message).to.equal('Path `body` is required.');
        }
        done();
      });
    });

  });

  describe('Static methods', function(){

    describe('findByTag', function(){

      beforeEach(function(done){
        page.title = 'Title';
        page.body = 'Another thing';
        page.tags = ['foo','bar'];
        page.save(done);
      });

      // beforeEach(function(done){
      //   Page.create({
      //     title:'etc',body:'more',tags:['foo']
      //   }, done);
      // });

      it('get some pages', function(done){
        Page.findByTag('foo', function(err, pages){
          expect(pages).to.have.length(1);
          expect(pages[0].title).to.equal('Title');
          expect(pages[0].tags).to.have.members(['foo','bar']);
          expect(pages[0].tags).to.have.length(2);
          done();
        });
      });

      it('should not get pages without the search tag', function(done){
        Page.findByTag('zero', function(err, pages){
          expect(pages).to.have.length(0);
          done();
        });
      });

    });

  });

  describe('Methods', function(){

    describe('computeUrlName', function(){

      it('converts bad characters to _ from the title', function(){
        page.title = 'Bad title!';
        page.computeUrlName();
        expect(page.url_name).to.equal('Bad_title_');
      });

    });

  });

  describe('getSimilar', function(){

    var kittenPage;
    beforeEach(function(done){
      kittenPage = new Page({
        title : 'A kitten',
        body : 'etc',
        tags : ['meow','four legs']
      });
      kittenPage.save(done);
    });

    var dogPage;
    beforeEach(function(done){
      dogPage = new Page({
        title : 'A dog',
        body : 'more text',
        tags: ['woof', 'four legs']
      });
      dogPage.save(done);
    });

    var snakePage;
    beforeEach(function(done){
      snakePage = new Page({
        title: 'A snake',
        body: 'almost there',
        tags: ['hiss', 'no legs']
      });
      snakePage.save(done);
    });

    it('should not find itself', function(done){
      kittenPage.getSimilar(function(err, similarPages){
        expect(similarPages).to.not.contain.a.thing.property('title', 'A kitten');
        done();
      });
    });

    it('should find similar pages', function(done){
      kittenPage.getSimilar(function(err, similarPages){
        expect(similarPages).to.contain.a.thing.property('title', 'A dog');
        done();
      });
    });

    it('should not find dissimilar things', function(done){
      kittenPage.getSimilar(function(err, similarPages){
        expect(similarPages).to.not.contain.a.thing.property('title', 'A snake');
      });
      done();
    });

  });

  describe('virtuals', function(){

    describe('full_route', function(){

      it('should return the url_name prepended with /wiki/', function(){
        page.url_name = 'maine_coon_cat';
        expect(page.full_route).to.equal('/wiki/maine_coon_cat');
      });

    });

  });

  describe('Hooks', function(){

    describe('Pre-save hooks', function(){

      it('should call computeUrlName', function(done){
        page.title = 'ABC';
        page.body = '123';
        page.computeUrlName = chai.spy(page.computeUrlName);
        page.save(function(err, thePage){
          expect(page.computeUrlName).to.have.been.called();
          done();
        });
      });

    });

  });

});
