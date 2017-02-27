var express = require('express');
var debug = require('debug')('roomRouter');
var router = express.Router();
var Room = require('../service/Room.js');

router.route('/')
.get(function(req, res, next){
	Room.getRoomList().then(function(result) {
		return res.send(result);
	}).catch(function(err) {
		next(err);
	});
	
});

module.exports = router;