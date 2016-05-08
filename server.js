
var io = require('socket.io').listen(8081); 
var Client = require('mariasql');
var crypto = require('crypto');

var c = new Client({ 
	host: '127.0.0.1', 
	user: 'root', 
	password: 'root' 
});

var clients = [];
var numClients = 0;

io.sockets.on('connection', function (socket) {
	console.log('New connection');
	c.query('USE paint;');

	clients.

	socket.on('message', function (query) {
		console.log('New message ' + query.action);

		if (query.action == 'getSession') {
			var session = crypto.createHash('md5').update(Date.now() + '').digest('hex');
			c.query('INSERT INTO sessions VALUES (null, \'' + session + '\', now());', function (err, rows) {
				if (err) {
					socket.json.send({ action: 'getSession', type: 'error', data: err });
				} else {
					socket.json.send({ action: 'getSession', type: 'data', data: { session: session } });
				}
			});
		} else if (query.action == 'setSession') {
			c.query('SELECT COUNT(*) as count FROM sessions WHERE code = \'' + query.data.session + '\';', function (err, rows) {
				if (err) {
					socket.json.send({ action: 'setSession', type: 'error', data: { type: 'DB', error: err } });
				} else {
					if (rows[0]['count'] == 0) {
						socket.json.send({ action: 'setSession', type: 'error', data: { type: 'No session' } });
					} else {
						socket.json.send({ action: 'setSession', type: 'data', data: { type: 'Ok' } });
					}
				}
			});
		}
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