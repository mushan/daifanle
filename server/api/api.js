var formidable = require('formidable');
var colors = require('colors');
var sys = require('sys');
var out = require('./../out.js');

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

var service = {
	get : {
		status_list : function(req, resp) {
			out.json(resp, 200, {
				err : null,
				data : [ {
					id : "1",
					name : "a",
					gender : "1"
				}, {
					id : "2",
					name : "b",
					gender : "0"
				}, {
					id : "3",
					name : "c",
					gender : "1"
				}, {
					id : "4",
					name : "d",
					gender : "0"
				} ]
			});
		},
	}
}

module.exports = function(app) {
	for ( var method in service) {
		for ( var func in service[method]) {
			app[method]("/api/" + func, service[method][func]);
		}
	}
}
