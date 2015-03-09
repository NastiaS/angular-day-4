function alternate(fn){
	var count = 0;

	return function(){
		count++;
		if(count%2!==0){
			fn();
		}
	}
}
