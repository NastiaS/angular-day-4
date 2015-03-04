function LinkedList () {
  this.head = null;
  this.tail = null;
}

LinkedList.prototype.addToHead = function(item) {
  var newNode = new Node(item);
  if (!this.head) this.head = this.tail = newNode;
  else {
    newNode.next = this.head;
    this.head.previous = newNode;
    this.head = newNode;
  }
};

LinkedList.prototype.addToTail = function(item) {
  var newNode = new Node(item);
  if (!this.head) this.head = this.tail = newNode;
  else {
    newNode.previous = this.tail;
    this.tail.next = newNode;
    this.tail = newNode;
  }
};

LinkedList.prototype.removeHead = function() {
  if (!this.head) return;
  var oldHead = this.head;
  this.head = oldHead.next;
  if (this.head) this.head.previous = null;
  else this.tail = null;
  return oldHead.value;
};

LinkedList.prototype.removeTail = function() {
  if (!this.tail) return;
  var oldTail = this.tail;
  this.tail = oldTail.previous;
  if (this.tail) this.tail.next = null;
  else this.head = null;
  return oldTail.value;
};

LinkedList.prototype.search = function(check) {
  var currentNode = this.head;
  if (check instanceof Function) {
    for (; currentNode; currentNode = currentNode.next) {
      if ( check(currentNode) ) return currentNode.value;
    }
  } else {
    for (; currentNode; currentNode = currentNode.next) {
      if (currentNode.value == check) return currentNode.value;
    }
  }
  return null;
  // while (currentNode) {
  //   if (currentNode.value === check) return check;
  //   currentNode = currentNode.next;
  // }
};

function Node (value, next, prev) {
  this.value = value;
  this.next = next || null;
  this.previous = prev || null;
}
