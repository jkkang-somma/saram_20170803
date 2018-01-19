var express = require('express');
var router = express.Router();
var Usage = require('../service/OfficeItemUsage.js');

router.route('/usage')
    .get(function(req, res){
        Usage.getUsageList(req.query).then(function(result){
                res.send(result);
        });

    });

router.route('/detail')
    .get(function(req, res){
        Usage.getUsageDetailList(req.query).then(function(result){
            res.send(result);
        });

    });

module.exports = router;
