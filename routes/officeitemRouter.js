var express = require('express');
var debug = require('debug')('officeitemRouter');
var router = express.Router();
var _ = require("underscore"); 
var OfficeItem = require('../service/OfficeItem.js');
var sessionManager = require('../lib/sessionManager');

//비품 등록
router.route('/')
.post(function(req, res){    
    var officeitem = new OfficeItem(req.body);

    var session = sessionManager.get(req.cookies.saram);
    var user = session.user;
    
    debug("officeitem add:");    
    officeitem.addOfficeItem(user).then(function(result){
        debug("Complete Add officeitem.");
        //debug(JSON.stringify(result))
        res.send({success:true, result:result, msg:"Complete Add officeitem."});
    }).catch(function(e){
        debug("Error Add officeitem.");
        res.status(500);
        res.send({
            success:false,
            message:e.message,
            error:e
        });
    });
});

//비품 목록 전체 조회.
router.route('/list')
.get(function(req, res){    
    
    var _code=req.param("category_code");
    var _type=req.param("category_type");
    var officeitem = new OfficeItem({category_code:_code , category_type:_type});
  
    var result = officeitem.getOfficeItemList().then(function(result){
        debug("Complete Select OfficeItem List.");
        res.send(result);    
    }).catch(function(e){
        debug("Error Select OfficeItem List.");
        res.status(500);
        res.send({
            success:false,
            message: e.message,
            error:e
        });
    });
});

router.route('/:serial_yes')
.put(function(req, res){   //비품 수정

    var session = sessionManager.get(req.cookies.saram);
    var user = session.user;
    var officeitem = new OfficeItem(req.body, true);
    officeitem.editOfficeItem(user).then(function(result){
        res.send({success:true, result:result, msg:"Complete Edit officeitem."});
    }).catch(function(e){
        res.status(500);
        res.send({
            success:false,
            message: e.message,
            error:e
        });
    });
})
.delete(function(req, res){   //비품 삭제
    var _serial_yes=req.param("serial_yes");
    var officeitem = new OfficeItem({serial_yes:_serial_yes});
    officeitem.remove().then(function(){
        debug("Complete Delete OfficeItem.");
        res.send({success:true, message:"Complete Delete OfficeItem."});
    }).catch(function(e){
        debug("Error Delete OfficeItem.");
        res.status(500);
        res.send({
            success:false,
            message: e.message,
            error:e
        });
    });
});

module.exports = router;