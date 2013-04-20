// This example streams the video to a browser with an mjpeg stream
//var client = require('../lib/car');
var client = require('node-wirc').car;
var fs = require('fs');

var serialNumber = "0000944";
var woBot = "0000828";

console.log('discover');

client.discover()
	.then(function() {
		console.log('discovered', arguments);
		return client.connect(woBot);
	}).then(function() {
		console.log('Control enabled');
		return client.enable();
	}).then(function() {
		var counter = 0;
		// Sends camera stream to each request
		client.startCamera(0, function(data) {

		fs.writeFile("imgs/img"+(counter++)+".jpg", data, function() {
			console.log('writing', arguments);
		})
	});
});
