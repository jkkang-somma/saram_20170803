var express = require('express');
var debug = require('debug')('restful');
var router = express.Router();
var RestfulService = require('../service/RestfulService.js');
var CompanyAccess = require("../service/CompanyAccess.js");
var User = require('../service/User.js');

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

router.route('/companyAccess')
.post(function(req, res, next){
	debug("================================================= CompanyAccess : ");
	RestfulService.validateUser(req.headers).then(function(result) {
    
    if (result.isSuccess !== true) {
      return res.send(result);
    }

    // 사용자 정보 조회
    var user = new User({"id":req.headers.userid});
    user.getUser().then(function(userInfo) {
      var inData = CompanyAccess.makeData(req);

      CompanyAccess.setAccess(inData, userInfo[0]).then(function(result) {
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
        
    // return res.send(result);
	}).catch(function(err) {
		next(err);
	});
});

module.exports = router;