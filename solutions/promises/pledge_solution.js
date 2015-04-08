/*----------------------------------------------------------------
Promises Workshop: build the pledge.js deferral-style promise library
----------------------------------------------------------------*/
// YOUR CODE HERE:

// Handler Group constructor
var HandlerGroup = function (successCb, errorCb) {
  this.successCb = (typeof successCb === 'function') ? successCb : null;
  this.errorCb = (typeof errorCb === 'function') ? errorCb : null;
  this.forwarder = new Deferral(); // controls "promiseB" in the flowchart
};

// Promise constructor
var $Promise = function () {
  this.state = 'pending';
  this.handlerGroups = [];
};

// then attaches callbacks to run when the promise settles
$Promise.prototype.then = function(successCb, errorCb) {
  var newGroup = new HandlerGroup(successCb, errorCb);
  this.handlerGroups.push(newGroup);
  // if the promise is already settled, run the callbacks
  if (this.state !== 'pending') this.callHandlers();
  return newGroup.forwarder.$promise; // "promiseB" in the flowchart
};

// convenience method for pretty code
$Promise.prototype.catch = function(errorCb) {
  return this.then(null, errorCb);
};

// runs when we settle the promise OR when we attach callbacks to an already-settled promise
$Promise.prototype.callHandlers = function() {
  var hGroup, handler, output;
  while (this.handlerGroups.length) {
    // shifting ensures that callbacks run in order, one time only
    hGroup = this.handlerGroups.shift();
    handler = (this.state === 'resolved') ? hGroup.successCb : hGroup.errorCb;
    if (handler) { // if we have the right handler for our state
      try {
        output = handler(this.value);
        if (output instanceof $Promise) hGroup.forwarder.assimilate(output); // abstracted out the assimilation (see below)
        else hGroup.forwarder.resolve(output); // send result to next success function available in the chain
      } catch (err) { // if the handler function blew up…
        hGroup.forwarder.reject(err); // we should hit the next error handler in the chain
      }
    } // bubbling success or error if we don't have the right function
    else if (this.state === 'resolved') hGroup.forwarder.resolve(this.value);
    else if (this.state === 'rejected') hGroup.forwarder.reject(this.value);

  }
};

// Deferral constructor
var Deferral = function () {
  this.$promise = new $Promise();
};

// Assimilation — promiseB should mimic the returned Promise
Deferral.prototype.assimilate = function(returnedPromise) {
  var forwarder = this; // this controls promiseB
  returnedPromise.then( // when the returned promise does something…
    function(data){ forwarder.resolve(data); }, // promiseB does the same
    function(reason){ forwarder.reject(reason); }
    // forwarder.resolve.bind(forwarder), // .bind for `this` issues
    // forwarder.reject.bind(forwarder)
  );
};

// a simplification for resolution/rejection symmetry
Deferral.prototype.settle = function(state, value) {
  var promise = this.$promise;
  if (promise.state === 'pending') {
    promise.state = state;
    promise.value = value;
    promise.callHandlers();
  }
};

Deferral.prototype.resolve = function(data) {
  this.settle('resolved', data);
};

Deferral.prototype.reject = function(reason) {
  this.settle('rejected', reason);
};

// our main library function
function defer () {
  return new Deferral();
}

/*-------------------------------------------------------
The spec was designed to work with Test'Em, so we don't
actually use module.exports. But here it is for reference:

module.exports = {
  defer: defer,
};

So in a Node-based project we could write things like this:

var pledge = require('pledge');
…
var myDeferral = pledge.defer();
var myPromise1 = myDeferral.$promise;
--------------------------------------------------------*/
