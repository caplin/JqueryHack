var client = require('node-wirc').car;

var caplinCar = "0000944";
var wobot = "0000828";

client.discover()
.then(function() {
	console.log('discovered');
	return client.connect(wobot);
}).then(function() {
	console.log('connected');
	return client.enable();
})
.then(function() {
	console.log('control enabled');
	var steer = 1;
	var move = 0.5;

	// Full left (might be right...)
	client.steer(steer);

	// Full forward!
	client.move(move);

	// Let's dance
	setInterval(function() {

		// And the other way
		steer = -steer;
		move = -move;

		client.move(move);
		client.steer(steer);
	}, 800)
});

