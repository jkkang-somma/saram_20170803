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
  'models/sm/DepartmentModel',
  'collection/common/CodeCollection',
  'datatables',
], function($, _, Backbone, BaseView, log, Dialog, i18nCommon, Form, Code, DepartmentModel, CodeCollection, Datatables){
    var LOG= log.getLogger("AddDepartmentView");
    var AddDepartmentView = BaseView.extend({
    	initialize:function(){
    		$(this.el).html('');
    	    $(this.el).empty();
    	    
    	    this.model=new DepartmentModel();
    	    _.bindAll(this, "submitAdd");
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
        	                label:i18nCommon.DEPARTMENT_LIST.GRID_COL_NAME.CODE,
        	                value:_model.code,
        	        },{
        	                type:"input",
        	                name:"name",
        	                label:i18nCommon.DEPARTMENT_LIST.GRID_COL_NAME.NAME,
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
    	
    	submitAdd : function(){
    	    var view = this;
    	    var dfd= new $.Deferred();
    	    var _view=this,_form=this.form,_data=_form.getData();
    	    var _departmentModel=new DepartmentModel(_data);
            
    	    _departmentModel.save({},{
    	        success:function(model, xhr, options){
    	    		Code.init().then(
    	    				function(){
    	    					dfd.resolve(_.defaults(_data, _departmentModel.default));
    	    				});
    	            //dfd.resolve(_.defaults(_data, _departmentModel.default));
    	        },
    	        error:function(model, xhr, options){
    	            var respons=xhr.responseJSON;
    	            dfd.reject();
    	        },
    	        wait:false
    	    });  
    	    
    	    dfd.resolve(_data);
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
    return AddDepartmentView;
});