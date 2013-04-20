var client = require('node-wirc').car;
var http = require('http');
var fs = require('fs');


var caplinCar = "0000944";
var woBot = "0000828";

client.discover()
    .then(function() { 
		return client.connect(caplinCar); 
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
			else if (req.url == '/control') {
				
			}
            else {
				consumeRequest(res, req.url);
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

var mimes = {
	'css' : 'text/css',
	'js' : 'text/javascript',
	'htm' : 'text/html',
	'html' : 'text/html',
	'ico' : 'image/vnd.microsoft.icon'
};

function fileHandler(response, url, error, content)
{
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

function consumeRequest(response, url)
{
	url = '.' + (url === '/' ? '/webhome/index.html' : './webhome/' + url);

	fs.readFile(url, fileHandler.bind(null, response, url));
};