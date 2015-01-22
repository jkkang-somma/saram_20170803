var express = require('express');
var debug = require('debug')('rawDataRouter');
var Promise = require('bluebird');
var router = express.Router();
var CompanyAccess = require("../service/CompanyAccess.js");
var sessionManager = require('../lib/sessionManager');
var mac = require('getmac');

router.route("/")
.post(function(req, res){
	var session = sessionManager.get(req.cookies.saram);
	var user = session.user;

	var inData = {
			id : user.id,
			name : user.name,
			department : user.dept_name,
			ip_addr_1 : user.ip_addr_1,
			mac_addr_1 : user.mac_addr_1,
			ip_addr_2 : user.ip_addr_2,
			mac_addr_2 : user.mac_addr_2,
			type : req.body.type,
			ip_address : req.ip,
			mac_address : ''
	};
	
	mac.getMac(function(err, macAddress) {
		if (err) throw err;
		console.log(macAddress);
	});
	
	CompanyAccess.setAccess(inData);
});

module.exports = router;