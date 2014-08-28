var express = require('express');
var sys = require("sys");
var colors=require("colors");

var app=module.exports=express();
app.use(function(req,resp,next){
	 var origin = (req.headers.origin || "*");  
  
    console.log('origin:' + origin);  
  
    resp.header('Access-Control-Allow-Credentials', true);  
    resp.header('Access-Control-Allow-Origin', origin);  
    resp.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');  
    resp.header('Access-Control-Allow-Headers', 'Set-Cookie, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');  

	sys.log(req.url.green);
	next();
});

require("./api/api.js")(app);
if(!module.parent){
	app.listen(1024);
	sys.log('daifanle service started on port 1024');
}

