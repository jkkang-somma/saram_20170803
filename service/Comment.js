// Author: sanghee park <novles@naver.com>
// Create Date: 2014.12.18
// 사용자 Service
var _ = require("underscore"); 
var debug = require('debug')('Comment');
var Schemas = require("../schemas.js");
var CommentDao = require('../dao/commentDao.js');
var CommuteDao = require('../dao/commuteDao.js');

var Comment = function() {	

	var _getComment = function(data, callback) {
		CommentDao.selectComment(data).then(function(result) {
			return callback(result);
		});
	};
	
	var _insertComment = function(inData, callback) {
		// comment count 업데이트 
		CommuteDao.updateCommuteCommentCount(inData).then(function(result) {
			
			// comment 등록
			CommentDao.insertComment(inData).then(function(result) {
				return callback(result);
			});
		});
	}
	
	var _updateCommentReply = function(inData, callback) {
		CommentDao.updateCommentReply(inData).then(function(result) {
			return callback(result);
		});
	}
	
	return {
		getComment : _getComment,
		insertComment : _insertComment,
		updateCommentReply : _updateCommentReply
	}
} 

module.exports = new Comment();