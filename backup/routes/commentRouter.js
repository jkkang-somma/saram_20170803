var express = require('express');
var debug = require('debug')('commentRouter');
var router = express.Router();
var Comment = require('../service/Comment.js');
var sessionManager = require('../lib/sessionManager');

router.route('/')
.get(function(req, res){
	
	var query = req.query;
	if (query["id"] != undefined && query["id"] != "") {
		Comment.getCommentById(query).then(function(result) {
			return res.send(result);
		}).catch(function(err) {
			next(err);
		});
		
	} else {
		Comment.getComment(query).then(function(result) {
			return res.send(result);
		}).catch(function(err) {
			next(err);
		});
		
	}
}).post(function(req, res) {
	
	var session = sessionManager.get(req.cookies.saram);
	var data = req.body;
	data.writer_id = session.user.id;	// 코멘트 작성자 ID
	
	Comment.insertComment(data).then(function(result) {
		return res.send(result);
	}).catch(function(err) {
		next(err);
	});
});


router.route('/:id')
.get(function(req, res){	
	
}).put(function(req, res){
	
	var session = sessionManager.get(req.cookies.saram);
	var data = req.body;
	data.reply_id = session.user.id;	// 코멘트 작성자 ID	
	
	if (session.user.admin == 1) {
		Comment.updateCommentReply(data).then(function(result) {
			return res.send(result);
		}).catch(function(err) {
			next(err);
		});
		
	} else {
		return res.send({"error": "관리자 등급만  가능합니다."});
	}

});

module.exports = router;
