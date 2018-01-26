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
  'models/sm/SessionModel',
  'models/officeitem/OfficeItemHistoryModel',
  'models/officeitem/OfficeItemModel',
  'collection/common/CodeCollection',
  'collection/sm/UserCollection',
  'collection/officeitem/OfficeItemHistoryCollection',
], function($, _, Backbone, BaseView, log, Dialog, i18nCommon, Form, Code, SessionModel, OfficeItemHistoryModel,OfficeItemModel, CodeCollection,UserCollection,OfficeItemHistoryCollection){
    var LOG= log.getLogger("AddOfficeItemView");
    var AddOfficeItemHistoryView = BaseView.extend({
    	initialize:function(date){
    		$(this.el).html('');
    	    $(this.el).empty();    	    
			this.model=new OfficeItemModel(date);
			this.officeItemHistoryCollection =new OfficeItemHistoryCollection();
			this.option = {
				collection:this.officeItemHistoryCollection,
			}
    	    _.bindAll(this, "submitAdd");
    	},
    	render:function(el){
    	    var dfd= new $.Deferred();
    	    var _view=this;
    	    if (!_.isUndefined(el)){
    	        this.el=el;
    	    }
		
		var userCodeCollection= Code.getCollection("user");
		var deptCodeCollection= Code.getCollection(Code.DEPARTMENT);
		var officeItemCodeCollection = Code.getCollection("officeitem");
	   
		var nowDate = new Date().toISOString().slice(0,10);

    	//var deptCodeCollection=Code.getCollection(Code.DEPARTMENT);
	    //var partCodeCollection=Code.getCollection(Code.DEPT);
	    //var approvalUserCodeCollection= new CodeCollection("approvalUser");
    	//var positionCodeCollection= Code.getCollection(Code.POSITION);
	    $.when(userCodeCollection.fetch()).done(function(){
				var _model=_view.model.attributes;
				
        	    var _form = new Form({
        	        el:_view.el,
        	        form:undefined,
			childs:[{
        	                type:"input",
        	                name:"serial_yes",
        	                label:i18nCommon.OFFICEITEM.HISTORY.CODE.SERIAL_YES,
							value:_model.serial_yes,
							disabled:"readonly",
					},{
							type:"input",
							name:"history_date",
							label:i18nCommon.OFFICEITEM.HISTORY.CODE.HISTORY_DATE,
							value:nowDate,
							disabled:"readonly",
					},{
						    type:"hidden",
        	                name:"use_user",
        	                label:i18nCommon.OFFICEITEM.HISTORY.CODE.USER_ID,
							value:_model.use_user,
							isValueInput:true
							//collection:userCodeCollection,
							//disabled:"readonly",
        			},{
        	                type:"hidden",
        	                name:"use_dept",
        	                label:i18nCommon.OFFICEITEM.HISTORY.CODE.USE_DEPT,
							value:_model.use_dept,
							isValueInput:true
							//collection:deptCodeCollection,
							//disabled:"readonly",
        	        },{
							type:"input",
							name:"name",
							label:i18nCommon.OFFICEITEM.HISTORY.CODE.NAME,
							value:((_model.use_user != "")?_model.use_user_name:_model.use_dept_name),
							disabled:"readonly"
					},{
							type:"input",
							name:"change_user_id",
							label:i18nCommon.OFFICEITEM.HISTORY.CODE.CHANGE_USER_ID,
							value: SessionModel.getUserInfo().name,
							disabled:"readonly"
					},{   
							type:"combo",
							name:"type",
							label:i18nCommon.OFFICEITEM.HISTORY.CODE.TYPE,
							value:_model.type,
							//linkField:"type",
							collection:[{key:'A/S',value:"A/S"},{key:'기타',value:"기타"}]
					},{							

							type:"price",
							name:"repair_price",
							label:i18nCommon.OFFICEITEM.HISTORY.CODE.REPAIR_PRICE,
							value:_model.repair_price,
					},{   
							type:"input",
							name:"title",
							label:i18nCommon.OFFICEITEM.HISTORY.CODE.TITLE,
							full:"full",
							value:_model.title,
					},{     	       
        	                type:"text",
        	                name:"memo",
        	                label:i18nCommon.OFFICEITEM.HISTORY.CODE.MEMO,
        	                value:""
					},{							
							type:"hidden",
							name:"category_type",
							value:_model.category_type,
							isValueInput:true
							//collection:officeItemCodeCollection,
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
			var _view=this,_form=this.form;

			//var repair_price_value = _form.getElement("repair_price").find("input").val();
			//if(repair_price_value == ""){_form.getElement("repair_price").find("input").val(0)}		
			
			var _data=_form.getData();	    
			var _officeitemhistoryModel=new OfficeItemHistoryModel(_data);
			
            var _validate=_officeitemhistoryModel.validation(_data, {// 유효성 검사 필드 
                serial_yes:""});
            
            if(!_.isUndefined(_validate)){
                Dialog.warning(_validate);
                dfd.reject();
            } else {
                
    	        beforEvent();
				_officeitemhistoryModel.save({},{
        	        success:function(model, xhr, options){
        	            affterEvent();
        	            dfd.resolve(_.defaults(_data, _officeitemhistoryModel.default));
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
    return AddOfficeItemHistoryView;
});