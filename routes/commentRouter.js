var express = require('express');
var debug = require('debug')('commentRouter');
var router = express.Router();
var Comment = require('../service/Comment.js');
var sessionManager = require('../lib/sessionManager');

router.route('/')
.get(function(req, res, next){
	
	var query = req.query;
	if (query["id"] != undefined && query["id"] != "") {
		Comment.getCommentById(query).then(function(result) {
			return res.send(result);
		}).catch(function(err) {
			next(err);
		});
		
	} else {
		var adminString=sessionManager.getAdminString(req.cookies.saram);
		Comment.getComment(query, adminString).then(function(result) {
			return res.send(result);
		}).catch(function(err) {
			next(err);
		});
		
	}
}).post(function(req, res, next) {
	
	var session = sessionManager.get(req.cookies.saram);
	var data = req.body;
	data.writer_id = session.user.id;	// 코멘트 작성자 ID
	debug("INSERT COMMENT")
	debug(JSON.stringify(data))
	Comment.insertComment(data).then(function(result) {
		res.send(result);
		Comment.sendCommentEmail(data).then(function(){
            debug("Send Email"); 
        }).catch(function(e){
            debug("Fail to Send Email");
        });
	}).catch(function(err) {
		next(err);
	});
});


router.route('/:id')
.get(function(req, res){	
	
}).put(function(req, res, next){
	
	var session = sessionManager.get(req.cookies.saram);
	var data = req.body;
	data.reply_id = session.user.id;	// 코멘트 작성자 ID	
	
	Comment.updateCommentReply(data).then(function(result) {
		res.send(result);
		Comment.sendCommentEmail(data).then(function(){
            debug("Send Email"); 
        }).catch(function(e){
            debug("Fail to Send Email");
        });
	}).catch(function(err) {
		next(err);
	});

});

module.exports = router;
