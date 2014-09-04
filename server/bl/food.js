var sys = require('sys');
var colors = require("colors");
var format = require('util').format;
var mongo = require('../lib/db').mongo;
var objectid = require('mongodb').ObjectID;
var settings = require('../settings').settings;

var Food_Collection_Name = "food";

var food = exports.food = {
	add : function(data, callback) {
		mongo.exec(function(err, db) {
			if (err !== null) {
				callback(err, null);
			} else {
				var coll = db.collection(Food_Collection_Name);
				coll.insert({
					"pic" :data
				}, {
					w : 1
				}, callback);
			}
		});
	},

	get : function(attr, callback) {
		mongo.exec(function(err, db) {
			if (err !== null) {
				callback(err, null);
			} else {
				try {
					var coll = db.collection(Food_Collection_Name);
					coll.find(attr).toArray(callback);
				} catch (e) {
					callback(e, null);
				}
			}
		});
	}

}
