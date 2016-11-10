var express = require('express');
var debug = require('debug')('partRouter');
var router = express.Router();
var _ = require("underscore"); 
var Part = require('../service/Part.js');



//부서 목록 조회(관리자).
router.route('/list')
.get(function(req, res){
    var part = new Part();
    var result = part.getManagerList().then(function(result){
        debug("Complete Select Part List.");
        res.send(result);    
    }).catch(function(e){
        debug("Error Select Part List.");
        res.status(500);
        res.send({
            success:false,
            message: e.message,
            error:e
        });
    });
});



//부서 정보 조회
router.route('/:code')
.get(function(req, res){
    var _code=req.param("code");
    var part = new Part({code:_code});
    part.getPartList().then(function(result){
        debug("Complete Select Part.");
        res.send(result);
    }).catch(function(e){
        debug("Error Select Part.");
        res.status(500);
        res.send({
            success:false,
            message: e.message,
            error:e
        });
    });
    
})

//부서 수정
.put(function(req, res){
	var part = new Part(req.body, true);
    part.editPart().then(function(result){
      res.send(result);
  }).catch(function(e){
      debug("Error.");
      res.status(500);
      res.send({
          success:false,
          message: e.message,
          error:e
      });
  });
})
//부서 삭제
.delete(function(req, res){
  var _code=req.param("code");
  var part = new Part({code:_code});
  part.remove().then(function(result){
      debug("Complete Delete Part.");
      debug(result);
      if(result == false){
    	  res.send({success:false, message:"사용중입니다."});
      }else{
    	  res.send({success:true, message:"삭제되었습니다."});
      }
      
  }).catch(function(e){
      debug("Error Delete Part.");
      res.status(500);
      res.send({
          success:false,
          message: e.message,
          error:e	
      });
  });
});

//부서 등록
router.route('/')
.post(function(req, res){    
  var part = new Part(req.body);  
  debug("CODE:" + JSON.stringify(req.body));
  
  part.addPart().then(function(e){
      debug("Complete Add Part.");
      res.send({success:true, msg:"Complete Add Part."});
  }).catch(function(e){
      debug("Error Add Part.");
      res.status(500);
      res.send({
          success:false,
          message: e.message,
          error:e
      });
  });
});




module.exports = router;
