var express = require('express');
var _ = require('underscore');
var debug = require('debug')('commuteRouter');
var router = express.Router();
var Commute = require('../service/Commute.js');
var Promise = require('bluebird');
var sessionManager = require('../lib/sessionManager');

router.route('/')
.get(function(req, res){
	debug(req.query);
	if(_.isUndefined(req.query.date)){
		if(!_.isUndefined(req.query.id)){
			Commute.getCommuteByID(req.query).then(function(result){
				return res.send(result);
			});
		}else{
			Commute.getCommute(req.query, function(result) {
				return res.send(result);
			});
		}
	}else{
		Commute.getCommuteDate(req.query.date).then(function(result){
			return res.send(result);	
		});
	}
})

router.route('/bulk')
.post(function(req, res){
	var data = req.body.data;
	var session = sessionManager.get(req.cookies.saram);
	if (session.user.admin == 1) {	// admin 일 경우만 생성
	    Commute.insertCommute(data).then(function(result){
	    	res.send({
	            success:true,
	            message: "Add CommuteResult Success! ("+ result +")"
	        });
	    }, function(errResult){
	    	res.status(500);
        	res.send({
	            success:false,
	            message: errResult.message,
	            error:errResult
	        });
	    });
	} else {
		res.status(401);
    	res.send({
            success:false,
            message: "관리자 등급만 생성이 가능합니다.",
        });
	}
}).put(function(req, res){
	var data = req.body;
	var session = sessionManager.get(req.cookies.saram);
	if (session.user.admin == 1) {	// admin 일 경우만 생성
		Commute.updateCommute(data).then(function(result){
			Promise.all(result.promiseArr).then(function(){
				_.each(result.connectionArr, function(connection){
					connection.commit(function(err){
		                if(err){
		                    debug("DB Transaction Commit Error! : " + err.message);
							res.status(500);
							res.send({
								success:false,
								message: err.message,
								error: err
							});
		                }
		                else{
		                    debug("DB Transaction Commit Success! : ");
		                    res.send({
			            		success:true,
			            		message: "Add CommuteResult Success! ("+ result +")"
			        		});
		                }
		                connection.release();
	            	});	
				});
			}, function(err){
				debug("DB Transaction Commit Error! : " + err.message);
				_.each(result.connectionArr, function(connection){
	                connection.rollback(function(){
	                	connection.release();
						res.status(500);
						res.send({
							success:false,
							message: err.message,
							error: err
						});
	                    
	                });
				});
			})
		});

	}else{
		res.status(401);
    	res.send({
            success:false,
            message: "관리자 등급만 생성이 가능합니다.",
        });
	}
});

// router.route('/bulk')
// .post(function(req, res){
// 	var data = req.body.data;
// 	var session = sessionManager.get(req.cookies.saram);
// 	if (session.user.admin == 1) {	// admin 일 경우만 생성
// 	    Commute.insertCommute(data).then(function(result){
// 	    	res.send({
// 	            success:true,
// 	            message: "Add CommuteResult Success! ("+ result +")"
// 	        });
// 	    }, function(errResult){
// 	    	res.status(500);
//         	res.send({
// 	            success:false,
// 	            message: errResult.message,
// 	            error:errResult
// 	        });
// 	    });
// 	} else {
// 		res.status(401);
//     	res.send({
//             success:false,
//             message: "관리자 등급만 생성이 가능합니다.",
//         });
// 	}
// }).put(function(req, res){
// 	var data = req.body;
// 	var session = sessionManager.get(req.cookies.saram);
// 	if (session.user.admin == 1) {	// admin 일 경우만 생성
// 		Commute.updateCommute(data).then(function(result){
// 			res.send({
// 				success:true,
// 				message: "Update CommuteResult Success! (" + result + ")"
// 			})	
// 		}, function(errResult){
// 	    	res.status(500);
//         	res.send({
// 	            success:false,
// 	            message: errResult.message,
// 	            error:errResult
// 	        });
// 		});
// 	}else{
// 		res.status(401);
//     	res.send({
//             success:false,
//             message: "관리자 등급만 생성이 가능합니다.",
//         });
// 	}
// });

router.route('/lastiestdate')
.get(function(req,res){
	Commute.getLastiestDate().then(function(result){
		res.send(result);
	})
});

router.route('/:id')
.get(function(req, res){
}).post(function(req, res){

}).put(function(req, res){
	Commute.updateChangeHistory(req.body, function(result) {
		return res.send(result);
	});
});

//Dashboard 
router.route('/result/:id')
.get(function(req, res){
	
	
	
	res.send({});
});

module.exports = router;
