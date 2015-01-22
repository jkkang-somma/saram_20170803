// Author: sanghee park <novles@naver.com>
// Create Date: 2014.12.18
define([
  'jquery',
  'underscore', 
  'backbone',
  'log'
], function($, _, Backbone, log){
    var LOG=log.getLogger('Schemas');
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
            join_company: "-",
            leave_company: "-",
            privilege: null,
            admin : null,
            ip_addr_1 : null,
            mac_addr_1 : null,
            ip_addr_2 : null,
            mac_addr_2 : null
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
            read: "glyphicon-list-alt"
        },
        
        //API
        grid:{
            el:null,
            id:null,
            column:[],
            collection:null,
            dataschema:[],
            buttons:[]
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
            disabled:false
        },
        password:{
            type:"input",
            name:undefined,
            label:undefined,
            value:undefined,
            disabled:false
        },
        date:{
            type:"date",
            name:undefined,
            label:undefined,
            value:undefined,
            format:"YYYY-MM-DD",
            disabled:false
        },
        combo:{
            type:"combo",
            name:undefined,
            label:undefined,
            value:undefined,
            code:undefined,
            textKey:"name",
            collection:undefined,
            codeKey:"code",
            linkField:undefined,
            disabled:false
        },
        hidden:{
            type:"hidden",
            name:undefined,
            label:undefined,
            value:undefined
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
        getSchema:_getSchema
    }
});