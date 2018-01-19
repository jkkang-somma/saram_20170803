// Author: sanghee park <novles@naver.com>
// Create Date: 2014.12.18
define([
  'jquery',
  'underscore', 
  'backbone',
  'log'
], function($, _, Backbone, log){
    var LOG=log.getLogger('Schemas');

    //  관리자,  임원,         부서장,      사용자
    const ADMIN=9, EXECUTIVE=2, DEPT_BOSS=1, USER=0;

    var _defaultSchema = {
        //Model
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
            password: null,
            dept_code: null,
            dept_name: null,
            name_commute: null,
            join_company: "",
            leave_company: "",
            admin : null,
            affiliated : null,
            ip_pc : null,
            mac:null,
            ip_office : null,
            position:null,
            position_code:null,
            position_name:null,
            email:null,
            phone:null,
            phone_office:null,
            approval_id:null,
            approval_name:null,
            emergency_phone:null,
            wedding_day:null,
            memo:null,
            part_code: null,
            part_name: null
        },
        auth:{
        },
        //UI 
        headTemp:{
            title:"",
            subTitle:""
        },
        //ICON
        glyphicon:{
            refresh:"glyphicon-refresh",
            add:"glyphicon-plus",
            remove:"glyphicon-trash",
            wrench:"glyphicon-wrench",
            search:"glyphicon-search",
            edit:"glyphicon-pencil",
            ok:"glyphicon-ok",
            read: "glyphicon-list-alt",
            pulsSign:"glyphicon-plus-sign",
            minusSign:"glyphicon-minus-sign",
            setting:"glyphicon-cog",
            user:"glyphicon-user",
            save:"glyphicon-floppy-disk"
        },
        
        //API
        grid:{
            el:null,
            id:null,
            column:[],
            collection:null,
            dataschema:[],
            buttons:[],
            visibleSub:false
        },
        form:{
            el:undefined,
            id:undefined,
            childs:[],
            form:{
                id:undefined
            },
            dataschema:[],
            autoRender:false,
        },
        input:{
            type:"input",
            name:undefined,
            label:undefined,
            value:undefined,
            disabled:false,
            group:undefined
        },

        price:{
            type:"input",
            name:undefined,
            label:undefined,
            value:undefined,
            disabled:false,
            group:undefined
        },

        auto_input:{
            type:"input",
            name:undefined,
            label:undefined,
            value:undefined,
            disabled:false,
            group:undefined
        },
        checkbox:{
            type:"checkbox",
            name:undefined,
            label:undefined,
            checked:false,
            group:undefined
        },
        text:{
            type:"text",
            name:undefined,
            label:undefined,
            value:undefined,
            disabled:false,
            group:undefined
        },
        password:{
            type:"input",
            name:undefined,
            label:undefined,
            value:undefined,
            disabled:false,
            group:undefined
        },
        date:{
            type:"date",
            name:undefined,
            label:undefined,
            value:undefined,
            format:"YYYY-MM-DD",
            disabled:false,
            group:undefined
        },
        datetime:{
            type:"date",
            name:undefined,
            label:undefined,
            value:undefined,
            format:"YYYY-MM-DD",
            disabled:false,
            group:undefined
        },
        combo:{
            type:"combo",
            name:undefined,
            label:undefined,
            value:undefined,
            code:undefined,
            textKey:"name", 
            collection:undefined, //binding collection
            codeKey:"code", //code key
            linkField:undefined, // value값 셋팅 hidden field
            disabled:false, // 활성화 유무
            group:undefined, // 그룹 네임
            firstBlank:false //공백 로우
        },
        hidden:{
            type:"hidden",
            name:undefined,
            value:undefined,
            textKey:"name",
            group:undefined,
            firstBlank:false //공백 로우
        },
        empty:{
            type:"empty",
            name:undefined,
            value:undefined,
            textKey:"name",
            group:undefined,
        },
        checkBox:{
            type:"checkBox",
            name:undefined,
            label:undefined,
            checkLabel:undefined,
            value:undefined,
            disabled:false,
            group:undefined,
            full:false,
        },
        //SERVER response
        response:{
            status:true,// 정상:true, 비정상:flase
            msg:"",
            reson:null,
            data:null
        }
    }
    
    //Singleton SessionManager;
    var Schemas=function(schemaName){
        var _schema=_.noop();
        _schema=_defaultSchema[schemaName];
        
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
        var _getDefaultValue = function(fieldName){
            if (_.has(_schema, fieldName)){
                return _schema[fieldName]
            } else {
                LOG.debug("Not find Field:"+fieldName);
            }
        }
		return {
		    value:_getDefaultValue,
		    get:_generator,
		    getDefault:__defaultGenerator
		}
    };
     var _getSchema = function (schemaName) {
        if (_.has(_defaultSchema, schemaName)){
            return new Schemas(schemaName);
        } else {
            LOG.debug("Not find Schema:"+schemaName);
        }
    }
    return {
        getSchema:_getSchema,
        ADMIN: ADMIN,
        EXECUTIVE : EXECUTIVE,
        DEPT_BOSS : DEPT_BOSS,
        USER : USER
    }
});