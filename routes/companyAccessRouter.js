var express = require('express');
var _ = require('underscore');
var debug = require('debug')('rawDataRouter');
var Promise = require('bluebird');
var router = express.Router();
var sessionManager = require('../lib/sessionManager');
var CompanyAccess = require("../service/CompanyAccess.js");

router.route("/")
.post(function(req,res,next){
	console.log(req);
	var session = sessionManager.get(req.cookies.saram);
	var user = session.user;

	var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	console.log("#############");
	console.log(req.headers['x-forwarded-for']);
	console.log(req.connection.remoteAddress);

	var inData = {
		type : req.body.type,
		ip_pc : _.isEmpty(req.body.ip)?null:req.body.ip,
		mac : _.isEmpty(req.body.mac)?null:req.body.mac,
		ip_office : req.ip
	};
	
	CompanyAccess.setAccess(inData, user).then(function(result) {
		return res.send(result);
	}).catch(function(err) {
		next(err);
	});
});

module.exports = router;
