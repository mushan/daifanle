var fs = require('fs');
var sys = require('sys');
var colors = require("colors");

var _json = module.exports.json = function(resp, code, data) {
	resp.writeHead(code, {
		'Content-Type' : 'text/plain'
	});
	resp.end(JSON.stringify(data));
};
