var chai = require('chai');
var expect = chai.expect;
var spies = require('chai-spies');
chai.use(spies);

describe('Simple addition', function(){

  it('works', function(){
    expect(2 + 2).to.equal(4);
  });

});

describe('setTimeout', function(){

  it('is accurate to a degree', function(done){
    var time = 50;
    var start = new Date();
    setTimeout(function(){
      var duration = new Date() - start;
      expect(duration).to.be.closeTo(time, 15);
      done();
    }, time);
  });

});


describe('forEach', function(){

  it('will invoke a function once per element', function () {
    var arr = ['x','y','z'];
    function logNth (val, index) {
      console.log('Logging elem #' + index + ':', val);
    }
    var spy = chai.spy(logNth);
    arr.forEach(spy);
    expect(spy).to.have.been.called.exactly(arr.length);
  });

});
