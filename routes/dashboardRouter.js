// Author: sanghee park <novles@naver.com>
// Create Date: 2014.1.22

var express = require('express');
var _ = require("underscore"); 
var debug = require('debug')('dashboardRouter');
var sessionManager = require('../lib/sessionManager');
var router = express.Router();
var Dashboard = require('../service/Dashboard.js');

router.route('/workingSummary')
.get(function(req, res) {
    var _dashboard= new Dashboard();
    var _userId=sessionManager.get(req.cookies.saram).user.id;
    var params={
        start:req.query.start,
        end:req.query.end,
        userId:_userId
    };
    
    debug(params);
    _dashboard.getWorkingSummary(params).then(function(result){
        res.send(result);
    }).catch(function(e){
        
        res.send(e);
    });
});
module.exports = router;



