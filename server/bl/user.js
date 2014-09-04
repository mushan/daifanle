var sys = require('sys');
var colors = require("colors");
var format = require('util').format;
var mongo = require('../lib/db').mongo;
var objectid = require('mongodb').ObjectID;
var settings = require('../settings').settings;

var Account_Collection_Name = "user";
var user = exports.user = {

	add : function(atatr, callback) {
		mongo.exec(function(err, db) {
			if (err !== null) {
				callback(err, null);
			} else {
				try {
					var coll = db.collection(Account_Collection_Name);
					coll.insert(attr, {
						w : 1
					}, callback);
				} catch (e) {
					callback(e, null);
				}
			}
		});
	},

	find_with_usr : function(usr, callback) {
		mongo.exec(function(err, db) {
			if (err !== null) {
				callback(err, db);
			} else {
				try {
					var coll = db.collection(Account_Collection_Name);
					coll.findOne(usr, callback);
				} catch (e) {
					callback(e, null);
				}
			}
		});
	},

}
