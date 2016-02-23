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
  'models/sm/PositionModel',
  'collection/common/CodeCollection',
  'datatables',
], function($, _, Backbone, BaseView, log, Dialog, i18nCommon, Form, Code, PositionModel, CodeCollection, Datatables){
    var LOG= log.getLogger("AddPositionView");
    var AddPositionView = BaseView.extend({
    	initialize:function(){
    		$(this.el).html('');
    	    $(this.el).empty();
    	    
    	    this.model=new PositionModel();
    	    _.bindAll(this, "submitAdd");
    	},
    	render:function(el){
    	    var dfd= new $.Deferred();
    	    var _view=this;
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
        	                label:i18nCommon.POSITION_LIST.GRID_COL_NAME.CODE,
        	                value:_model.code,
        	        },{
        	                type:"input",
        	                name:"name",
        	                label:i18nCommon.POSITION_LIST.GRID_COL_NAME.NAME,
        	                value:_model.name,
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
    	    var _positionModel=new PositionModel(_data);
            
    	    _positionModel.save({},{
    	        success:function(model, xhr, options){
    	    		Code.init().then(
    	    				function(){
    	    					dfd.resolve(_.defaults(_data, _positionModel.default));
    	    				});
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
    return AddPositionView;
});