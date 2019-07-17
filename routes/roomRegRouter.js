var express = require('express');
var debug = require('debug')('roomRouter');
var router = express.Router();
var RoomReg = require('../service/RoomReg.js');
var sessionManager = require('../lib/sessionManager');
var _ = require("underscore");

router.route('/')
.get(function(req, res, next){
  debug("================================================= selectRoomRegList : " + JSON.stringify(req.query));
	RoomReg.selectRoomRegList(req.query).then(function(result) {
		return res.send(result);
	}).catch(function(err) {
		next(err);
	});
});

router.route('/:id')
.put(function(req, res, next){
	var session = sessionManager.get(req.cookies.saram);
	// Check ID
	
	var roomReg = req.body;
	debug("roomReg 0 : " + JSON.stringify(roomReg));
	if ( roomReg.index == -1 ) {
		RoomReg.checkRoomReg(roomReg).then(function(result) {
			debug("roomReg 1-1 ");
			if ( result.length != 0 ) {
				_.extend(roomReg, {ERR_CODE : "ALREADY_EXIST_METTING"});
				debug("ROOM DUP 2 : " + JSON.stringify(result));
				return res.send(roomReg);
			}
			debug("Start Insert Metting");
			RoomReg.insertRoomReg(roomReg).then(function(result) {
				return res.send(result);
			}).catch(function(err) {
				next(err);
			});
		});
	}else{
		debug("roomReg 2 ");
		RoomReg.checkRoomReg(roomReg).then(function(result) {
			debug("roomReg 2-1 ");
			if ( result.length == 0 || ( result.length == 1 && result[0].index == roomReg.index )) {
				debug("Start Update Metting");
				RoomReg.updateRoomReg(roomReg).then(function(result) {
					return res.send(result);
				}).catch(function(err) {
					next(err);
				});	
			}else{
				_.extend(roomReg, {ERR_CODE : "ALREADY_EXIST_METTING"});
				debug("ROOM DUP 3 : " + JSON.stringify(result));
				return res.send(roomReg);	
			}
		});
	}
}).delete(function(req, res, next){
	var session = sessionManager.get(req.cookies.saram);
	// Check ID

	var _id=req.param("id");
	debug("DELETE ROOM_REG 2: " + _id);

	RoomReg.deleteRoomReg(_id).then(function(result) {
		return res.send(result);
	}).catch(function(err) {
		next(err);
	});
	
});

module.exports = router;