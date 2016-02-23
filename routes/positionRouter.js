var express = require('express');
var debug = require('debug')('positionRouter');
var router = express.Router();
var _ = require("underscore"); 
var Position = require('../service/Position.js');



//직급 목록 조회(관리자).
router.route('/list')
.get(function(req, res){
    var position = new Position();
    var result = position.getManagerList().then(function(result){
        debug("Complete Select Position List.");
        res.send(result);    
    }).catch(function(e){
        debug("Error Select Position List.");
        res.status(500);
        res.send({
            success:false,
            message: e.message,
            error:e
        });
    });
});



//직급 정보 조회
router.route('/:code')
.get(function(req, res){
    var _code=req.param("code");
    var position = new Position({code:_code});
    position.getPositionList().then(function(result){
        debug("Complete Select Position.");
        res.send(result);
    }).catch(function(e){
        debug("Error Select Position.");
        res.status(500);
        res.send({
            success:false,
            message: e.message,
            error:e
        });
    });
    
})

//직급 수정
.put(function(req, res){
	var position = new Position(req.body, true);
	position.editPosition().then(function(result){
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
//직급 삭제
.delete(function(req, res){
  var _code=req.param("code");
  var position = new Position({code:_code});
  position.remove().then(function(result){
      debug("Complete Delete Position.");
      debug(result);
      if(result == false){
    	  res.send({success:false, message:"사용중입니다."});
      }else{
    	  res.send({success:true, message:"삭제되었습니다."});
      }
      
  }).catch(function(e){
      debug("Error Delete Position.");
      res.status(500);
      res.send({
          success:false,
          message: e.message,
          error:e	
      });
  });
});

//직급 등록
router.route('/')
.post(function(req, res){
  var position = new Position(req.body);
  debug("CODE:" + position.get("code"));
  
  position.addPosition().then(function(e){
      debug("Complete Add Position.");
      res.send({success:true, msg:"Complete Add Position."});
  }).catch(function(e){
      debug("Error Add Position.");
      res.status(500);
      res.send({
          success:false,
          message: e.message,
          error:e
      });
  });
});




module.exports = router;
