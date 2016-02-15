var express = require('express');
var debug = require('debug')('departmentRouter');
var router = express.Router();
var _ = require("underscore"); 
var Department = require('../service/Department.js');



//부서 목록 조회(관리자).
router.route('/list')
.get(function(req, res){
    var department = new Department();
    var result = department.getManagerList().then(function(result){
        debug("Complete Select Department List.");
        res.send(result);    
    }).catch(function(e){
        debug("Error Select Department List.");
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
    var department = new Department({code:_code});
    department.getDepartmentList().then(function(result){
        debug("Complete Select Department.");
        res.send(result);
    }).catch(function(e){
        debug("Error Select Department.");
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
	var department = new Department(req.body, true);
    department.editDepartment().then(function(result){
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
  var department = new Department({code:_code});
  department.remove().then(function(result){
      debug("Complete Delete Department.");
      debug(result);
      if(result == false){
    	  res.send({success:false, message:"사용중입니다."});
      }else{
    	  res.send({success:true, message:"삭제되었습니다."});
      }
      
  }).catch(function(e){
      debug("Error Delete Department.");
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
  var department = new Department(req.body);
  debug("CODE:" + department.get("code"));
  
  department.addDepartment().then(function(e){
      debug("Complete Add Department.");
      res.send({success:true, msg:"Complete Add Department."});
  }).catch(function(e){
      debug("Error Add Department.");
      res.status(500);
      res.send({
          success:false,
          message: e.message,
          error:e
      });
  });
});




module.exports = router;
