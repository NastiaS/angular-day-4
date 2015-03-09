var Vehicle = function(plateNum, color){
	this.licensePlate = plateNum;
	this.color = color;
}

Vehicle.prototype.beep = function(){
	return "BEEP, BEEP";
}

Vehicle.prototype.changeColor = function(color){
	this.color = color;
}



var Truck = function(plateNum, color, transmission){
	Vehicle.apply(this, [plateNum, color]);
	this.transmission = transmission;
}



Truck.prototype = Object.create(Vehicle.prototype);

Truck.prototype.constructor = Truck;

