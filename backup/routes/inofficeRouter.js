// Author: sanghee park <novles@naver.com>
// Create Date: 2014.1.12
var express = require('express');
var debug = require('debug')('InOfficeRouter');
var Promise = require('bluebird');
var router = express.Router();
var InOffice = require('../service/InOffice.js');

router.route('/')
.get(function(req, res) {
    // var inOffice = new InOffice();
    InOffice.getInOfficeList().then(function(result){
       res.send(result); 
    });
    
})

router.route('/bulk')
.put(function(req, res){
    InOffice.remove(req.body).then(function(){
        debug("Complete Delete User.");
        res.send({success:true, message:"Complete Delete User."});
    }).catch(function(e){
        debug("Error Delete User.");
        debug(e);
        res.status(500);
        res.send({
            success:false,
            message: e.message,
            error:e
        });
    });
});;

module.exports = router;
