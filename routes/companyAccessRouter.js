var express = require('express');
var debug = require('debug')('rawDataRouter');
var Promise = require('bluebird');
var router = express.Router();
var sessionManager = require('../lib/sessionManager');
var CompanyAccess = require("../service/CompanyAccess.js");

router.route("/")
.post(function(req,res,next){
	var session = sessionManager.get(req.cookies.saram);
	var user = session.user;

	var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	console.log("req.ip : " + req.ip);
	console.log("req.ips : " + req.ips);
	console.log("req.headers : " + req.headers);
	console.log("req.headers['x-forwarded-for'] : " + req.headers['x-forwarded-for']);
	console.log("req.connection.remoteAddress : " + req.connection.remoteAddress);
	console.log("req.socket.remoteAddress : " + req.socket.remoteAddress);

	var inData = {
			type : req.body.type,
			ip_pc : '',
			ip_office : ip
	};
	
	CompanyAccess.setAccess(inData, user).then(function(result) {
		return res.send(result);
	}).catch(function(err) {
		next(err);
	});
});

module.exports = router;