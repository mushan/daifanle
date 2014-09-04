var sys = require('sys'),
	colors = require( "colors"),
    settings = require('../settings').settings,
    mongo = require('./db').mongo,
    gridstore = require('mongodb').GridStore,
    objectid = require('mongodb').ObjectID;

 var nipsfile  = exports.nipsfile = {

 		read : function(id,callback){
 			mongo.exec(function(err,db){
 				if(!err) {
 					if(id  == undefined || id == ""){
 						callback("file id is required",null);
 					}else{
 						var oid=new objectid(id);
 						console.log(oid);
 						gridstore.read(db,oid,callback);
 					}
 				}else{
 					sys.log(err.red);
 					callback(err,id);
 				}
 			});
 		},


 		write : function(id,buffer,callback,name) {
 			mongo.exec(function(err,db){
 				if(!err) {
 					if(id  == undefined || id==""){
 						var fd = new objectid();
 					}else{
 						var fd = new objectid(id);
 					}
					var gs = new gridstore(db, fd, name, "w");
					gs.open(function(err,gridstore){
						if(err){
							callback(err,fd);
						}else{
							gs.write(buffer,function(err,_gs){
								if(err!=null){
									callback(err,fd);
								}else{
									gs.close(function(err,_){
										callback(err,fd);
									});
								}
							});
						}
					})
 				}else{
 					sys.log(err.red);
 					callback(err,id);
 				}
 			});
 		},
		

		seek_then_write : function(id,at,buffer,total,callback) {
			/* save */
			var __save__  = function(db,fd,buff,callback,name){
				var gs = new gridstore(db,fd,name,"w+");
				gs.open(function(err,gridstore){
					if(err){
						callback(err,fd);
					}else{
						gs.seek(at,function(err,_gs){
							if(err!==null){
								callback(err,fd);
							}else{
								try{
									gs.write(buffer,function(err,data){
										if(err){
											callback(err,fd);
										}else{
											gs.close(function(err,_){
												callback(err,fd);
											});
										}
									});
								}catch(e){
									callback(e.message,fd);
								}
							}
						})
					}
				})
			};

 			mongo.exec(function(err,db){
 				if(!err) {
 					if(id  == undefined || id=="" || total == buffer.length){
 						var fd = new objectid();
 						__save__(db,fd,buffer,callback,fd.toString());
 					}else{
						var fd = new objectid(id);
						gridstore.exist(db,fd,function(err,existing){
							if(existing === true){
								__save__(db,fd,buffer,callback,fd.toString());
							}else{
								callback("file not existing",null);
							}
						})
 					}				
 				}else{
 					sys.log(err.red);
 					callback(err,id);
 				}
 			});
 		},


 		unlink : function(id,callback){
 			mongo.exec(function(err,db){
 				if(!err) {
 					if(id  == undefined || id == ""){
 						callback("file id is required",null);
 					}else{
 						var fd = new objectid(id);
 						var gs = new gridstore(db, fd , "r");
 						gs.open(function(err,gridstore){
							if(err){
								callback(err,fd);
							}else{
								gs.unlink(function(err,_gs){
										if(err!=null){
											callback(err,fd);
										}else{
											gs.close(function(err,_){
												callback(err,fd);
											});
										}
								})
							}
 						})
 					}
 				}else{
 					sys.log(err.red);
 					callback(err,id);
 				}
 			});
 		}
 }
