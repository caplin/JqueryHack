var Q = require('q');

var car = {
	discover: function() {
		return Q(true);
	},
	enable: function() {
		return Q(true);
	},
	connect: function(serial) {
		return Q(true);
	},
	startCamera: function(number, callback) {
		console.log('start camera');
/*		setInterval(function() {
			callback();
		}, 3000); */
	},
	steer: function(val) {
		console.log('car steering set to '+val);
	},
	move: function(val) {
		console.log('car engine set to '+val);
	}

}

exports.car = car;