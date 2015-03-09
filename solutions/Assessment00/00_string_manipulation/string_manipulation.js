// basic, no regex
function vowelsCount(str){
	var vowelIndex = "aeiou";
	var strArray = str.toLowerCase().split("");
	var count = 0;
	for(var i = 0; i < strArray.length; i++){
		if(vowelIndex.indexOf(strArray[i]) !== -1){
			count++;
		}
	}

	return count;
}