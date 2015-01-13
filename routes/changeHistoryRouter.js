var express = require('express');
var debug = require('debug')('changeHistoryRouter');
var router = express.Router();
var ChangeHistory = require('../service/ChangeHistory.js');

router.route('/')
.get(function(req, res){	
	ChangeHistory.getChangeHistory(req.query, function(result) {
		return res.send(result);
	});

}).post(function(req, res){
//	var data = {};
//	if (req.body.data === undefined) {
//		data = req.body;
//	} else {
//		data = req.body.data;
//	}
//	
//	Vacation.setVacation(data, function(result) {
//		return res.send(result);
//	});
});



module.exports = router;
