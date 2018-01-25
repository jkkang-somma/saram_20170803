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
  'models/officeitem/OfficeItemModel',
  'collection/common/CodeCollection',
  'collection/sm/UserCollection',
], function($, _, Backbone, BaseView, log, Dialog, i18nCommon, Form, Code, OfficeItemModel, CodeCollection,UserCollection){
    var LOG= log.getLogger("DefailOfficeItemView");
    var DefailOfficeItemView = BaseView.extend({
    	initialize:function(date){
    		$(this.el).html('');
    	    $(this.el).empty();
    	    
    	    this.model=new OfficeItemModel(date);
    	    //_.bindAll(this, "submitSave");
    	},
    	render:function(el){
    	    var dfd= new $.Deferred();
    	    var _view=this;
    	    if (!_.isUndefined(el)){
    	        this.el=el;
    	    }
		
	    var userCollection= new UserCollection();
    	    var deptCodeCollection=Code.getCollection(Code.DEPARTMENT);
	    //var partCodeCollection=Code.getCollection(Code.DEPT);
	    var approvalUserCodeCollection= new CodeCollection("approvalUser");
    	    var positionCodeCollection= Code.getCollection(Code.POSITION);
	    $.when(approvalUserCodeCollection.fetch(), userCollection.fetch()).done(function(){
                var _model=_view.model.attributes;
        	    var _form = new Form({
        	        el:_view.el,
        	        form:undefined,
        	        childs:[{
        	                type:"input",
        	                name:"serial_yes",
        	                label:i18nCommon.OFFICEITEM.CODE.SERIAL_YES,
							value:_model.serial_yes,
							disabled:"readonly",    
        	        },{
        	                type:"input",
        	                name:"serial_factory",
        	                label:i18nCommon.OFFICEITEM.CODE.SERIAL_FACTORY,
							value:_model.serial_factory,
							disabled:"readonly",
					},{
							type:"input",
							name:"use_dept",
							label:i18nCommon.USER.DEPT,
							value:_model.use_dept_name,
							disabled:"readonly",
					},{
							type:"input",
							name:"use_user",
							label:i18nCommon.OFFICEITEM.CODE.USE_USER_NAME,
							value:_model.use_user_name,
							disabled:"readonly",
					},{
        	                type:"input",
        	                name:"vendor",
        	                label:i18nCommon.OFFICEITEM.CODE.VENDOR,
							value:_model.vendor,
							disabled:"readonly", 
        	        },{
        	                type:"input",
        	                name:"model_no",
        	                label:i18nCommon.OFFICEITEM.CODE.MODEL_NO,
							value:_model.model_no,
							disabled:"readonly",
					},{
        	                type:"input",
        	                name:"category_code",
        	                label:i18nCommon.OFFICEITEM.CODE.CATEGORY_CODE,
        	                value:_model.category_code,
							disabled:"readonly",
					},{
        	                type:"input",
        	                name:"price",
        	                label:i18nCommon.OFFICEITEM.CODE.PRICE,
        	                value:_model.price,
							disabled:"readonly",
        	        },{
        	                type:"input",
        	                name:"surtax",
        	                label:i18nCommon.OFFICEITEM.CODE.SURTAX,
							value:_model.surtax,
							disabled:"readonly",
        	        },{
        	                type:"input",
        	                name:"price_buy",
        	                label:i18nCommon.OFFICEITEM.CODE.PRICE_BUY,
							value:_model.price_buy,
							disabled:"readonly",
					},{
        	                type:"input",
        	                name:"location",
        	                label:i18nCommon.OFFICEITEM.CODE.LOCATION,
							value:_model.location,
							disabled:"readonly",
					},{
        	                type:"input",
        	                name:"state",
        	                label:i18nCommon.OFFICEITEM.CODE.STATE,
							value:_model.state,
							disabled:"readonly",        
        	        },{
        	                type:"input",
        	                name:"buy_date",
        	                label:i18nCommon.OFFICEITEM.CODE.BUY_DATE,
        	                value:_model.buy_date,
							//format:"YYYY-MM-DD",
							disabled:"readonly",
        	        },{
        	                type:"input",
        	                name:"disposal_date",
        	                label:i18nCommon.OFFICEITEM.CODE.DISPOSAL_DATE,
        	                value:_model.disposal_date,
							//format:"YYYY-MM-DD",
							disabled:"readonly",
        	        },{
        	                type:"input",
        	                name:"disposal_account",
        	                label:i18nCommon.OFFICEITEM.CODE.DISPOSAL_ACCOUNT,
        	                value:_model.disposal_account,
							//format:"YYYY-MM-DD",
							disabled:"readonly",
           	        },{
        	                type:"input",
        	                name:"expiration_date",
        	                label:i18nCommon.OFFICEITEM.CODE.EXPIRATION_DATE,
        	                value:_model.expiration_date,
							//format:"YYYY-MM-DD",
							disabled:"readonly",
        	        },{
        	                type:"text",
        	                name:"memo",
        	                label:i18nCommon.OFFICEITEM.CODE.MEMO,
							value:_model.memo,
							disabled:"readonly",
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
    	
    	getFormData: function(form) {
    	    var unindexed_array = form.serializeArray();
    	    var indexed_array= {};
    	    
    	    $.map(unindexed_array, function(n, i){
                indexed_array[n['name']] = n['value'];
            });
            
            return indexed_array;
    	}
    });
    return DefailOfficeItemView;
});