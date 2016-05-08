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
					action: 'getSession',
					data: {}
				});
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
