// Author: sanghee park <novles@naver.com>
// Create Date: 2014.1.12
// 코드 Service
var _ = require("underscore"); 
var Schemas = require("../schemas.js");
var CodeDao= require('../dao/codeDao.js');

var Code = function (data) {
    var category = data.category;
    var _data=_.initial([]);
    var schema=new Schemas('code');
    _data = schema.get(data);
    
    var _getCodeList = function(){
        switch (category) {
            case 'dept' :
                return CodeDao.selectDeptList();
            case 'part' :
                return CodeDao.selectPartList();    
            case 'approvalUser' :
                return CodeDao.selectApprovalUserList();
            case 'position' :
                return CodeDao.selectPositionList();
            case 'office' :
                return CodeDao.getOfficeCode();
            case 'workType' :
                return CodeDao.getWorktypeCode();
            case 'overTime' :
                return CodeDao.getOvertimeCode();
            case 'officeitem' :
                return CodeDao.getOfficeItemCode();
            case 'user' :
                return CodeDao.selectUserList();
        }
    }
    
    return {
        getCodeList:_getCodeList
    }
}

//new app 은 싱글톤 아니고 app은 계속 생성
module.exports = Code;

