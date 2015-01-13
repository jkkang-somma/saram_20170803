var express = require('express');
var debug = require('debug')('holidayRouter');
var router = express.Router();
var Holiday = require('../service/Holiday.js');


router.route('/')
.get(function(req, res){
    // Get user infomation list (GET)
    var date = new Date();
    var holiday = new Holiday({year:date.getFullYear()});
    
    console.log(req.body);
    holiday.getHolidayList().then(function(result){
        debug(result);
        res.send(result);    
    }) ;
    
    
}).post(function(req, res){
    // Insert user infomation (PUT)
    debug(req.body);
     
    var holiday = new Holiday(req.body);
    debug(req.body);
    holiday.insertHoliday();
    
    res.send({msg : "Insert Data Success", count : 1});

});

router.route('/bulk')
.post(function(req,res){
    var count = 0;
    for(var key in req.body){
        var holiday = new Holiday(req.body[key]);
        debug(req.body[key]);
        holiday.insertHoliday();
        count ++;
    }
    res.send({msg : "Insert Data Success", count : count});
})

module.exports = router;
