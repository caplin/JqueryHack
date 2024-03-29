// This example streams the video to a browser with an mjpeg stream
//var client = require('../lib/car');
var client = require('node-wirc').car;
var http = require('http');


var serialNumber = "0000944";
var woBot = "0000828";

client.discover()
    .then(function() { 
		return client.connect(woBot); 
	})
    .then(function() { return client.enable(); })
    .then(function() {

        var streams = [];

        var server = http.createServer(function(req, res) {
            if (req.url == '/stream') {

                var boundary = 'pancakes';

                res.writeHead(200, {
                    'Content-Type': 'multipart/x-mixed-replace; boundary='+boundary,
                    'Expires': 'Fri, 01 Jan 1990 00:00:00 GMT',
                    'Cache-Control': 'no-cache, no-store, max-age=0',
                    'Pragma': 'no-cache'
                });

                // Adds a function to stream data to this request
                var index = streams.length;
                streams.push(function(data) {
                    res.write('--'+boundary+'\nContent-Type: image/jpeg\nContent-length: ' + data.image.length + '\n\n');
                    res.write(data.image);
                });

                //Removes the function when the request is closed
                req.on("close", function(err) {
                    streams.splice(index, 1);
                });
            }
            else {
                // You can access this stream directly from http://localhost:8000/stream
                // ...but you get horrible memory leaks
                res.write('<!doctype html><image src="http://localhost:8000/stream">');
                res.end();
            }
        });

        server.listen(8000);

        // Sends camera stream to each request
        client.startCamera(0, function(data) {
            for (var i = 0; i < streams.length; i++) {
                if (streams[i]) streams[i](data);
            }
        });
    });
