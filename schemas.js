// Author: sanghee park <novles@naver.com>
// Create Date: 2014.12.18
// 서비스의 Data를 명시 해놓은 오브젝트
var _ = require("underscore");  
var Schemas = function (schemaName) {
    // 기본 스키마 셋팅 이후 변환 매소드 반환
    var _data = {
        session:{
            user:null,
            id:null,
            auth:null,
            isLogin:false,
            init:false,
            msg:null
        },
        user: {
            id: null,
            name: null,
            password: null
        },
        auth:{
        }
    }
    
    var _schema=_.noop();
    _schema=_data[schemaName];
    
    var _generator = function (data) {  
        data = data || {};
        //data에 있는 값을 schema에 있는 key에 존재하는 값만 셋팅해서 반환한다.
        var defauls=_.defaults(data, _schema);
        var keys= _.keys(_schema);
        var a=_.pick(_.defaults(data, _schema), _.keys(_schema)); 
       // console.log(a);
        return _.pick(_.defaults(data, _schema), _.keys(_schema)); 
    }
    return {
        get:_generator
    };
}
module.exports = Schemas;