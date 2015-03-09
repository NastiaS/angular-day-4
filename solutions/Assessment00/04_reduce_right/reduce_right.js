var reduceRight = function (array, startVal, combinerFunc) {
  var currentVal = startVal;
  for (var i = array.length-1; i >= 0; i--) {
    currentVal = combinerFunc(currentVal, array[i]);
  }
  return currentVal;
};

// Recursive Sol
 
// var reduceRightRecursive = function(array, startVal, combinerFunc){
// 	var currentVal = startVal
// 	if( array.length === 0){
// 		return startVal;
// 	}
 
// 	var nextStartVal = combinerFunc(currentVal, array.pop());
 
// 	return reduceRightRecursive(array, nextStartVal, combinerFunc)
// }
