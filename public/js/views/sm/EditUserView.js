define([
  'jquery',
  'underscore',
  'underscore.string',
  'backbone',
  'core/BaseView',
  'log',
  'dialog',
  'i18n!nls/user',
  'lib/component/form',
  'models/sm/UserModel',
  'collection/common/CodeCollection',
  'text!templates/default/input.html',
], function($, _, _S, Backbone, BaseView, log, Dialog, i18nUser, Form, UserModel, CodeCollection, container){
    var LOG= log.getLogger("EditUserView");
    var EditUserView = BaseView.extend({
    	initialize:function(data){
    		$(this.el).html('');
    	    $(this.el).empty();
    	    
    	    this.model=new UserModel(data);
    	    _.bindAll(this, "submitSave");
    	},
    	render:function(el){
    	    var dfd= new $.Deferred();
    	    var _view=this;
    	    if (!_.isUndefined(el)){
    	        this.el=el;
    	    }
    	    
    	    var codeCollection= new CodeCollection("dept");
    	    $.when(codeCollection.fetch()).done(function(){
                var _model=_view.model.attributes;
        	    var _form = new Form({
        	        el:_view.el,
        	        form:undefined,
        	        childs:[{
        	                type:"input",
        	                name:"id",
        	                label:i18nUser.ID,
        	                value:_model.id
        	        },{
        	                type:"input",
        	                name:"name",
        	                label:i18nUser.NAME,
        	                value:_model.name
        	        },{
        	                type:"combo",
        	                name:"dept_code",
        	                label:i18nUser.DEPT,
        	                value:_model.dept_code,
        	                collection:codeCollection,
        	                linkField:"dept_name"// text 값을 셋팅 해줌 type은 hidden
        	        },{
        	                type:"hidden",
        	                name:"dept_name",
        	                value:_model.dept_name,
        	                collection:codeCollection,
        	        },{
        	                type:"input",
        	                name:"name_commute",
        	                label:i18nUser.NAME_COMMUTE,
        	                value:_model.name_commute
        	        },{
        	                type:"date",
        	                name:"join_company",
        	                label:i18nUser.JOIN_COMPANY,
        	                value:_model.join_company,
        	                format:"YYYY-MM-DD"
        	        },{
        	                type:"date",
        	                name:"leave_company",
        	                label:i18nUser.LEAVE_COMPANY,
        	                value:_model.leave_company,
        	                format:"YYYY-MM-DD"
        	        },{
        	                type:"combo",
        	                name:"privilege",
        	                label:i18nUser.PRIVILEGE,
        	                value:_model.privilege,
        	                collection:[{key:1,value:"전체"},{key:2,value:"부서"},{key:3,value:"개인"}]
        	        },{
        	                type:"combo",
        	                name:"admin",
        	                label:i18nUser.ADMIN,
        	                value:_model.admin,
        	                collection:[{key:0,value:"사용자"},{key:1,value:"관리자"}]
        	        }]
        	    });
        	    
        	    _form.render().done(function(){
        	        _view.form=_form;
        	        dfd.resolve();
        	    }).fail(function(){
        	        dfd.reject();
        	    });  
    	    }).fail(function(e){
    	        Dialog.error("사용자 정보를 받아오지 못하였습니다.");
    	        LOG.error(e.responseJSON.message);
                dfd.reject();    	      
    	    });
    	    return dfd.promise();
     	},
    	submitSave : function(e){
    	    var dfd= new $.Deferred();
    	    var _view=this,_form=this.form,_data=_form.getData();
    	    var _userModel= new UserModel(_data);
    	    _userModel.attributes._id="-2";
    	    var _validate=_userModel.validation(_data);
    	    _userModel.save({},{
    	        success:function(model, xhr, options){
    	            dfd.resolve(_data);
    	        },
    	        error:function(model, xhr, options){
    	            var respons=xhr.responseJSON;
    	            Dialog.error(respons.message);
    	            dfd.reject();
    	        },
    	        wait:false
    	    });
    	    
    	    return dfd.promise();
    	}
    });
    return EditUserView;
});