var _ = require("underscore"); 
var Promise = require('bluebird');
var debug = require('debug')('RestfulService');
var LunarCalendar = require("lunar-calendar");
//var userDao= require('../dao/userDao.js');
var User = require('../service/User.js');

var RestfulService = function () {
    
    var _getUserListNow = function () {
        var user = new User();
        return user.getUserListNow();
    };
    
    var _validateUser = function (headers) {
    	var response = {};
    	response["isSuccess"]=false;
    	response["reason"]="unknown";
    	debug("ID : " + JSON.stringify(headers.user_id));
    	var user = new User({"id":headers.user_id,"password":headers.password});
    	return new Promise(function(resolve, reject){// promise patten
    		user.getUser().then(function(result){
	            if (result.length == 0){
	                debug("find user zero.");
	                response["reason"]="INVALID_LOGIN";
	            } else {
	                var resultUser= new User(result[0]);
	                debug(resultUser.get("password"));
	                if (_.isEmpty(resultUser.get("password"))||_.isNull(resultUser.get("password"))){ //password 초기화 안된경우 
	                    debug("not init password");
	                    response["reason"]="NOT_INIT_PASSWORD";
	                } else {
	                    if (user.get("password")==resultUser.get("password")){
	                    	debug("login success");
	                    	response["isSuccess"]=true;
	                    } else {
	                        debug("not equle password.");
	                        response["reason"]="INVALID_LOGIN";
	                    }
	                }
	            }
	        	resolve(response);
	        });
    	});
    };

    return {
        getUserListNow : _getUserListNow,
        validateUser : _validateUser
    };
};

module.exports = new RestfulService();
