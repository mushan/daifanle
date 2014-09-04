var formidable = require('formidable');
var colors = require('colors');
var sys = require('sys');
var settings = require('../settings').settings;
var out = require('../out');
var async = require('async');
var objectid = require('mongodb').ObjectID;
var fs = require('fs');
var dfs = require('./../lib/dfs').nipsfile;

var user = require('./../bl/user').user;
var status = require('./../bl/status').status;
var food = require('./../bl/food').food;

var __parse_form_ = function(req, resp, func) {
	var self = this;
	var form = new formidable.IncomingForm();
	form.keepExtensions = true;
	form.on('progress', function(bytesReceived, bytesExpected) {
		// nothing todo
	});
	form.on('end', function() {
		// nothing todo
	});
	form.parse(req, function(err, fileds, files) {
		if (err !== null) {
			out.json(resp, 500, {
				err : err
			});
			return;
		} else {
			func(fileds, files);
		}
	});
};


var host="http://42.62.52.155:3000"
	
// 动态类型
var status_type = {
    Invite : 1,// 邀请
	Ask : 2,// 请求
	Team : 3,// 拼饭

};


// 验证输入参数
var validate = function(ctx) {
	if (ctx === null || ctx === undefined || ctx === "") {
		this.no_avail = true;
	} else {
		this.no_avail = false;
	}
};

// 生成guid
var guid = function() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	});
}

