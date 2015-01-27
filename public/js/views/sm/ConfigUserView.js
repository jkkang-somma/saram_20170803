define([
  'jquery',
  'underscore',
  'underscore.string',
  'backbone',
  'core/BaseView',
  'log',
  'dialog',
  'cryptojs.sha256',
  'i18n!nls/common',
  'lib/component/form',
  'models/sm/UserModel',
  'models/sm/UserConfigModel',
  'models/sm/SessionModel',
  'collection/common/CodeCollection',
  'text!templates/default/input.html',
], function($, _, _S, Backbone, BaseView, log, Dialog, CryptoJS, i18nCommon, Form, UserModel, UserConfigModel, SessionModel, CodeCollection, container){
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
    	                type:"password",
    	                name:"password",
    	                label:i18nCommon.USER.PASSWORD,
    	                value:_model.password
    	        },{
    	                type:"password",
    	                name:"new_password",
    	                label:i18nCommon.USER.NEW_PASSWORD,
    	                value:_model.password
    	        },{
    	                type:"password",
    	                name:"re_new_password",
    	                label:i18nCommon.USER.RE_NEW_PASSWORD,
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
    	    var _id=_data.id;
    	    var _password=_data.password;
    	    var _new_password=_data.new_password;
    	    var _re_new_password=_data.re_new_password;
    	    
    	   
  	      if (_.isEmpty(_password)||_.isEmpty(_new_password)||_.isEmpty(_re_new_password)){// 입력하지 않으 정보가 있을때
  	        Dialog.warning(i18nCommon.WARNING.LOGIN.INIT_PASSWORD_PUT);
  	        dfd.reject();
  	      } else {//정상 작동 .
  	        if (_data.new_password!=_data.re_new_password) {// 같지 않을때
              Dialog.warning(i18nCommon.WARNING.USER.NOT_EQULES_CONFIG_PASSWORD);
              dfd.reject();
      	    } else {
    	        _data._id="-1";
    	        
    	        //암호화
    	        var hash=CryptoJS.SHA256(_data.password);
    	        _data.password=hash.toString();
    	        hash=CryptoJS.SHA256(_data.re_new_password);
    	        _data.re_new_password=hash.toString();
    	        hash=CryptoJS.SHA256(_data.new_password);
    	        _data.new_password=hash.toString();
    	        
    	        var userConfigModel=new UserConfigModel(_data);
    	        userConfigModel.save({},{
    	          success:function(){
    	            Dialog.show(i18nCommon.SUCCESS.LOGIN.SUCCESS_INIT_PASSWORD);
    	            dfd.resolve();
    	          },
    	          error:function(model, e){
    	            if (!_.isUndefined(e.responseJSON.success)){
    	              Dialog.warning(i18nCommon.WARNING.LOGIN[e.responseJSON.message]);
    	            } else {
    	              Dialog.error(e.responseJSON.message);
    	            }
    	            dfd.reject();
    	          }
    	        });
  	        }
  	      }
    	    return dfd.promise();
    	}
    });
    return ConfigUserView;
});