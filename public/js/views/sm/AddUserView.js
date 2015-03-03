define([
  'jquery',
  'underscore',
  'backbone',
  'core/BaseView',
  'log',
  'dialog',
  'i18n!nls/common',
  'lib/component/form',
  'code',
  'models/sm/UserModel',
  'collection/common/CodeCollection',
], function($, _, Backbone, BaseView, log, Dialog, i18nCommon, Form, Code, UserModel, CodeCollection){
    var LOG= log.getLogger("AddUserView");
    var AddUserView = BaseView.extend({
    	initialize:function(){
    		$(this.el).html('');
    	    $(this.el).empty();
    	    
    	    this.model=new UserModel();
    	    _.bindAll(this, "submitAdd");
    	},
    	render:function(el){
    	    var dfd= new $.Deferred();
    	    var _view=this;
    	    if (!_.isUndefined(el)){
    	        this.el=el;
    	    }
    	    
    	    var deptCodeCollection=Code.getCollection(Code.DEPARTMENT);
    	    var approvalUserCodeCollection= new CodeCollection("approvalUser");
    	    var positionCodeCollection= Code.getCollection(Code.POSITION);
    	    $.when(approvalUserCodeCollection.fetch()).done(function(){
                var _model=_view.model.attributes;
        	    var _form = new Form({
        	        el:_view.el,
        	        form:undefined,
        	        group:[
        	            {
        	                name:"requireInfo",
        	                label:i18nCommon.SUB_TITLE.REQUIRE_INFO,
        	                initOpen:true
        	            },
        	            {
        	                name:"detailInfo",
        	                label:i18nCommon.SUB_TITLE.DETAIL_INFO,
        	                initOpen:false
        	            }
        	        ],
        	        childs:[{
        	                type:"input",
        	                name:"id",
        	                label:i18nCommon.USER.ID,
        	                value:_model.id,
        	                group:"requireInfo"
        	        },{
        	                type:"input",
        	                name:"name",
        	                label:i18nCommon.USER.NAME,
        	                value:_model.name,
        	                group:"requireInfo"
        	        },
        	        {
        	                type:"combo",
        	                name:"position_code",
        	                label:i18nCommon.USER.POSITION,
        	                value:_model.position_code,
        	                collection:positionCodeCollection,
        	                group:"requireInfo",
        	                linkField:"position_name"
        	        },{
        	                type:"hidden",
        	                name:"position_name",
        	                value:_model.position_name,
        	                collection:positionCodeCollection,
        	                group:"requireInfo"
        	        },
        	        {
        	                type:"combo",
        	                name:"dept_code",
        	                label:i18nCommon.USER.DEPT,
        	                value:_model.dept_code,
        	                collection:deptCodeCollection,
        	                group:"requireInfo",
        	                linkField:"dept_name"// text 값을 셋팅 해줌 type은 hidden
        	        },{
        	                type:"hidden",
        	                name:"dept_name",
        	                value:_model.dept_name,
        	                collection:deptCodeCollection,
        	                group:"requireInfo"
        	        },
        	        {
        	                type:"combo",
        	                name:"approval_id",
        	                label:i18nCommon.USER.APPROVAL_NAME,
        	                value:_model.approval_id,
        	                collection:approvalUserCodeCollection,
        	                group:"requireInfo",
        	                firstBlank:true,
        	                linkField:"dept_name"// text 값을 셋팅 해줌 type은 hidden
        	        },{
        	                type:"hidden",
        	                name:"approval_name",
        	                value:_model.approval_name,
        	                group:"requireInfo",
        	                firstBlank:true,
        	                collection:approvalUserCodeCollection,
        	        },
        	       {
        	                type:"combo",
        	                name:"privilege",
        	                label:i18nCommon.USER.PRIVILEGE,
        	                value:_model.privilege,
        	                group:"requireInfo",
        	                collection:[{key:1,value:i18nCommon.CODE.PRIVILEGE_1},{key:0,value:i18nCommon.CODE.PRIVILEGE_2}]
        	        },
        	        {
        	                type:"combo",
        	                name:"admin",
        	                label:i18nCommon.USER.ADMIN,
        	                value:_model.admin,
        	                group:"requireInfo",
        	                collection:[{key:0,value:i18nCommon.CODE.ADMIN_0},{key:1,value:i18nCommon.CODE.ADMIN_1}]
        	        },
        	        {
        	                type:"input",
        	                name:"name_commute",
        	                label:i18nCommon.USER.NAME_COMMUTE,
        	                group:"requireInfo",
        	                value:_model.name_commute
        	        },
        	        {
        	                type:"date",
        	                name:"join_company",
        	                label:i18nCommon.USER.JOIN_COMPANY,
        	                value:_model.join_company,
        	                format:"YYYY-MM-DD",
        	                group:"detailInfo"
        	        },
        	         {
        	                type:"date",
        	                name:"leave_company",
        	                label:i18nCommon.USER.LEAVE_COMPANY,
        	                value:_model.leave_company,
        	                format:"YYYY-MM-DD",
        	                group:"detailInfo"
        	        },{
        	                type:"input",
        	                name:"phone",
        	                label:i18nCommon.USER.PHONE,
        	                value:_model.phone,
        	                group:"detailInfo"
        	        },
        	        {
        	                type:"input",
        	                name:"email",
        	                label:i18nCommon.USER.EMAIL,
        	                value:_model.email,
        	                group:"detailInfo"
        	        },
        	         {
        	                type:"date",
        	                name:"birthday",
        	                label:i18nCommon.USER.BIRTHDAY,
        	                value:_model.birthday,
        	                format:"YYYY-MM-DD",
        	                group:"detailInfo"
        	        },
        	         {
        	                type:"date",
        	                name:"wedding_day",
        	                label:i18nCommon.USER.WEDDING_DAY,
        	                value:_model.wedding_day,
        	                format:"YYYY-MM-DD",
        	                group:"detailInfo"
        	        },
        	         {
        	                type:"input",
        	                name:"ip_pc",
        	                label:i18nCommon.USER.IP,
        	                value:_model.ip_pc,
        	                group:"detailInfo"
        	        },{
        	                type:"input",
        	                name:"mac",
        	                label:i18nCommon.USER.MAC,
        	                value:_model.mac,
        	                group:"detailInfo"
        	        },
        	         {
        	                type:"input",
        	                name:"ip_office",
        	                label:i18nCommon.USER.OFFICE_IP,
        	                value:_model.ip_office,
        	                group:"detailInfo"
        	        },
        	         {
        	                type:"input",
        	                name:"phone_office",
        	                label:i18nCommon.USER.PHONE_OFFICE,
        	                value:_model.phone_office,
        	                group:"detailInfo"
        	        },
        	         {
        	                type:"input",
        	                name:"emergency_phone",
        	                label:i18nCommon.USER.EMERGENCY_PHONE,
        	                value:_model.emergency_phone,
        	                group:"detailInfo"
        	        },
        	         {
        	                type:"text",
        	                name:"memo",
        	                label:i18nCommon.USER.MEMO,
        	                value:_model.memo,
        	                group:"detailInfo"
        	        }]
        	    });
        	    
        	    _form.render().done(function(){
        	        _view.form=_form;
        	        dfd.resolve();
        	    }).fail(function(){
        	        dfd.reject();
        	    });  
    	    }).fail(function(e){
    	        Dialog.error(i18nCommon.ERROR.USER_EDIT_VIEW.FAIL_RENDER);
    	        LOG.error(e.responseJSON.message);
                dfd.reject();    	      
    	    });
    	    return dfd.promise();
     	},
    	
    	submitAdd : function(beforEvent, affterEvent){
    	    var view = this;
    	    var dfd= new $.Deferred();
    	    var _view=this,_form=this.form,_data=_form.getData();
    	    var _userModel=new UserModel(_data);
            var _validate=_userModel.validation(_data, {// 유효성 검사 필드 
                id:"",
                password: "", 
                name: "",
                name_commute: "",
                dept_code: "",
                privilege:"",
                admin : 0,
            });
            
            if(!_.isUndefined(_validate)){
                Dialog.warning(_validate);
                dfd.reject();
            } else {
                
    	        beforEvent();
                _userModel.save({},{
        	        success:function(model, xhr, options){
        	            affterEvent();
        	            dfd.resolve(_.defaults(_data, _userModel.default));
        	        },
        	        error:function(model, xhr, options){
        	            var respons=xhr.responseJSON;
        	            affterEvent();
        	            Dialog.error(respons.message);
        	            dfd.reject();
        	        },
        	        wait:false
        	    });    
            }
    	    
    	    return dfd.promise();
    	},
    	
    	getFormData: function(form) {
    	    var unindexed_array = form.serializeArray();
    	    var indexed_array= {};
    	    
    	    $.map(unindexed_array, function(n, i){
                indexed_array[n['name']] = n['value'];
            });
            
            return indexed_array;
    	}
    });
    return AddUserView;
});