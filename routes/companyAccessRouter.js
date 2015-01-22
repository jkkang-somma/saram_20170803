var express = require('express');
var debug = require('debug')('rawDataRouter');
var Promise = require('bluebird');
var router = express.Router();
var sessionManager = require('../lib/sessionManager');
var CompanyAccess = require("../service/CompanyAccess.js");

router.route("/")
.post(function(req, res){
	var session = sessionManager.get(req.cookies.saram);
	var user = session.user;
	
	var inData = {
			type : req.body.type,
			ip_address : req.ip,
			mac_address : ''
	};
	
	CompanyAccess.setAccess(inData, user).then(function(result) {
		return res.send(result);
	}).catch(function(e) {
		console.log("Error");
		console.log(e);
	});
});

module.exports = router;