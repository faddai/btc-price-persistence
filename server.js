var WebsocketClient = require('./lib/websocket');
var mongoose = require('./lib/mongoose');
var MarketData = require('./model');

var ws = new WebsocketClient('http://localhost:8086');

console.log('Data Persistence Application is running...');

ws.on('market data', function (data) {
	// persist market data here
	new MarketData(data).save(function (err, res) {
		if (err) throw err;
		
		console.log(res);
	});
});
