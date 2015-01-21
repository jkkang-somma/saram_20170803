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
  'models/sm/UserModel',
  'models/sm/SessionModel',
  'collection/common/CodeCollection',
  'text!templates/default/input.html',
], function($, _, _S, Backbone, BaseView, log, Dialog, i18nCommon, Form, UserModel, SessionModel, CodeCollection, container){
    var LOG= log.getLogger("EditUserView");
    var ConfigUserView = BaseView.extend({
    	initialize:function(data){
    		$(this.el).html('');
    	    $(this.el).empty();
    	    
    	    this.model=new UserModel(SessionModel.getUserInfo());
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
    	                name:"id",
    	                label:i18nCommon.USER.ID,
    	                value:_model.id,
    	                disabled:true
    	        },{
    	                type:"input",
    	                name:"name",
    	                label:i18nCommon.USER.NAME,
    	                value:_model.name,
    	                disabled:true
    	        },{
    	                type:"input",
    	                name:"password",
    	                label:i18nCommon.USER.PASSWORD,
    	                value:_model.password
    	        },{
    	                type:"input",
    	                name:"new_password",
    	                label:i18nCommon.USER.NEW_PASSWORD,
    	                value:_model.password
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
    	},
    	initializePassword:function(){
    	    var dfd= new $.Deferred();
    	    var _view=this,_form=this.form,_data=_form.getData();
    	    _data.password="";
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
    return ConfigUserView;
});