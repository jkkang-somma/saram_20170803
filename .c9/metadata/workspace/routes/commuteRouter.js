{"filter":false,"title":"commuteRouter.js","tooltip":"/routes/commuteRouter.js","undoManager":{"mark":20,"position":20,"stack":[[{"group":"doc","deltas":[{"start":{"row":9,"column":0},"end":{"row":10,"column":0},"action":"remove","lines":["\tdebug(req.query);",""]}]}],[{"group":"doc","deltas":[{"start":{"row":16,"column":0},"end":{"row":17,"column":0},"action":"remove","lines":["\t\t\t\tdebug(\"Success get Commute\");",""]}]}],[{"group":"doc","deltas":[{"start":{"row":0,"column":0},"end":{"row":97,"column":0},"action":"remove","lines":["var express = require('express');","var _ = require('underscore');","var debug = require('debug')('commuteRouter');","var router = express.Router();","var Commute = require('../service/Commute.js');","var Promise = require('bluebird');","var sessionManager = require('../lib/sessionManager');","router.route('/')",".get(function(req, res){","\tif(_.isUndefined(req.query.date)){","\t\tif(!_.isUndefined(req.query.id)){","\t\t\tCommute.getCommuteByID(req.query).then(function(result){","\t\t\t\tres.send(result);","\t\t\t});","\t\t}else{","\t\t\tCommute.getCommute(req.query, function(result) {","\t\t\t\ttry{","\t\t\t\t\tres.send(result);","\t\t\t\t}catch(err){","\t\t\t\t\tdebug(err);","\t\t\t\t}","\t\t\t\t","\t\t\t});","\t\t}","\t}else{","\t\tCommute.getCommuteDate(req.query.date).then(function(result){","\t\t\tres.send(result);\t","\t\t});","\t}","})","","router.route('/bulk')",".post(function(req, res){","\tvar data = req.body.data;","\tvar session = sessionManager.get(req.cookies.saram);","\tif (session.user.admin == 1) {\t// admin 일 경우만 생성","\t    Commute.insertCommute(data).then(function(result){","\t    \tres.send({","\t            success:true,","\t            message: \"Add CommuteResult Success! (\"+ result +\")\"","\t        });","\t    }, function(errResult){","\t    \tres.status(500);","        \tres.send({","\t            success:false,","\t            message: errResult.message,","\t            error:errResult","\t        });","\t    });","\t} else {","\t\tres.status(401);","    \tres.send({","            success:false,","            message: \"관리자 등급만 생성이 가능합니다.\",","        });","\t}","}).put(function(req, res){","\tvar data = req.body;","\tvar session = sessionManager.get(req.cookies.saram);","\tif (session.user.admin == 1) {\t// admin 일 경우만 생성","\t\tCommute.updateCommute(data).then(function(){","\t\t\tres.send({success : true});","\t\t});","","\t}else{","\t\tres.status(401);","    \tres.send({","            success:false,","            message: \"관리자 등급만 생성이 가능합니다.\",","        });","\t}","});","","router.route('/lastiestdate')",".get(function(req,res){","\tCommute.getLastiestDate().then(function(result){","\t\tres.send(result);","\t})","});","","router.route('/:id')",".get(function(req, res){","}).post(function(req, res){","","}).put(function(req, res){","\tCommute.updateChangeHistory(req.body, function(result) {","\t\treturn res.send(result);","\t});","});","","//Dashboard ","router.route('/result/:id')",".get(function(req, res){","\tres.send({});","});","","module.exports = router;",""]},{"start":{"row":0,"column":0},"end":{"row":102,"column":0},"action":"insert","lines":["var express = require('express');","var _ = require('underscore');","var debug = require('debug')('commuteRouter');","var router = express.Router();","var Commute = require('../service/Commute.js');","var Promise = require('bluebird');","var sessionManager = require('../lib/sessionManager');","router.route('/')",".get(function(req, res){","\tif(_.isUndefined(req.query.date)){","\t\tdebug(\"######################\");","\t\tdebug(process.memoryUsage());","\t\tif(!_.isUndefined(req.query.id)){","\t\t\tCommute.getCommuteByID(req.query).then(function(result){","\t\t\t\tres.send(result);","\t\t\t});","\t\t}else{","\t\t\tCommute.getCommute(req.query).then(function(result) {","\t\t\t\ttry{","\t\t\t\t\tdebug(\"END DB Query\");","\t\t\t\t\tdebug(result.length);","\t\t\t\t\tres.send(result);","\t\t\t\t\tdebug(\"End Response Send\");","\t\t\t\t}catch(err){","\t\t\t\t\tdebug(err);","\t\t\t\t}","\t\t\t\t","\t\t\t});","\t\t}","\t}else{","\t\tCommute.getCommuteDate(req.query.date).then(function(result){","\t\t\tres.send(result);\t","\t\t});","\t}","})","","router.route('/bulk')",".post(function(req, res){","\tvar data = req.body.data;","\tvar session = sessionManager.get(req.cookies.saram);","\tif (session.user.admin == 1) {\t// admin 일 경우만 생성","\t    Commute.insertCommute(data).then(function(result){","\t    \tres.send({","\t            success:true,","\t            message: \"Add CommuteResult Success! (\"+ result +\")\"","\t        });","\t    }, function(errResult){","\t    \tres.status(500);","        \tres.send({","\t            success:false,","\t            message: errResult.message,","\t            error:errResult","\t        });","\t    });","\t} else {","\t\tres.status(401);","    \tres.send({","            success:false,","            message: \"관리자 등급만 생성이 가능합니다.\",","        });","\t}","}).put(function(req, res){","\tvar data = req.body;","\tvar session = sessionManager.get(req.cookies.saram);","\tif (session.user.admin == 1) {\t// admin 일 경우만 생성","\t\tCommute.updateCommute(data).then(function(){","\t\t\tres.send({success : true});","\t\t});","","\t}else{","\t\tres.status(401);","    \tres.send({","            success:false,","            message: \"관리자 등급만 생성이 가능합니다.\",","        });","\t}","});","","router.route('/lastiestdate')",".get(function(req,res){","\tCommute.getLastiestDate().then(function(result){","\t\tres.send(result);","\t})","});","","router.route('/:id')",".get(function(req, res){","}).post(function(req, res){","","}).put(function(req, res){","\tCommute.updateChangeHistory(req.body, function(result) {","\t\treturn res.send(result);","\t});","});","","//Dashboard ","router.route('/result/:id')",".get(function(req, res){","\tres.send({});","});","","module.exports = router;",""]}]}],[{"group":"doc","deltas":[{"start":{"row":82,"column":3},"end":{"row":82,"column":4},"action":"insert","lines":[";"]}]}],[{"group":"doc","deltas":[{"start":{"row":5,"column":0},"end":{"row":5,"column":34},"action":"remove","lines":["var Promise = require('bluebird');"]}]}],[{"group":"doc","deltas":[{"start":{"row":5,"column":0},"end":{"row":6,"column":0},"action":"remove","lines":["",""]}]}],[{"group":"doc","deltas":[{"start":{"row":5,"column":54},"end":{"row":6,"column":0},"action":"insert","lines":["",""]}]}],[{"group":"doc","deltas":[{"start":{"row":34,"column":2},"end":{"row":34,"column":3},"action":"insert","lines":[";"]}]}],[{"group":"doc","deltas":[{"start":{"row":20,"column":18},"end":{"row":20,"column":19},"action":"insert","lines":["t"]}]}],[{"group":"doc","deltas":[{"start":{"row":20,"column":19},"end":{"row":20,"column":20},"action":"insert","lines":["o"]}]}],[{"group":"doc","deltas":[{"start":{"row":20,"column":20},"end":{"row":20,"column":21},"action":"insert","lines":["S"]}]}],[{"group":"doc","deltas":[{"start":{"row":20,"column":21},"end":{"row":20,"column":22},"action":"insert","lines":["t"]}]}],[{"group":"doc","deltas":[{"start":{"row":20,"column":22},"end":{"row":20,"column":23},"action":"insert","lines":["r"]}]}],[{"group":"doc","deltas":[{"start":{"row":20,"column":23},"end":{"row":20,"column":24},"action":"insert","lines":["i"]}]}],[{"group":"doc","deltas":[{"start":{"row":20,"column":24},"end":{"row":20,"column":25},"action":"insert","lines":["n"]}]}],[{"group":"doc","deltas":[{"start":{"row":20,"column":25},"end":{"row":20,"column":26},"action":"insert","lines":["g"]}]}],[{"group":"doc","deltas":[{"start":{"row":20,"column":26},"end":{"row":20,"column":27},"action":"insert","lines":["."]}]}],[{"group":"doc","deltas":[{"start":{"row":20,"column":26},"end":{"row":20,"column":27},"action":"remove","lines":["."]}]}],[{"group":"doc","deltas":[{"start":{"row":20,"column":26},"end":{"row":20,"column":27},"action":"insert","lines":["("]}]}],[{"group":"doc","deltas":[{"start":{"row":20,"column":27},"end":{"row":20,"column":28},"action":"insert","lines":[")"]}]}],[{"group":"doc","deltas":[{"start":{"row":20,"column":28},"end":{"row":20,"column":29},"action":"insert","lines":["."]}]}]]},"ace":{"folds":[],"scrolltop":0,"scrollleft":0,"selection":{"start":{"row":21,"column":22},"end":{"row":21,"column":22},"isBackwards":false},"options":{"guessTabSize":true,"useWrapMode":false,"wrapToView":true},"firstLineState":{"row":115,"mode":"ace/mode/javascript"}},"timestamp":1428653434000,"hash":"70b9cdf3953903afd9934d097ed4ce06423b7676"}