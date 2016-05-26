define([
  'jquery',
  'underscore',
  'underscore.string',
  'backbone',
  'core/BaseView',
  'log',
  'dialog',
  'i18n!nls/common',
  'lib/component/form',
  'models/sm/DepartmentModel',
  'code',
  'collection/common/CodeCollection',
  'text!templates/default/input.html',
], function($, _, _S, Backbone, BaseView, log, Dialog, i18nCommon, Form, DepartmentModel, Code, CodeCollection, container){
    var LOG= log.getLogger("EditDepartmentView");
    var EditDepartmentView = BaseView.extend({
    	initialize:function(data){
    		$(this.el).html('');
    	    $(this.el).empty();
    	    
    	    this.model=new DepartmentModel(data);
    	    _.bindAll(this, "submitSave");
    	},
    	render:function(el){
    	    var dfd= new $.Deferred();
    	    var _view=this;
    	    var comboItem = [{key:"", value:" "}];
    	    if (!_.isUndefined(el)){
    	        this.el=el;
    	    }
    	   
              var _model=_view.model.attributes;
        	    var _form = new Form({
        	        el:_view.el,
        	        form:undefined,
        	        childs:[{
        	                type:"input",
        	                name:"code",
        	                label:i18nCommon.DEPARTMENT_LIST.CODE,
        	                value:_model.code,
        	                disabled:"readonly",
        	        },{
        	                type:"input",
        	                name:"name",
        	                label:i18nCommon.DEPARTMENT_LIST.NAME,
        	                value:_model.name,
        	        },{
        	        		type:"combo",
        	        		name:"area",
        	        		label:i18nCommon.DEPARTMENT_LIST.GRID_COL_NAME.AREA,
        	        		value:_model.area,
        	        		collection:[{key:'서울',value:i18nCommon.AREA_LIST.AREA_1},{key:'수원',value:i18nCommon.AREA_LIST.AREA_2}]
        	        },{
    	        			type:"input",
    	        			name:"leader",
    	        			label:i18nCommon.DEPARTMENT_LIST.GRID_COL_NAME.LEADER,
    	        			value:_model.leader,
        	        }]
        	    });
        	    
        	    _form.render().done(function(){
        	        _view.form=_form;
        	        dfd.resolve();
        	    }).fail(function(){
        	        dfd.reject();
        	    });  
        	    
    	    return dfd.promise();
     	},
    	submitSave : function(e){
    	    var dfd= new $.Deferred();
    	    var _view=this,_form=this.form,_data=_form.getData();
    	    var _departmentModel= new DepartmentModel(_data);
    	    _departmentModel.attributes._code="-2";
    	    _departmentModel.save({},{
    	        success:function(model, xhr, options){
    	    		Code.init().then(function(){
    	    			 dfd.resolve(_data);
    	    		});
    	            //dfd.resolve(_data);
    	        },
    	        error:function(model, xhr, options){
    	            var respons=xhr.responseJSON;
    	            Dialog.error(respons.message);
    	            dfd.reject();
    	        },
    	        wait:false
    	    });
    	    
    	    return dfd.promise();
    	},

    });
    return EditDepartmentView;
});