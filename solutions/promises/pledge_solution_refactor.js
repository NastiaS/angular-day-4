// handler group constructor
var HandlerGroup = function (successCb, errorCb) {
  this.successCb = (typeof successCb === 'function') ? successCb : null;
  this.errorCb = (typeof errorCb === 'function') ? errorCb : null;
  // this deferral object controls the promise sent out by .then (chaining)
  this.forwarder = new Deferral();
};

// promise constructor
var $Promise = function () {
  this.state = 'pending';
  this.handlerGroups = [];
  this.updateCbs = [];
  return this;
};

// attaches callbacks, returns an output promise
$Promise.prototype.then = function (successCb, errorCb, updateCb) {
  if (typeof updateCb === 'function') this.updateCbs.push(updateCb);
  var newGroup = new HandlerGroup( successCb, errorCb );
  this.handlerGroups.push(newGroup);
  if (this.state !== 'pending') this.callHandlers();
  return newGroup.forwarder.$promise; // "promiseB," controlled by forwarder
};

// a simple convenience method for error handler attachment
$Promise.prototype.catch = function(errorCb) {
  return this.then(null, errorCb);
};

// called by .then, .resolve, & .reject so handlers run when they can
$Promise.prototype.callHandlers = function() {
  var hGroup, handler, method, output;
  while ( this.handlerGroups.length ) {
    hGroup = this.handlerGroups.shift();
    handler = (this.state === 'resolved') ? hGroup.successCb : hGroup.errorCb;
    if ( !handler ) { // no handler? pass along our value (bubbling)
      method = (this.state === 'resolved') ? 'resolve' : 'reject';
      hGroup.forwarder[method]( this.value );
    } else { // have the right handler
      try {
        output = handler(this.value); // call handler
        // if the return is a promise, assimilate it; otherwise, pass it along
        if ( output instanceof $Promise ) hGroup.forwarder.assimilate( output );
        else hGroup.forwarder.resolve( output );
      } catch (err) { // forward any thrown exceptions
        hGroup.forwarder.reject( err );
      }
    }
  }
};

// on notification, run update callbacks (like event listener)
$Promise.prototype.callUpdaters = function(info) {
  // by convention, promises stop "listening" once settled
  if (this.state === 'pending') {
    this.updateCbs.forEach(function (updateCb) {
      updateCb( info );
    });
  }
};

// the deferral object manages its associated promise
var Deferral = function () {
  this.$promise = new $Promise();
};

// assimilation abstracted out of handler method for clarity
Deferral.prototype.assimilate = function (returnedPromise) {
  var forwarder = this;
  // make the output promise (controlled by forwarder) mimic the return promise
  returnedPromise.then(
    forwarder.resolve.bind(forwarder),
    forwarder.reject.bind(forwarder)
  );
};

// resolve & reject are very similar, so they can both a settle method
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

Deferral.prototype.notify = function(info) {
  this.$promise.callUpdaters(info);
};

// this is our main library function which we'd put in module.exports
var defer = function () {
  return new Deferral();
};