var service = {
	post : {

		// upload图片(test)
		upload : function(req, resp) {
			__parse_form_(req, resp, function(fields, files) {
				console.log(files)
				fs.readFile(files.pic.path, function(err, re) {
					console.log(re);
					dfs.write("", re, function(err, re) {
						console.log(re);
					}, "aa");
				});
			});
		},

		// 注册
		register : function(req, resp) {
			__parse_form_(req, resp, function(fields, files) {
				var validate_name = new validate(fields.name);
				var validate_pwd = new validate(fields.pwd);
				if (validate_name.no_avail || validate_pwd.no_avail) {
					out.json(resp, 200, {
						"err" : "用户名或密码格式有误",
					});
				} else {
					user.find_with_usr({
						"name" : fields.name
					}, function(err, user_exist) {
						if (err !== null) {
							console.log("err happens while register: " +err);
							out.json(resp, 200, {
								"err" : err
							});
						} else {
							if (user_exist === null) {
								user.add(fields, function(err, result) {
									if (err !== null) {
										console.log("err happens while register: " + err);
										out.json(resp, 200, {
											"err" : err
										});
									} else {
										out.json(resp, 200, {
											"err" : null,
											"result" : "注册成功！"
										});
									}
								});
							} else {
								out.json(resp, 200, {
									"err" : "该用户已经存在！"
								});
							}
						}
					});
				}
			});
		},

		// 登录
		login : function(req, resp) {
			__parse_form_(req, resp, function(fields, files) {
				var validate_name = new validate(fields.name);
				var validate_pwd = new validate(fields.pwd);
				if (validate_name.no_avail || validate_pwd.no_avail) {
					out.json(resp, 200, {
						"err" : "用户名或密码格式有误",
					});
				} else {
					user.find_with_usr(fields, function(err, user_exist) {
						if (err !== null) {
							// console.log("err happens while login: " + err);
							out.json(resp, 200, {
								"err" : err
							});
						} else {
							if (user_exist === null) {
								out.json(resp, 200, {
									"err" : "用户名或密码不正确"
								});
							} else {
								out.json(resp, 200, {
									"err" : null,
									"result" : "登录成功"
								});
							}
						}
					});
				}
			});
		},

		// 动态列表
		status_list : function(req, resp) {
			__parse_form_(req, resp, function(fields, files) {
				var attr = undefined;
				if (fields.status_id === null || fields.status_id === undefined
						|| fields.status_id === "") {
					attr = {};
				} else {
					try {
						attr = {
							"_id" : new objectid(fields.status_id)
						}
					} catch (e) {
					   // console.log("err happens while status_list: " + err);
						attr = {
							"_id" : fields.status_id
						}
					}
				}
				status.get(attr, function(err, result) {
					if (err !== null) {
						// console.log("err happens while status_list: " + err);
						out.json(resp, 200, {
							"err" : err
						});
					} else {
						//根据评论时间排序
						for(var i=0;i<result.length;i++){
							result[i].comments=result[i].comments.sort(function(a,b){
								return b.createtime-a.createtime;
							});			
						}
						out.json(resp, 200, {
							"err" : null,
							"result" : result
						});
					}
				});
			});

		},

		// 发布动态
		release_status : function(req, resp) {
			__parse_form_(
					req,
					resp,
					function(fields, files) {
						var validate_name = new validate(fields.name);
						var validate_foodname = new validate(fields.foodname);
						var validate_limit = new validate(fields.limit);
						var validate_date = new validate(fields.date);
						var validate_type = new validate(fields.type);
						if (validate_name.no_avail
								|| validate_foodname.no_avail
								|| validate_limit.no_avail
								|| validate_date.no_avail
								|| validate_type.no_avail) {
							out.json(resp, 200, {
								"err" : "参数格式有误",
							});
						} else {
							var newstatus = {
									name : fields.name,
									foodname : fields.foodname,
									dsc : (fields.dsc === undefined || fields.dsc === null) ? ""
											: fields.dsc,
									limit : fields.limit,
									date : fields.date,
									type : fields.type,
									comment_total:0,
									assist_total:0,
									follow_total:0,
									comments:[],
									assists:[],
									follows:[]										
								// state : true,// 是否open
								};
							if(fields.pic===null||fields.pic===undefined||fields.pic===""){
								// 上传图片
								var name="status"+guid();
								fs.readFile(files.pic.path, function(err, buffer) {							
									if(err!==null && err!==undefined && err!==""){
										 console.log("err happens while release_status and readfile: " + err);
											out.json(resp, 200, {
												"err" : err,
											});
									}else{									
										dfs.write("", buffer, function(err, oid) {
											if(err!==null && err!==undefined && err!==""){
												 console.log("err happens while release_status and write: " + err);
													out.json(resp, 200, {
														"err" : err,
													});
											}else{
											    newstatus.pic=host+"/api/img?imgid="+oid;
												status.add(newstatus, function(err, result) {
													if (err!==null && err!==undefined && err!=="") {
														 console.log("err happens while release_status: " + err);
														out.json(resp, 200, {
															"err" : err,
														});
													} else {
														out.json(resp, 200, {
															"err" : null,
															"result" : "发布成功"
														});
													}

												});
											}								
								    	}, name);
								    }								
								});
							}else{
								    // 从菜谱发布
								    newstatus.pic=fields.pic;
									status.add(newstatus, function(err, result) {
										if (err !== null) {
											 console.log("err happens while release_status: " + err);
											out.json(resp, 200, {
												"err" : err,
											});
										} else {
											out.json(resp, 200, {
												"err" : null,
												"result" : "发布成功"
											});
										}
									});
							}
						}
					});
		},

		// 接受邀请/请求/拼菜
		follow : function(req, resp) {
			__parse_form_(req, resp, function(fields, files) {
				var validate_status_id = new validate(fields.status_id);
				var validate_name = new validate(fields.name);
				var validate_foodname = new validate(fields.foodname);
				if (validate_status_id.no_avail || validate_name.no_avail) {
					out.json(resp, 200, {
						"err" : "参数格式有误",
					});
				} else {
					var attr=undefined;
					if (validate_foodname.no_avail) {
						// 应聘、蹭饭
					     attr = {
							status_id : fields.status_id,
							follow : {
								name : fields.name,
								createtime : Date.now()
							}
						}					

					} else {
						// 拼菜
						attr={
								status_id : fields.status_id,
								follow : {
									name : fields.name,
									foodname: fields.foodname ,
									createtime : Date.now()
								}
							}
//						fs.readFile(files.pic.path, function(err, buffer) {
//							dfs.write("", buffer, function(err, oid) {
//								var attr = {
//										status_id : fields.status_id,
//										follow : {
//											name : fields.name,
//											foodname : fields.foodname,
//											dsc : fields.dsc===undefined||fields.dsc===null?"":fields.dsc,
//											pic : host+"/api/img?imgid="+oid,
//											createtime : Date.now()
//										}
//									}
//								status.follow(attr, function(err, result) {
//									if (err !== null && err!==undefined && err!=="") {
//										 console.log("err happens while  follow: " + err);
//										out.json(resp, 200, {
//											"err" : err,
//										});
//									} else {
//										out.json(resp, 200, {
//											"err" : null,
//											"result" : "接受邀请成功"
//										});
//									}
//
//								});
//							}, name);
//						});
						
					}
					status.follow(attr, function(err, result) {
						if (err !== null && err!==undefined && err!=="" ) {
							 console.log("err happens while follow: " + err);
							out.json(resp, 200, {
								"err" : err,
							});
						} else {
							out.json(resp, 200, {
								"err" : null,
								"result" : "接受邀请成功"
							});
						}

					});
					
				}

			});

		},

		// 发表评论(回复)
		comment : function(req, resp) {
			__parse_form_(req, resp, function(fields, files) {
				var validate_status_id = new validate(fields.status_id);
				var validate_name = new validate(fields.name);
				var validate_text = new validate(fields.text);
				if (validate_status_id.no_avail || validate_name.no_avail
						|| validate_text.no_avail) {
					out.json(resp, 200, {
						"err" : "参数格式有误",
					});
				} else {
					var attr = undefined;
					if (fields.comment_id === null
							|| fields.comment_id === undefined
							|| fields.comment_id === "") {
						// 评论
						attr = {
							status_id : fields.status_id,
							comment : {
								comment_id : guid(),
								name : fields.name,
								text : fields.text,
								createtime : Date.now()
							}
						}

					} else {
						// 回复评论
						attr = {
							status_id : fields.status_id,
							comment : {
								comment_id : guid(),
								parent_id : fields.comment_id,
								reply_name:fields.reply_name,
								name : fields.name,
								text : fields.text,
								createtime : Date.now()
							}
						}
					}
					status.comment(attr, function(err, result) {
						if (err !== null && err!==undefined && err!=="") {
							 console.log("err happens while comment: " + err);
							out.json(resp, 200, {
								"err" : err,
							});
						} else {
							out.json(resp, 200, {
								"err" : null,
								"result" : "评论成功"
							});
						}
					});

				}

			});
		},

		// 点赞(取消赞)
		assist : function(req, resp) {
			__parse_form_(req, resp, function(fields, files) {
				var validate_status_id = new validate(fields.status_id);
				var validate_name = new validate(fields.name);
				var validate_num = new validate(fields.num);
				if (validate_status_id.no_avail || validate_name.no_avail
						|| validate_num.no_avail) {
					out.json(resp, 200, {
						"err" : "参数格式有误",
					});
				} else {
					status.assist(fields, function(err, result) {
						if (err !== null && err!==undefined && err!=="") {
							 console.log("err happens while assist: " + err);
							out.json(resp, 200, {
								"err" : err,
							});
						} else {
							out.json(resp, 200, {
								"err" : null,
								"result" : "点赞(取消赞)成功"
							})
						}
					});
				}
			});
		},

		// 我是厨神(吃货) ____//// follow 没有查询
		history : function(req, resp) {
			__parse_form_(req, resp, function(fields, files) {
				var validate_name = new validate(fields.name);
				if (validate_name.no_avail) {
					out.json(resp, 200, {
						"err" : "参数格式有误",
					});
				} else {
					var result=[];
					status.get(fields, function(err, result1) {
						if (err !== null && err!==undefined && err!=="") {
							console.log("err happens while history: " + err);
							out.json(resp, 200, {
								"err" : err,
							});
						} else {
							status.get(
									{
									  "follows":
										  {
											$elemMatch:{
												name:fields.name
											 }
									      }
									},function(err,result2){
										if(err !== null && err!==undefined && err!==""){
											console.log("err happens while history: " + err);
											out.json(resp, 200, {
												"err" : err,
											});
										}else{
										     for(var i=0;i<result1.length;i++){
										    	 result.push(result1[i]);
										     }
										     for(var j=0;j<result2.length;j++){
										    	 var is_exist=false;
										    	 for(var m=0;m<result.length;m++){
										    		 if(result[m]===result2[j]){
										    			 is_exist=true;
										    			 break;
										    		 }
										    	 }
										    	 if(!is_exist){
										    		 result.push(result2[j]);
										    	 }
										     }
											 out.json(resp, 200, {
												"err" : null,
												"result" : result
								   			});							     
										}						
							       });
						}
					});

				}
			});
		},

		// 菜谱
		food_list : function(req, resp) {
			food.get({}, function(err, result) {
				if (err !== null) {
					 console.log("err happens while food_list: " + err);
					out.json(resp, 200, {
						"err" : err,
					});
				} else {
					out.json(resp, 200, {
						"err" : null,
						"result" : result
					});
				}
			});
		},
	},

	get : {
		// 图片接口
		img : function(req, resp) {
			var id = undefined;
			try {
				id = req.query.imgid;
			} catch (e) {
				id = "";
			}
			dfs.read(id, function(err, result) {
				if (err !== null && err!==undefined && err!=="") {
					console.log("err happens while img: " + err);
                    out.json(resp, 200, {
                       "err" : err,
                    });
//					dfs.read("54044d9a7a04716459c5795b",function(err,result2){
//						if(err!==null){
//							console.log("err happens while  img: " + err);
////							out.json(resp, 200, {
////								"err" : err,
////							});
//						}else{
//							out.image(resp,"image/png",result2);
//						}			
//					});
				} else {
						out.image(resp, "image/png", result);
					}
			});
		},
	}
};

// / hook
module.exports = function(app) {
	for ( var method in service) {
		for ( var func in service[method]) {
			app[method]("/api/" + func, service[method][func]);
		}
	}
};
