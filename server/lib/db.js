var sys = require('sys');
var colors = require("colors");
var settings = require('../settings').settings;

var mongodb = require("mongodb"), mongoserver = new mongodb.Server(
		settings.mongo.host, settings.mongo.port, settings.mongo.serveropt), 
		__db__ = new mongodb.Db(
		settings.mongo.dbname, mongoserver, settings.mongo.dbopt);




var mongo = exports.mongo = {
	q: [],
	exec : function(callback) {
		var self = this;
		if(__db__.serverConfig.isConnected()){
			callback(null, __db__);
		}else{
			if(__db__._state == "disconnected"){
				__db__.open(function(err, db) {
								if (err)
									throw err;
								sys.log("mongodb connected:host=" + settings.mongo.host + ":" + settings.mongo.port + ",db=" + settings.mongo.dbname);
								self.q.forEach(function(cb){
									cb(null,db);
								});
				});
			}
			self.q.push(callback);
		} 
	}
};