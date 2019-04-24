var express = require('express');
var debug = require('debug')('statisticsRouter');
var router = express.Router();
var Statistics = require('../service/StatisticsService.js');
var sessionManager = require('../lib/sessionManager');

router.route('/abnormal')
.get(function(req, res, next){
	Statistics.selectAbnormalDeptSummary(req.query.type, req.query.fromDate, req.query.toDate).then(function(result) {
		return res.send(result);
	}).catch(function(err) {
		next(err);
    });
});

router.route('/abnormal/detail')
.get(function(req, res, next){
	Statistics.selectDeptDetail(req.query.fromDate, req.query.toDate, req.query.dept, req.query.work_type).then(function(result) {
		return res.send(result);
	}).catch(function(err) {
		next(err);
    });
});

router.route('/report1')
.get(function(req, res, next){
	var adminString=sessionManager.getAdminString(req.cookies.saram);
	Statistics.selectReport1(req.query.type, req.query.from, req.query.to, adminString).then(function(result) {
		return res.send(result);
	}).catch(function(err) {
		next(err);
    });
});

router.route('/report1/detail')
.get(function(req, res, next){
	Statistics.selectDeptDetail(req.query.from, req.query.to, req.query.user_id, req.query.overtime_code).then(function(result) {
		return res.send(result);
	}).catch(function(err) {
		next(err);
    });
});

module.exports = router;