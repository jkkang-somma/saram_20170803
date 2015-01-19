var express = require('express');
var _ = require('underscore');
var debug = require('debug')('commuteRouter');
var router = express.Router();
var Commute = require('../service/Commute.js');
var Promise = require('bluebird');
//var vacation = new Vacation();

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
	var count = 0;
	var data = req.body;
	var resultArr = [];
	
	for(var key in data){
		// debug(data[key].date +","+data[key].name+","+data[key].work_type);
        resultArr.push(Commute.insertCommute(data[key]));
        count++;
    }
    Promise.all(resultArr).then(function(){
    	debug("Add CommuteResult Count : " + count);
    	res.send({msg : "Add CommuteResult Count : " + count, count: count});		
    });
});


router.route('/:id')
.get(function(req, res){	
	console.log(111);
}).post(function(req, res){

}).put(function(req, res){
	console.log(req.body);
	Commute.updateCommute(req.body, function(result) {
		return res.send(result);
	});
});


module.exports = router;
