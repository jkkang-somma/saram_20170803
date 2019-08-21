define([
  'jquery',
  'underscore',
  'backbone',
  'core/BaseView',
  'log',
  'dialog',
  'i18n!nls/common',
  'lib/component/form',
  'models/sm/PositionModel',
  'code',
  'collection/common/CodeCollection',
  'text!templates/default/input.html',
], function($, _, Backbone, BaseView, log, Dialog, i18nCommon, Form, PositionModel, Code, CodeCollection, container){
    var LOG= log.getLogger("EditPositionView");
    var EditPositionView = BaseView.extend({
    	initialize:function(data){
    		$(this.el).html('');
    	    $(this.el).empty();
    	    
    	    this.model=new PositionModel(data);
    	    _.bindAll(this, "submitSave");
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
        	                label:i18nCommon.POSITION_LIST.CODE,
        	                value:_model.code,
        	                disabled:"readonly",
        	        },{
        	                type:"input",
        	                name:"name",
        	                label:i18nCommon.POSITION_LIST.NAME,
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
    	submitSave : function(e){
    	    var dfd= new $.Deferred();
    	    var _view=this,_form=this.form,_data=_form.getData();
    	    var _positionModel= new PositionModel(_data);
    	    _positionModel.attributes._code="-2";
    	    _positionModel.save({},{
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
    return EditPositionView;
});