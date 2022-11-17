// Author: sanghee park <novles@naver.com>
// Create Date: 2014.12.18
// 서비스의 Data를 명시 해놓은 오브젝트
var _ = require("underscore");  
var Schemas = function (schemaName) {
	
	//  관리자,  임원,         부서장,      사용자      근무지
    var ADMIN=9, EXECUTIVE=2, DEPT_BOSS=1, USER=0, AREA='서울';
	
    // 기본 스키마 셋팅 이후 변환 매소드 반환
    var _data = {
        //MODEL
        session:{
            user:null,
            id:null,
            auth:null,
            isLogin:false,
            initPassword:false,
            msg:null,
            ACCESS_TOKEN:null
        },
        user: {
            id: null,
            name: null,
            password: null,
            dept_code: null,
            dept_name: null,
            name_commute: null,
            join_company: null,
            leave_company: null,
            position_code:null,
            position_name:null,
            privilege: null,
            admin : null,
            affiliated : null,
            new_password:null,
            ip_pc : null,
            mac:null,
            ip_office : null,
            email : null,
            phone : null,
            phone_office : null,
            approval_id : null,
            emergency_phone : null,
            birthday : null,
            wedding_day : null,
            memo: null,
            part_code: null,
            part_name: null,
            gis_pos: null,
            dept_area: null
        },
        position:{
        	code: null,
        	name: null
        },
        department:{
        	code: null,
        	name: null,
        	area: null,
        	leader: null
        },
        part:{
          code: null,
          origin_code: null,
        	name: null,        	
          leader: null,
          use: 1
        },
        auth:{
        },
        rawData:{
            year : null,
            id : null,
            name : null,
            department : null,
            date : null,
            time : null,
            type : null
        },
        
        approval:{
            doc_num : null,
            submit_id : null,
            submit_name : null,
            manager_id : null,     
            manager_name : null,     
            submit_date : null,    
            decide_date : null,    
            submit_comment : null, 
            decide_comment : null, 
            start_date : null,      
            end_date : null,    
            office_code : null,    
            office_code_name : null,    
            black_mark : null,
            state : null,
            start_time : null,
            end_time : null,
            day_count : null
        },
        
        outoffice:{
            year:null,
            date:null,
            id:null,
            office_code:null,
            day_count:null,
            memo:null,
            doc_num:null,
            start_time : null,
            end_time : null
        },
        
        inoffice:{
            year:null,
            date:null,
            id:null,
            doc_num:null
        },
        
        //Common
        code:{
            code:null,
            name:null,
        },
        
        office_code:{
            code : null,
            name : null,
            day_count : null
        },
        
        approval_index:{
            yearmonth : null,
            seq : null
        },

        office_item_code:{
            category_code : null,
            category_type : null,
            category_name : null
        },
        
        book: {
            book_id : null,
            category_1 : null,
            category_2 : null,
            manage_no : null,
            author : null,
            publisher : null,
            publishing_date : null,
            img_src : null,
            isbn : null
        }
    }
    
    var _schema=_.noop();
    _schema=_data[schemaName];
        
    //data에 있는 값을 schema에 있는 key에 존재하는 값만 셋팅해서 반환한다.  
    var _generator = function (data) {
        data = data || {};
        var defauls=_.defaults(data, _schema);
        var keys= _.keys(_schema);
        var a=_.pick(_.defaults(data, _schema), _.keys(_schema)); 
       // console.log(a);
        return _.pick(_.defaults(data, _schema), _.keys(_schema)); 
    }
    
    //설정되지 않은 값은 기본값으로 셋팅된 객체 반환
    var __defaultGenerator = function(data){    
        data = data || {};
        return _.defaults(data, _schema);
    }
    return {
        get:_generator,
        getDefault:__defaultGenerator,
        ADMIN: ADMIN,
        EXECUTIVE : EXECUTIVE,
        DEPT_BOSS : DEPT_BOSS,
        USER : USER
    };
}
module.exports = Schemas;
