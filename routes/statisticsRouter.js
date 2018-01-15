var express = require('express');
var debug = require('debug')('statisticsRouter');
var router = express.Router();
var Statistics = require('../service/StatisticsService.js');

router.route('/dept')
.get(function(req, res, next){
	Statistics.selectAbnormalDeptSummary(req.query.startDate).then(function(result) {
		return res.send(result);
	}).catch(function(err) {
		next(err);
    });
});

router.route('/dept/detail')
.get(function(req, res, next){
	Statistics.selectDeptDetail(req.query.yearMonth, req.query.dept, req.query.work_type).then(function(result) {
		return res.send(result);
	}).catch(function(err) {
		next(err);
    });
});

module.exports = router;