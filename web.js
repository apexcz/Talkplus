var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server);	
server.listen(process.env.PORT || 2014);

app.get('/', function(req,res){
	res.sendfile(__dirname + '/index.html');
});	
users = {};

var io = require('socket.io').listen(app);

io.sockets.on('connection', function (socket){


	function log(){
		var array = [">>> Message from server: "];
	  for (var i = 0; i < arguments.length; i++) {
	  	array.push(arguments[i]);
	  }
	    socket.emit('log', array);
	}

	socket.on('message', function (message) {
		log('Got message: ', message);
    // For a real app, should be room only (not broadcast)
		socket.broadcast.emit('message', message);
	});

	socket.on('create or join', function (room) {
		var numClients = io.sockets.clients(room.rm).length;

		log('Room ' + room.rm + ' has ' + numClients + ' client(s)');
		log('Request to create or join room', room.rm);

		if (numClients == 0){
			socket.join(room.rm);
			//nicknames.push(room.nick);
			socket.nicky = room.rm;
			users[socket.nicky] = socket;
			updateNicknames();
			socket.emit('created', room.rm);
		} else if (numClients == 1) {
			io.sockets.in(room.rm).emit('join', room.rm);
			socket.join(room.rm);
			socket.nicky = room.rm;
			users[socket.nicky] = socket;
			updateNicknames();
			$('.friend').append(room.nick);
			socket.emit('joined', {r:room.rm,n:room.nick});
		} else { // max two clients
			socket.emit('full', room.rm);
		}
		socket.emit('emit(): client ' + socket.id + ' joined room ' + room.rm);
		socket.broadcast.emit('broadcast(): client ' + socket.id + ' joined room ' + room.rm);

	});

	function updateNicknames(){
	io.sockets.emit('listusers',Object.keys(users));
}

});


