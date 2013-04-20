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

var server = http.createServer(requestHandler);
server.listen(8010);

function requestHandler(req, res) {
	console.info('request', req.url);
	consumeRequest(res, req.url);
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