var sys = require('sys');
var colors = require("colors");
var format = require('util').format;
var mongo = require('../lib/db').mongo;
var objectid = require('mongodb').ObjectID;
var settings = require('../settings').settings;

var Status_Collection_Name = "status";
var status = exports.status = {

	add : function(attr, callback) {
		mongo.exec(function(err, db) {
			if (err !== null) {
				callback(err, null);
			} else {
				try {
					var coll = db.collection(Status_Collection_Name);
					coll.update(attr, {
						"$set" : {
							"createtime" : Date.now()
						}
					}, {
						upsert : true,
						w : 1
					}, callback);
				} catch (e) {
					callback(e, null);
				}
			}
		});
	},

	get : function(attr, callback) {
		mongo.exec(function(err, db) {
			if (err !== null) {
				callback(err, null);
			} else {
				try {
					var coll = db.collection(Status_Collection_Name);
					coll.find(attr, {
						sort : [ [ "createtime", -1 ] ]
					}).toArray(callback);
				} catch (e) {
					callback(e, null);
				}
			}
		});
	},

	follow : function(attr, callback) {
		mongo.exec(function(err, db) {
			if (err !== null) {
				callback(err, null);
			} else {
				try {
					var coll = db.collection(Status_Collection_Name);
					var query = undefined;
					try {
						query = {
							"_id" : new objectid(attr.status_id)
						};
					} catch (e) {
						query = {
							"_id" : attr.status_id
						};
					}			    
					coll.update(query, {
						$push : {
							"follows" : attr.follow
						},
						$inc : {
							"follow_total" : 1
						}
					}, callback);
				} catch (e) {
					callback(e, null);
				}
			}

		});

	},

	comment : function(attr, callback) {
		mongo.exec(function(err, db) {
			if (err !== null) {
				callback(err, null);
			} else {
				try {
					var coll = db.collection(Status_Collection_Name);
					var query = undefined;
					try {
						query = {
							"_id" : new objectid(attr.status_id)
						};
					} catch (e) {
						query = {
							"_id" : attr.status_id
						};
					}
					coll.update(query, {
						$push : {
							"comments" : attr.comment
						},
						$inc : {
							"comment_total" : 1
						}
					}, callback);

				} catch (e) {
					callback(e, null);
				}
			}
		});
	},

	assist : function(attr, callback) {
		mongo.exec(function(err, db) {
			if (err !== null) {
				callback(err, null);
			} else {
				try {
					var coll = db.collection(Status_Collection_Name);
					var query = undefined;
					try {
						query = {
							"_id" : new objectid(attr.status_id)
						};
					} catch (e) {
						query = {
							"_id" : attr.status_id
						};
					}
					if (attr.num > 0) {
						// 点赞
						coll.update(query, {
							$push : {
								"assists" : {
									"name" : attr.name,
									"createtime" : Date.now()
								}
							},
							$inc : {
								"assist_total" : 1
							}
						}, callback);
					} else {
						// 取消赞
						coll.update(query, {
							$pull : {
								"assists" : {
									"name" : attr.name
								}
							},
							$inc : {
								"assist_total" : -1
							}
						}, callback);
					}
				} catch (e) {
					callback(e, null);
				}
			}
		});
	},
}