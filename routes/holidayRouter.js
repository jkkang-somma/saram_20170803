var express = require('express');
var debug = require('debug')('holidayRouter');
var router = express.Router();
var Holiday = require('../service/Holiday.js');


router.route('/')
.get(function(req, res){
    // Get user infomation list (GET)
    var holiday = new Holiday(req.query);
    var result = holiday.getHolidayList().then(function(result){
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


module.exports = router;
