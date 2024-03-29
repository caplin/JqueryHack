var fs = require('fs');
var url = require('url');
var http = require('http');
var client = require('node-wirc').car;

var mimes = {
	'css' : 'text/css',
	'js' : 'text/javascript',
	'htm' : 'text/html',
	'html' : 'text/html',
	'ico' : 'image/vnd.microsoft.icon'
};

var streams = [];
var woBot = "0000828";
var imageRecordTime = 0;
var caplinCar = "0000944";

client.discover()
    .then(function() { 
		return client.connect(caplinCar); 
	})
    .then(function() { return client.enable(); })
    .then(function() {

        var server = http.createServer(requestHandler);

        server.listen(8000);

        // Sends camera stream to each request
        client.startCamera(0, handleCamera);
	});

function requestHandler(req, res) {
	if (req.url == '/stream') {
		sendCarWebcamImage(req, res);
	}
	else if (req.url.substring(0, 9) === '/control?') {
		handleControlRequest(req.url, res);
	}
	else {
		console.info('request', req.url);
		consumeRequest(res, req.url);
	}
};

function sendCarWebcamImage(req, res) {

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
};

function handleControlRequest(sUrl, res) {
	var parsedUrl = url.parse(sUrl, true);
	var queryParam = parsedUrl.query;

	console.info(queryParam);

	if(queryParam.record !== undefined)
	{
		counter = 0;
		
		imageRecordTime = Date.now() + (1000 * parseFloat(queryParam.record));
		
		console.info(imageRecordTime);
	}
	else
	{
		var move = parseFloat(queryParam.move);
		var steer = parseFloat(queryParam.steer);

		client.move(move);
		client.steer(steer);
	}

	res.end();
};

function consumeRequest(response, url) {
	url = '.' + (url === '/' ? '/webhome/index.html' : '/webhome/' + url);

	fs.readFile(url, fileHandler.bind(null, response, url));
};

function fileHandler(response, url, error, content) {
	if (error)
	{
		console.log('error loading file ' + url + ': ', error);

		response.writeHead(404);
		response.end();
	}
	else
	{
		// Lookup the mimetype of the file
		var tmp     = url.lastIndexOf('.');
		var ext     = url.substring((tmp + 1));
		var mime    = mimes[ext] || 'text/plain';
		// Write the file
		response.writeHead(200, { 'Content-Type': mime });
		response.end(content, 'utf-8');
	}
};

var counter = 0;

function handleCamera(data) {
	for (var i = 0; i < streams.length; i++) {
		if (streams[i]) streams[i](data);
	}
	
	if(Date.now() < imageRecordTime)
	{
		fs.writeFile("imgs/img"+(counter++)+".jpg", data.image, function() {
				console.log('writing', arguments);
		});
	
		console.info('Recording image');
	}
};
