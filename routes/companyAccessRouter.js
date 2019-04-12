var express = require('express');
var _ = require('underscore');
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

	var ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g, key;
	ip = ip.match(ipRegex);

	var inData = {
		type : req.body.type,
		ip_pc : _.isEmpty(req.body.ip_pc)?null:req.body.ip_pc,
		mac : _.isEmpty(req.body.mac)?null:req.body.mac,
		ip_office : ip, 
		platform_type : req.body.platform_type
	};
	
	CompanyAccess.setAccess(inData, user).then(function(result) {
		return res.send(result);
	}).catch(function(err) {
		next(err);
	});
});

module.exports = router;
