var express = require('express');
var debug = require('debug')('commentRouter');
var router = express.Router();
var Comment = require('../service/Comment.js');

router.route('/')
.get(function(req, res){	
	Comment.getComment(req.query, function(result) {
		return res.send(result);
	});
}).post(function(req, res) {
	Comment.insertComment(req.body, function(result) {
		return res.send(result);
	});	
});


router.route('/:id')
.get(function(req, res){	
	console.log(111);
}).put(function(req, res){
	Comment.updateCommentReply(req.body, function(result) {
		return res.send(result);
	});
})

module.exports = router;
