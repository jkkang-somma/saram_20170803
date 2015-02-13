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
	console.log(req);
	var inData = {
			type : req.body.type,
			ip_pc : '',
			ip_office : req.get("x-forwarded-for")
	};
	
	CompanyAccess.setAccess(inData, user).then(function(result) {
		return res.send(result);
	}).catch(function(err) {
		next(err);
	});
});

module.exports = router;
