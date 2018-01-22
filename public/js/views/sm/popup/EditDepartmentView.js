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
  'collection/sm/userCollection',
], function($, _, _S, Backbone, BaseView, log, Dialog, i18nCommon, Form, DepartmentModel, Code, CodeCollection, container, UserCollection){
    var LOG= log.getLogger("EditDepartmentView");
	var autocompleteId = "autocomplete";
	var availableTagsUser = [];

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
							//type:"input",
							type:"auto_input",
							name:"leader",
							id:autocompleteId,
    	        			label:i18nCommon.DEPARTMENT_LIST.GRID_COL_NAME.LEADER,
							value:_model.leader
							
        	        },{
							type:"combo",
							name:"use",
							label:i18nCommon.DEPARTMENT_LIST.GRID_COL_NAME.USE,
							value:_model.area,
							collection:[{key:1,value:i18nCommon.DEPARTMENT_LIST.UPDATE_DIALOG.USE_VALUE.USE},{key:0,value:i18nCommon.DEPARTMENT_LIST.UPDATE_DIALOG.USE_VALUE.NOT_USE}]
					}]
        	    });
        	    
        	    _form.render().done(function(){
        	        _view.form=_form;
					//dfd.resolve();
					dfd.resolve(_view);
        	    }).fail(function(){
        	        dfd.reject();
        	    });  
        	    
    	    return dfd.promise();
		 },
		afterRender: function(){
			$(document).ready(function() {
				var userCollection = new UserCollection();
				userCollection.fetch({
					success : function(result){
						if (result.length > 1) {
							for( var index = 0; index < result.models.length; index++) {
								availableTagsUser[index] = result.models[index].attributes.name + "(" + result.models[index].attributes.id + ")";
								console.log(availableTagsUser[index]);
							}
						}
						else {
							console.log("userCollection data is null!!!");
						}
					}
				})
				$("#autocomplete").autocomplete({
					source: availableTagsUser
				});
				$(".ui-autocomplete").css("position", "absolute");
				$(".ui-autocomplete").css("top", "100px");
				$(".ui-autocomplete").css("left", "100px");
				$(".ui-autocomplete").css("z-index", "2147483647");
				$(".ui-autocomplete").css("background", "#FFFFFF");
			});
		},
    	submitSave : function(e){
    	    var dfd= new $.Deferred();
    	    var _view=this,_form=this.form,_data=_form.getData();
			var firstArr = (_data.leader).split("(");
			var strTemp = firstArr[1].split(")");
			_data.leader = strTemp[0];

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