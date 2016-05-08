
var io = require('socket.io').listen(8081); 
var Client = require('mariasql');

var c = new Client({ 
	host: '127.0.0.1', 
	user: 'root', 
	password: 'root' 
});

io.sockets.on('connection', function (socket) {
	console.log('New connection');

	socket.on('message', function (query) {
		console.log('New message ' + query);

		c.query(query, function(err, rows) { 
			if (err) {
				socket.json.send({ type: 'error', data: err });
				console.log(err);
			} else {
				socket.json.send({ type: 'data', data: rows });
				console.log(rows);
			}
		});
	});
	socket.on('disconnect', function() {
		c.end();
	});
});


/*var io = require('socket.io').listen(8081); 
//io.set('log level', 1);

io.sockets.on('connection', function (socket) {
	var ID = (socket.id).toString().substr(0, 5);
	var time = (new Date).toLocaleTimeString();
	socket.json.send({'event': 'connected', 'name': ID, 'time': time});
	socket.broadcast.json.send({'event': 'userJoined', 'name': ID, 'time': time});
	socket.on('message', function (msg) {
		var time = (new Date).toLocaleTimeString();
		socket.json.send({'event': 'messageSent', 'name': ID, 'text': msg, 'time': time});
		socket.broadcast.json.send({'event': 'messageReceived', 'name': ID, 'text': msg, 'time': time})
	});
	socket.on('disconnect', function() {
		var time = (new Date).toLocaleTimeString();
		io.sockets.json.send({'event': 'userSplit', 'name': ID, 'time': time});
	});
});*/