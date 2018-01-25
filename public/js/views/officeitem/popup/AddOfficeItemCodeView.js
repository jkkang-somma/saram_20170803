define([
	'jquery',
	'underscore',
	'backbone',
	'core/BaseView',
	'log',
	'dialog',
	'i18n!nls/common',
	'lib/component/form',
	'text!templates/default/row.html',
	'models/officeitem/OfficeItemCodeModel'
], function(
	$, _, Backbone, BaseView, log, Dialog, i18nCommon, Form, 
	RowHTML, 
	OfficeItemCodeModel
){
    var LOG= log.getLogger("AddOfficeItemCodeView");
    var AddOfficeItemCodeView = BaseView.extend({

    	initialize:function(){
			$(this.el).html('');
			$(this.el).empty();

			this.model = new OfficeItemCodeModel();
			_.bindAll(this, "submitAdd");
		},
		
    	render:function(el){
			var dfd = new $.Deferred();
			var _view = this;
			if (!_.isUndefined(el)){
				this.el = el;
			}

			var _model = _view.model.attributes;
			var _form = new Form({
        	        el:_view.el,
        	        form:undefined,
        	        childs:[{
						type:"combo",
						name:"category_type",
						label:i18nCommon.OFFICEITEM.CATEGORY.COLUME.TYPE,
						value:_model.category_type,
						collection:[{key:i18nCommon.OFFICEITEM.CATEGORY.TYPE.OS,value:i18nCommon.OFFICEITEM.CATEGORY.TYPE.OS},{key:i18nCommon.OFFICEITEM.CATEGORY.TYPE.CS,value:i18nCommon.OFFICEITEM.CATEGORY.TYPE.CS}],
					},{
        	                type:"input",
        	                name:"category_code",
        	                label:i18nCommon.OFFICEITEM.CATEGORY.COLUME.CODE,
        	                value:_model.category_code,
        	        },{
        	                type:"input",
        	                name:"category_name",
        	                label:i18nCommon.OFFICEITEM.CATEGORY.COLUME.NAME,
							value:_model.category_name,
					}]
			});
		
			_form.render().done(function(){
				_view.form=_form;
				dfd.resolve(_view);
			}).fail(function(){
				dfd.reject(_view);
			});
		
			return dfd.promise();
		},
		 
		afterRender:function(){
		},
    	
    	submitAdd : function(beforEvent, affterEvent){
    	    var view = this;
    	    var dfd= new $.Deferred();
    	    var _view=this,_form=this.form,_data=_form.getData();
    	    var _officeItemCodeModel = new OfficeItemCodeModel(_data);
            var _validate =_officeItemCodeModel.validation(_data, {// 유효성 검사 필드 
                category_code: "",
                category_type: "",
                category_name: ""
            });
            
            if(!_.isUndefined(_validate)){
                Dialog.warning(_validate);
                dfd.reject();
            } else {
    	        beforEvent();
                _officeItemCodeModel.save({},{
        	        success:function(model, xhr, options){
						affterEvent();
						dfd.resolve(_.defaults(_data, _officeItemCodeModel.default));
        	        },
        	        error:function(model, xhr, options){
						var respons=xhr.responseJSON;
						affterEvent();
						if(!_.isUndefined(respons))
							Dialog.error(respons.message);
						else
							Dialog.error(options.xhr.responsText);
						dfd.reject();
        	        },
        	        wait:false
        	    });    
            }
    	    
    	    return dfd.promise();
    	},
    	
    	/*getFormData: function(form) {
		var unindexed_array = form.serializeArray();
		var indexed_array= {};
		
		$.map(unindexed_array, function(n, i){
		indexed_array[n['name']] = n['value'];
		});
		
		return indexed_array;
	}*/
    });
    return AddOfficeItemCodeView;
});