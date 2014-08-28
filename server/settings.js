var fs = require('fs');
module.exports.settings = {
	plugin_home : __dirname + "/plugins",
	tmp : __dirname + "/tmp",
	with_auth : false,
	mongo : {
		host : "localhost",
		port : 27017,
		dbname : "daifanle",
		serveropt : {
			'auto_reconnect' : true,
			poolSize : 5
		},

		dbopt : {
			w : -1
		}
	}
}