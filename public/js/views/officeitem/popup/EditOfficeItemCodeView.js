define([
  'jquery',
  'underscore',
  'backbone',
  'core/BaseView',
  'log',
  'dialog',
  'i18n!nls/common',
  'lib/component/form',
  //'models/sm/UserModel',
  //'code',
  //'collection/common/CodeCollection',
  'models/officeitem/OfficeItemCodeModel',
  'text!templates/default/input.html'
], function(
	$, _, Backbone, BaseView, log, Dialog, i18nCommon, Form, 
	//UserModel, Code, CodeCollection, 
	OfficeItemCodeModel,
	container
){
    var LOG = log.getLogger("EditOfficeItemCodeView");
    var EditOfficeItemCodeView = BaseView.extend({
    	initialize:function(data){
    		$(this.el).html('');
    	    $(this.el).empty();
    	    
			//this.model=new UserModel(data);
			this.model = new OfficeItemCodeModel(data);
			//this.model.attributes._id = data.category_code;
    	    _.bindAll(this, "submitSave");
    	},
    	render:function(el){
    	    var dfd= new $.Deferred();
    	    var _view=this;
    	    if (!_.isUndefined(el)){
    	        this.el=el;
    	    }
    	    /*
    	    var deptCodeCollection=Code.getCollection(Code.DEPARTMENT);// new CodeCollection("dept");
			var partCodeCollection=Code.getCollection(Code.PART);// new CodeCollection("dept");
    	    var approvalUserCodeCollection= new CodeCollection("approvalUser");
    	    var positionCodeCollection= Code.getCollection(Code.POSITION);//new CodeCollection("position");
    	    $.when(approvalUserCodeCollection.fetch()).done(function(){*/
              var _model=_view.model.attributes;
        	    var _form = new Form({
        	        el:_view.el,
        	        form:undefined,
        	        childs:[{
								type:"combo",
								name:"category_type",
								label:i18nCommon.OFFICEITEM.CATEGORY.COLUME.TYPE,
								value:_model.category_type,
								collection:[{key:i18nCommon.OFFICEITEM.CATEGORY.TYPE.OS,value:i18nCommon.OFFICEITEM.CATEGORY.TYPE.OS},{key:i18nCommon.OFFICEITEM.CATEGORY.TYPE.CS,value:i18nCommon.OFFICEITEM.CATEGORY.TYPE.CS}],
								disabled:"readonly"
							},{
								type:"input",
								name:"category_code",
								label:i18nCommon.OFFICEITEM.CATEGORY.COLUME.CODE,
								value:_model.category_code,
								disabled:"readonly"
							},{
								type:"input",
								name:"category_name",
								label:i18nCommon.OFFICEITEM.CATEGORY.COLUME.NAME,
								value:_model.category_name,
							/*},
							{
									type:"combo",
									name:"position_code",
									label:i18nCommon.USER.POSITION,S
									value:_model.position_code,
									collection:positionCodeCollection,
									linkField:"position_name"
							},{
									type:"hidden",
									name:"position_name",
									value:_model.position_name,
									collection:positionCodeCollection,
							},
							{
									type:"combo",
									name:"privilege",
									label:i18nCommon.USER.PRIVILEGE,
									value:_model.privilege,
									collection:[{key:1,value:i18nCommon.CODE.PRIVILEGE_1},{key:0,value:i18nCommon.CODE.PRIVILEGE_2}]
							},
							{
									type:"combo",
									name:"admin",
									label:i18nCommon.USER.ADMIN,
									value:_model.admin,
									collection:[{key:0,value:i18nCommon.CODE.ADMIN_0},{key:1,value:i18nCommon.CODE.ADMIN_1}]*/
							}]
				});
        	    
        	    _form.render().done(function(){
        	        _view.form=_form;
        	        dfd.resolve();
        	    }).fail(function(){
        	        dfd.reject();
        	    });  
    	    /*}).fail(function(e){
    	        Dialog.error(i18nCommon.ERROR.USER_EDIT_VIEW.FAIL_RENDER);
    	        LOG.error(e.responseJSON.message);
                dfd.reject();    	      
    	    });*/
    	    return dfd.promise();
     	},
    	submitSave : function(e){
    	    var dfd= new $.Deferred();
    	    var _view=this,_form=this.form,_data=_form.getData();
    	    var _officeItemCodeModel = new OfficeItemCodeModel(_data);
    	    _officeItemCodeModel.attributes._category_code = "-2";
    	    var _validate = _officeItemCodeModel.validation(_data);
			
			if(!_.isUndefined(_validate)){
				Dialog.warning(_validate);
				dfd.reject();
			} else {
				_officeItemCodeModel.save({},{
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
			}
    	    
    	    return dfd.promise();
    	}
    });
    return EditOfficeItemCodeView;
});