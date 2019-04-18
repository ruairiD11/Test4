var http = require('http').createServer(handler); //require http server, and create server with function handler()
var fs = require('fs'); //require filesystem module
var io = require('socket.io')(http) //require socket.io module and pass the http object (server)
var Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO
var upButton = new Gpio(17, 'in', 'both'); //use GPIO pin 17 as input

http.listen(8080); //listen to port 8080

function handler (req, res) { //create server
  fs.readFile(__dirname + '/public/index.html', function(err, data) { //read file index.html in public folder
    if (err) {
      res.writeHead(404, {'Content-Type': 'text/html'}); //display 404 on error
      return res.end("404 Not Found");
    }
    res.writeHead(200, {'Content-Type': 'text/html'}); //write HTML
		res.write(data); //write data from index.html
    return res.end();
  });
}

io.sockets.on('connection', function (socket) {// WebSocket Connection
  var upValue = 1;
  upButton.watch(function (err, value) { //Watch for hardware interrupts on pushButton
    if (err) { //if an error
      console.error('There was an error', err); //output error message to console
      return;
		}
    upValue = value;
    socket.emit('UP', upValue); //send button status to client
	  if(upValue == 0){
			console.log("Up button press");
	   }
 });
});



process.on('SIGINT', function () { //on ctrl+c

upButton.unexport(); // Unexport Button GPIO to free resources

process.exit(); //exit completely

});
