// Our binary search tree doubles as a root node constructor.
// Every node of a BST is itself the root of a smaller BST!
function BinarySearchTree(root) {
  this.value = root;
  this.left = null;
  this.right = null;
  // we will keep track of the size rather than compute it
  this.tSize = 1;
}

BinarySearchTree.prototype.insert = function(item) {
  this.tSize++;
  var direction = (item < this.value) ? 'left' : 'right';
  // recursively insert
  if (this[direction]) this[direction].insert(item);
  // or place a new node if we are at the end of the tree
  else this[direction] = new BinarySearchTree(item);
};

BinarySearchTree.prototype.contains = function(item) {
  if (item === this.value) return true;
  var child = (item < this.value) ? this.left : this.right;
  // boolean type coercion with !! and short-circuiting with &&
  return !!( child && child.contains(item) );
};

BinarySearchTree.prototype.depthFirstForEach = function(iterator) {
  // invoke the function every time we have a node
  iterator(this.value);
  // recursively traverse the tree down the left branches first
  if (this.left) this.left.depthFirstForEach(iterator);
  if (this.right) this.right.depthFirstForEach(iterator);
};

BinarySearchTree.prototype.breadthFirstForEach = function(iterator) {
  // make a queue starting with the current node (this)
  var queue = [this],
      node;
  // as long as there are still nodes…
  while (queue.length) {
    // invoke the function on the head node
    node = queue.shift();
    iterator(node.value);
    // add both children to the queue
    if (node.left) queue.push(node.left);
    if (node.right) queue.push(node.right);
  }
};

BinarySearchTree.prototype.size = function() {
  return this.tSize;
};
