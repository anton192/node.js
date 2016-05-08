window.onload = function() {
	socket = io.connect('http://127.0.0.1:8081');
//JSON.parse(JSON.stringify(a))
	socket.on('connect', function () {
		socket.on('message', function (msg) {
			document.querySelector('#log').innerHTML += JSON.stringify(msg) + "<br />";
			document.querySelector('#log').scrollTop = document.querySelector('#log').scrollHeight;
		});

		document.querySelector('#input').onkeypress = function(e) {
			if (e.which == '13') {
				socket.send({
					action: 'setSession',
					data: {
						session: '45eed83caa67bc0f658b378f808d9310'
					}
				});
				setTimeout(function () {
					socket.send({
						action: 'addAction',
						data: {
							object: 'object',
							xMin: 1,
							xMax: 2,
							yMin: 3,
							yMax: 4
						}
					});
					setTimeout(function () {
						socket.send({
							action: 'getAreaActions',
							data: {
								xMin: 1,
								xMax: 2,
								yMin: 3,
								yMax: 4,
								timeStart: 0,
								timeEnd: 1562728126770
							}
						});
					}, 1000);
				}, 1000);
			}
		};
		document.querySelector('#send').onclick = function() {
			if (e.which == '13') {
				socket.send({
					action: 'getSession',
					data: {}
				});
			}
			//socket.send((document.querySelector('#input').value));
			//document.querySelector('#input').value = '';
		};		
	});
};
