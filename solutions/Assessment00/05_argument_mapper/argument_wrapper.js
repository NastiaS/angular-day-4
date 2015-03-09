function createArgumentMap(func) {
	
	var args = Array.prototype.slice.call(arguments);
	var result = {};
	
	args.map(function(arg, index){
		result["a" + (index)] = arg;
	});

	return result; 
}

function keyAdder(){
	var total = 0;
	for(key in this){
		if(Object.hasOwnProperty.call(this, key)){
			if(typeof this[key] === 'number'){
				total += this[key];
			}	
		}
	}
	return total;	
}
