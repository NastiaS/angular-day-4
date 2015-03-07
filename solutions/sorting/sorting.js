function bubbleSort(array) {
  function swap(i,j) {
    var x = array[i];
    array[i] = array[j];
    array[j] = x;
  }

  var swaps;
  while (swaps !== 0) {
    swaps = 0;
    for (var i = 0; i < array.length-1; i++) {
      if (array[i] > array[i+1]) {
        swap(i, i+1);
        swaps++;
      }
    }
  }

  return array;
}

function merge(left, right) {
  var merged = [];

  while (left.length > 0 || right.length > 0) {

    if (left.length && !right.length) {
      return merged.concat(left);

    } else if (!left.length && right.length) {
      return merged.concat(right);

    } else {
      if (left[0] < right[0]) {
        merged.push(left.shift());
      } else {
        merged.push(right.shift());
      }
    }
  }
  return merged;
}

function split (array) { 
  if (array.length === 1) {
    return [[], array];
  } else if (array.length === 0) {
    return [];
  }

  var halfPoint = Math.floor(array.length/2);
  // var left = array.slice(0,halfPoint);
  // var right = array.slice(halfPoint);
  var right = array.splice(halfPoint);
  return [array,right];
}

function mergeSort (array) {
  // base case
  if (array.length <= 1) {
    return array;
  }

  var splitHalves = split(array);
  var left = splitHalves[0];
  var right = splitHalves[1];

  var leftSorted = mergeSort(left);
  var rightSorted = mergeSort(right);

  return merge(leftSorted, rightSorted);
}

for(var i=12; i < 16; i++) {
    var num_items = Math.pow(2,i);
    var native_test_array = [];
    var b_test_array = [];
    var m_test_array = []
    for(var j=0; j < num_items; j++) {
        var rand = Math.floor(Math.random() * num_items);
        native_test_array.push(rand);
        b_test_array.push(rand);
        m_test_array.push(rand);
    }

    console.time(num_items + "native");
    native_test_array.sort(function(a,b){ return a-b; });
    console.timeEnd(num_items + "native");

    console.time(num_items + "bubble");
    bubbleSort(b_test_array);
    console.timeEnd(num_items + "bubble");

    console.time(num_items + "merge");
    mergeSort(m_test_array);
    console.timeEnd(num_items + "merge");  
}




















