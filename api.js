var http = require("http");

var data = require("./data/inventory");
var contentType = require('content-type');
var SerialPort = require('serialport');
var port = new SerialPort('COM4', {
		  parser: SerialPort.parsers.raw
		});

var idTarjeta;

http.createServer(function(req, res) {

	if (req.url === "/") {
		res.writeHead(200, {"Content-Type": "text/json"});
	   	
	   	string = "[{'idTarjeta':'"+idTarjeta+"'}]"	
	   	var text = '{ "data" : [' +
								'{ "idTarjeta":"'+idTarjeta+'" } ]}';
	   	


	   	var obj = JSON.parse(text);
	    res.end(JSON.stringify(obj));
		
		console.log(port.isOpen());

	} else if (req.url === "/c") {
		
		res.writeHead(200, {"Content-Type": "text/plain"});
		res.end("id tarjeta: " + idTarjeta);
	} else if (req.url === "/onorder") {
		listOnBackOrder(res);
	} else {
		res.writeHead(404, {"Content-Type": "text/plain"});
		res.end("Whoops... Data not found");
	}

	

}).listen(3000);

port.on('data', function (data) {

  var datastring = data.toString("hex");
  console.log(doit(datastring));


  idTarjeta = doit(datastring);
});

function doit(hex) {
    var num = 0;
    for(var x=0;x<hex.length;x++) {
        var hexdigit = parseInt(hex[x],16);
        num = (num << 4) | hexdigit;
    }
    return num;
}
console.log("Server listening on port 3000");


function listInStock(res) {

	var inStock = data.filter(function(item) {
		return item.avail === "In stock";
	});

	res.end(JSON.stringify(inStock));

}

function listOnBackOrder(res) {

	var onOrder = data.filter(function(item) {
		return item.avail === "On back order";
	});

	res.end(JSON.stringify(onOrder));

}