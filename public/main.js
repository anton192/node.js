window.onload = function() {
	socket = io.connect('http://127.0.0.1:8081');

	socket.on('connect', function () {
		socket.on('message', function (msg) {
			document.querySelector('#log').innerHTML += "[" + msg.type + "] " + msg.data;
			document.querySelector('#log').scrollTop = document.querySelector('#log').scrollHeight;
		});

		document.querySelector('#input').onkeypress = function(e) {
			if (e.which == '13') {
				socket.send((document.querySelector('#input').value));
				document.querySelector('#input').value = '';
			}
		};
		document.querySelector('#send').onclick = function() {
			socket.send((document.querySelector('#input').value));
			document.querySelector('#input').value = '';
		};		
	});
};
