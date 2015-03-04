// Using an object and doing occasional garbage collection:
var Queue = function Queue () {
  // this implementation uses private vars, meaning we need instance methods.
  var data = [];
  var head = 0;
  var tail = 0;
  // here are our unique instance methods
  this.enqueue = function enqueue (item) {
    data[tail] = item;
    tail++;
    // garbage collection every time the array grows too big
    if (head > 100) {
      data = data.slice(head);
      head = 0;
      tail = data.length - 1;
    }
  };
  this.dequeue = function dequeue () {
    if (head === tail) return;
    var valToReturn = data[head];
    head++;
    return valToReturn;
    // return data[head++]; // this works because it's a POST-increment
  };
  this.size = function enqueue () {
    return tail - head;
  };
};

/* Using an object and deleting old keys:
var Queue = function Queue () {
  var data = {};
  var head = 0;
  var tail = 0;
  this.enqueue = function enqueue (item) {
    data[tail] = item;
    tail++;
  };
  this.dequeue = function dequeue () {
    if (head === tail) return;
    var valToReturn = data[head];
    head++;
    // garbage collection
    delete data[head - 1];
    return valToReturn;
  };
  this.size = function enqueue () {
    return tail - head;
  };
};
*/
