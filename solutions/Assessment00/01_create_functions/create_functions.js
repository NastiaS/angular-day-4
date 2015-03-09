
// function createFunctions(n) {
//   var callbacks = [];

//   var wrapper = function(x){
//     return function(){
//       return x;
//     };
//   };

//   for (var i=0; i<n; i++) {
//     callbacks.push(wrapper(i));
//   }
  
//   return callbacks;
// }


function createFunctions(num){

  var arrayOfFunctions = [];

  for(var i = 0; i < num; i++){
    
    arrayOfFunctions.push((function(x){
      return function(){
        return x;
      }
    })(i));
  }

  return arrayOfFunctions;
}