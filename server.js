
var io = require('socket.io').listen(8081); 
var Client = require('mariasql');
var crypto = require('crypto');

var c = new Client({ 
	host: '127.0.0.1', 
	user: 'root', 
	password: 'root' 
});

var sessions = [];

io.sockets.on('connection', function (socket) {
	console.log('New connection ' + socket.id);
	c.query('USE paint;');

	sessions[socket.id] = crypto.createHash('md5').update(Date.now() + '').digest('hex');
	c.query('INSERT INTO sessions VALUES (null, \'' + sessions[socket.id] + '\', now());');


	socket.on('message', function (query) {
		console.log('New message ' + query.action);

		if (query.action == 'getSession') {
			if (sessions[socket.id]) {
				socket.json.send({ action: 'getSession', type: 'data', data: { session: sessions[socket.id] } });
			} else {
				sessions[socket.id] = crypto.createHash('md5').update(Date.now() + '').digest('hex');
				c.query('INSERT INTO sessions VALUES (null, \'' + sessions[socket.id] + '\', now());', function(err, rows) {
					if (err) {
						socket.json.send({ action: 'getSession', type: 'error', data: { type: 'DB', error: err } });	
					} else {
						socket.json.send({ action: 'getSession', type: 'data', data: { session: sessions[socket.id] } });
					}
				});
			}
		}

		if (query.action == 'setSession') {
			c.query('SELECT COUNT(*) as count FROM sessions WHERE code = \'' + query.data.session + '\';', function (err, rows) {
				if (err) {
					socket.json.send({ action: 'setSession', type: 'error', data: { type: 'DB', error: err } });
				} else {
					if (rows[0]['count'] == 0) {
						socket.json.send({ action: 'setSession', type: 'error', data: { type: 'No session' } });
					} else {
						sessions[socket.id] = query.data.session;
						socket.json.send({ action: 'setSession', type: 'data', data: { type: 'Ok' } });
					}
				}
			});
		} 

		if (query.action == 'removeAction') {
			c.query('DELETE FROM actions WHERE id = ' + query.data.id + ' AND session = \'' + sessions[socket.id] + '\';', function(err, rows) {
				if (err) {
					socket.json.send({ action: 'removeAction', type: 'error', data: { type: 'DB', error: err } });
				} else {
					if (rows.info.affectedRows == 0) {
						socket.json.send({ action: 'removeAction', type: 'error', data: { type: 'No actual actions' } });
					} else {
						socket.json.send({ action: 'removeAction', type: 'data', data: { type: 'Ok' } });
					}
				}
			});
		}

		if (query.action == 'addAction') {
			c.query('INSERT INTO actions VALUES(null, :object, \'' + sessions[socket.id] + '\', :xMin, :xMax, :yMin, :yMax, ' + Date.now() + ');', query.data, function(err, rows) {
				if (err) {
					socket.json.send({ action: 'addAction', type: 'error', data: { type: 'DB', error: err } });
				} else {
					socket.json.send({ action: 'addAction', type: 'data', data: { type: 'ok' } });
				}
			});	
		}

		/*
			CREATE TABLE actions(
				id INT NOT NULL AUTO_INCREMENT,
				object varchar(1024),
				session varchar(128),
				xMin DOUBLE,
				xMax DOUBLE,
				yMin DOUBLE,
				yMax DOUBLE,
				time DOUBLE,
				PRIMARY KEY (id)
			);
		*/
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