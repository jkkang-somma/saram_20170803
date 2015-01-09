var express = require('express');
var debug = require('debug')('holidayRouter');
var router = express.Router();
var Holiday = require('../service/Holiday.js');


router.route('/')
.get(function(req, res){
    // Get user infomation list (GET)
    
    var holiday = new Holiday({year : "2014"});
    
    holiday.getHolidayList().then(function(result){
        debug(result);
        res.send(result);    
    }) ;
    
    
}).post(function(req, res){
    // Insert user infomation (PUT)
    debug(req.body);
    // userService.insertUser(function(result){
    //     res.send(result);
    // }, req);
    
});

router.route('/bulk')
.post(function(req,res){
    var count = 0;
    for(var key in req.body.data){
        var holiday = new Holiday(req.body.data[key]);
        debug(req.body.data[key]);
        holiday.insertHoliday();
        count ++;
    }
    res.send({msg : "Insert Data Success", count : count});
})

module.exports = router;
