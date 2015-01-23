// Author: sanghee park <novles@naver.com>
// Create Date: 2014.12.18
// 사용자 Service
var _ = require("underscore"); 
var debug = require('debug')('Comment');
var Schemas = require("../schemas.js");
var Promise = require('bluebird');
var CommentDao = require('../dao/commentDao.js');
var CommuteDao = require('../dao/commuteDao.js');

var Comment = function() {	

	var _getComment = function(data) {
		return CommentDao.selectComment(data);
	};
	
	var _getCommentById = function(data) {
		return CommentDao.selectCommentById(data);
	};
	
	var _getCommentByPk = function(data) {
		return CommentDao.selectCommentByPk(data);
	};	

	var _insertComment = function(inData) {
		return new Promise(function(resolve, reject){// promise patten			
			CommuteDao.updateCommuteCommentCount(inData).then(function(result) {
				// comment 등록
				CommentDao.insertComment(inData).then(function(result) {
					resolve(result);
	    		}).catch(function(e){//Connection Error
	                reject(e);
	             });
    		}).catch(function(e){//Connection Error
                reject(e);
             });
		});
	}
	
	var _updateCommentReply = function(inData) {
		console.log(inData);
		return new Promise(function(resolve, reject){// promise patten
			CommentDao.updateCommentReply(inData).then(function(result) {
				CommentDao.selectCommentByPk(inData).then(function(result) {
					resolve(result);
	    		}).catch(function(e){//Connection Error
	                reject(e);
	             });
			}).catch(function(e){//Connection Error
	            reject(e);
	         });		
		});

	}
	
	return {
		getComment : _getComment,
		getCommentById : _getCommentById,
		getCommentByPk : _getCommentByPk,
		insertComment : _insertComment,
		updateCommentReply : _updateCommentReply
	}
} 

module.exports = new Comment();