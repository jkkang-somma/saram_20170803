var express = require('express');
var router = express.Router();
var Usage = require('../service/OfficeItemUsage.js');
var sessionManager = require('../lib/sessionManager');

router.route('/usage')
    .get(function(req, res){
        var adminString=sessionManager.getAdminString(req.cookies.saram);
        Usage.getUsageList(req.query, adminString).then(function(result){
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
