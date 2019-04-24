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

	var bodyDecode = {}
	try {
		var b = new Buffer(req.body.p, 'base64')
		var s = b.toString()
		bodyDecode = JSON.parse(s);
		debug('companyAccessRouter in...')
		console.info(req.body)
		console.info(bodyDecode)
	} catch (e) {
		debug('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ 출/퇴근 에러 - 시작 $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$')
		debug('Exception')
		console.info(e)
		console.info(req)
		debug('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ 출/퇴근 에러 - 끝   $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$')
	}
	
	if (bodyDecode.t === 'A') {
		bodyDecode.type = '출근(온라인)'
	} else if (bodyDecode.t === 'B') {
		bodyDecode.type = '퇴근(온라인)'
	} else {
		debug('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ 출/퇴근 에러 - 시작 $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$')
		console.info(req.body)
		console.info(bodyDecode)
		debug('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ 출/퇴근 에러 - 끝   $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$')
	}
	var inData = {
		type : bodyDecode.type,
		ip_pc : _.isEmpty(bodyDecode.k)?null:bodyDecode.k,
		mac : _.isEmpty(bodyDecode.mac)?null:bodyDecode.mac,
		ip_office : ip, 
		param : bodyDecode.p
	};
	
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
