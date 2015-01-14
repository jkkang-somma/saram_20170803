// Author: sanghee park <novles@naver.com>
// Create Date: 2014.1.12

var express = require('express');
var debug = require('debug')('OutOfficeRouter');
var router = express.Router();
var OutOffice = require('../service/OutOffice.js');

router.route('/')
.get(function(req, res) {
    //var start = req.query.start;
    //var end = req.query.end;
    var outOffice = new OutOffice();
    outOffice.getOutOfficeList().then(function(result){
       res.send(result); 
    });
    
});

module.exports = router;
