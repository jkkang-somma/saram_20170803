var express = require('express');
var debug = require('debug')('restful');
var router = express.Router();
var RestfulService = require('../service/RestfulService.js');
var _ = require("underscore");

router.route('/userlist')
.get(function(req, res, next){
	debug("================================================= select user list : ");
	RestfulService.getUserListNow(req.query).then(function(result) {
		return res.send(result);
	}).catch(function(err) {
		next(err);
	});
});

router.route('/login')
.get(function(req, res, next){
	debug("================================================= login : ");
	RestfulService.validateUser(req.headers).then(function(result) {
		return res.send(result);
	}).catch(function(err) {
		next(err);
	});
});

module.exports = router;