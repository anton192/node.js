var should = require('should');
var io = require('socket.io-client');

var socketURL = 'http://127.0.0.1:8081';
var options = {
  transports: ['websocket'],
  'force new connection': true
};

describe('Server', function(){
	var socket;
	beforeEach(function(done) {
		console.log('Establishing connection');
		socket = io.connect(socketURL, options);

		socket.on('connect', function() {
			console.log('worked...');
			done();
		});
	});
	
	it('should receive messages', function(done){
		socket.on('message', function(data){
			console.log('received');
			done();
		});
	})
});

/*describe("Paint Server", function(){
	it('simple test', function() {
		var client1 = ioc.connect('http://127.0.0.1:8081', options);
		client1.on('connect', function (data) {
			client1.emit('message', {
				action: 'getSession'
			});
			
		});
	});
});*/


/*var assert = require('chai').assert;
describe('Array', function() {
  describe('#indexOf()', function () {
    it('should return -1 when the value is not present', function () {
      assert.equal(mul(2, 3), 6);
    });
  });
});*/