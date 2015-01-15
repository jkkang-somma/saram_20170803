var express = require('express');
var _ = require("underscore"); 
var debug = require('debug')('code');
var router = express.Router();
var DepartmentCode = require('../service/DepartmentCode.js');

router.route('/')
.get(function(req, res) {
    var departmentCode = new DepartmentCode();
    departmentCode.getDepartmentCodeList().then(function(result){
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
