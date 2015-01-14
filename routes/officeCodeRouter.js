// Author: sanghee park <novles@naver.com>
// Create Date: 2014.1.12

var express = require('express');
var _ = require("underscore"); 
var debug = require('debug')('code');
var router = express.Router();
var OfficeCode = require('../service/OfficeCode.js');

router.route('/')
.get(function(req, res) {
    var officeCode = new OfficeCode();
    var result = officeCode.getOfficeCodeList().then(function(result){
            debug("Complete Select OfficeCode List.");
            res.send(result);    
        }).catch(function(e){
            debug("Error Select OfficeCode List.");
            res.status(500);
            res.send({
                success:false,
                message: e.message,
                error:e
            });
        });
});

module.exports = router;
