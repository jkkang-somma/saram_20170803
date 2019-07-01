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
	
	var inData = CompanyAccess.makeData(req);
	
	CompanyAccess.setAccess(inData, user).then(function(result) {
		delete result.data.param
		delete result.data.platform_type
		delete result.data.ip_pc
		delete result.data.ip_office
		delete result.data.mac
		delete result.data.type
		delete result.dbResult
		
		return res.send(result);
	}).catch(function(err) {
		next(err);
	});
});

module.exports = router;
