// Author: jupil ko <jfko00@yescnc.co.kr>
// Create Date: 2018.1.5
var express = require('express');
var debug = require('debug')('officeItemCodeRouter');
var router = express.Router();
var _ = require("underscore");
var OfficeItemCode = require('../service/OfficeItemCode.js');

//비품 목록 조회
router.route('/list')
.get(function(req, res){
    debug("OfficeItemCode List.");
    // Get OfficeItem Code list (GET)
    var officeItemCode = new OfficeItemCode();
    var result = officeItemCode.getOfficeItemCodeList().then(function(result){
        debug("Complete Select OfficeItemCode List.");
        res.send(result);    
    }).catch(function(e){
        debug("Error Select OfficeItemCode List.");
        res.status(500);
        res.send({
            success:false,
            message: e.message,
            error:e
        });
    });
});

//비품코드 조회
router.route('/:category_code')
.get(function(req, res){
    var _category_code = req.param("category_code");
    var officeItemCode = new OfficeItemCode({category_code:_category_code});
    officeItemCode.getOfficeItemCodeList(req.body).then(function(result){
        debug("Complete Select OfficeItemCode.");
        res.send(result);
    }).catch(function(e){
        debug("Error Select OfficeItemCode.");
        res.status(500);
        res.send({
            success:false,
            message: e.message,
            error:e
        });
    });
    
})
//비품코드 수정
.put(function(req, res){
    var officeItemCode = new OfficeItemCode(req.body, true);
    officeItemCode.edit(req.body).then(function(result){
        debug("Complete Edit OfficeItemCode.");
        res.send(result);
    }).catch(function(e){
        debug("Error Edit OfficeItemCode.");
        res.status(500);
        res.send({
            success:false,
            message: e.message,
            error:e
        });
    });
})
//비품코드 삭제
.delete(function(req, res){
    var _category_code = req.param("category_code");
    var officeItemCode = new OfficeItemCode({category_code:_category_code});
    officeItemCode.remove(_category_code).then(function(result){
        debug("Delete OfficeItemCode.");
        if (result == false){
            debug("Fail Delete OfficeItemCode.");
            res.send({success:false, message:"Fail Delete OfficeItemCode."});
        } else {
            debug("Complete Delete OfficeItemCode.");
            res.send({success:true, message:"Complete Delete OfficeItemCode."});
        }
    }).catch(function(e){
        debug("Error Delete OfficeItemCode.");
        res.status(500);
        res.send({
            success:false,
            message: e.message,
            error:e
        });
    });
});

//비품코드 등록
router.route('/')
.post(function(req, res){
    var officeItemCode = new OfficeItemCode(req.body);
    debug("CATEGORY_CODE:" + officeItemCode.get("category_code"));
    officeItemCode.add(req.body).then(function(e){
        debug("Complete Add OfficeItemCode.");
        res.send({success:true, msg:"Complete Add OfficeItemCode."});
    }).catch(function(e){
        debug("Error Add OfficeItemCode.");
        res.status(500);
        res.send({
            success:false,
            message: e.message,
            error:e
        });
    });
});

module.exports = router;