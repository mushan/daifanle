var sys = require('sys');
var colors = require("colors");
var format = require('util').format;
var mongo = require('../lib/db').mongo;
var objectid = require('mongodb').ObjectID;
var settings = require('../settings').settings;

var Status_Collection_Name="status";
var status=exports.status={
	get_statuses:function(pageIndex,callback){
		mongo.exec(function(err,db){
			if(err!==null){
				callback(err,null);
			}else{
				var _coll=db.collection(Status_Collection_Name);
				try{
					if(pageIndex===undefined || pageIndex===null || pageIndex==""){

					}else{

					}
				}catch(e){
					callback(e,null);
				}
			}
		});
	},

	add_status:function(status,callback){
		mongo.exec(function(err,db){
			if(err!==null){
				callback(err,null);
			}else{
				var _coll=db.collection(Status_Collection_Name);
				try{
					_coll.insert(status,{w:1},callback);
				}catch(e){
					callback(e,null);
				}
			}
		});
	}
}