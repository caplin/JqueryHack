var MockCar = function() {
	this.steerValue = null;
	this.moveValue = null;
}

MockCar.prototype.steer = function(value) {
	this.steerValue = value;
}

MockCar.prototype.move = function(value) {
	this.steerValue = value;
}