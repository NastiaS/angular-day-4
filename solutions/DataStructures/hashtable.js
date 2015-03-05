// conventions for saying a var is sort of like a constant (though it isn't)
var _NUMBUCKETS = 25;

function Hash () {
  this.numBuckets = _NUMBUCKETS;
  this.table = new Array(this.numBuckets); // sized array, won't need to grow.
  for (var i = 0; i < this.numBuckets; i++) {
    this.table[i] = new LinkedList(); // pre-seeding our linked lists
  }
}

Hash.prototype.set = function(key, val) {
  if (typeof key !== 'string') {
    // can throw strings, new Error(), new TypeError() etc.
    throw new TypeError('Keys must be strings');
  }
  var list = this.table[ this._hash(key) ];
  // not doing any garbage collection, but by adding to the head at least we know we'll get the latest version when we search for the node
  list.addToHead( new HashNode(key, val) );
};

Hash.prototype.get = function(key) {
  var list = this.table[ this._hash(key) ];
  // using our higher-order search function, we don't need valueOf:
  // function matcher (node) {
  //   return key === node.value.key;
  // }
  // return list.search(matcher).val;
  return list.search( key ).val; // or we can just use valueOf
};

Hash.prototype.hasKey = function(key) {
  var list = this.table[ this._hash(key) ];
  // return list.search( key ) ? true : false; // ternary operator
  return !!list.search( key ); // boolean type coercion
};

Hash.prototype._hash = function(key) {
  var sum = 0;
  for (var i = 0; i < key.length; i++) {
    sum += key.charCodeAt(i);
  }
  return sum % this.numBuckets;
  // instead, we could convert the string to an array and reduce the array:
  // function addCharCode (sum, char) {return sum + char.charCodeAt();}
  // return key.split('').reduce(addCharCode, 0) % this.numBuckets;
};

function HashNode (key, val) {
  this.key = key;
  this.val = val;
}

// valueOf will be used in loose equality (==) to convert object
HashNode.prototype.valueOf = function() {
  return this.key;
};
