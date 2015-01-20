var express = require('express');
var debug = require('debug')('commentRouter');
var router = express.Router();
var Comment = require('../service/Comment.js');
var sessionManager = require('../lib/sessionManager');

router.route('/')
.get(function(req, res){	
	Comment.getComment(req.query, function(result) {
		return res.send(result);
	});
}).post(function(req, res) {
	
	var session = sessionManager.get(req.cookies.saram);
	var data = req.body;
	data.writer_id = session.user.id;	// 코멘트 작성자 ID
	
	Comment.insertComment(data, function(result) {
		return res.send(result);
	});	
});


router.route('/:id')
.get(function(req, res){	
	console.log(111);
}).put(function(req, res){
	
	var session = sessionManager.get(req.cookies.saram);
	var data = req.body;
	data.reply_id = session.user.id;	// 코멘트 작성자 ID	
	
	Comment.updateCommentReply(data, function(result) {
		return res.send(result);
	});
})

module.exports = router;
