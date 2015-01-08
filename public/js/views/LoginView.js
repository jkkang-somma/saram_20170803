define([
  'jquery',
  'underscore',
  'backbone',
  'log',
  'models/sm/SessionModel',
  'models/sm/UserModel',
  'text!templates/loginTemplate.html',
  'text!templates/initpasswordTemplate.html',
  ], function($, _,Backbone, log, SessionModel, UserModel, loginTemplate, initpasswordTemplate){
    var LOG=log.getLogger('LoginView');
    var LoginView = Backbone.View.extend({
      events:{
    		  "click #loginbtn":"submitLogin",
    		  "click #passwordCommit" : "commitPassword"
    	},
    	
    	initialize:function(){
    	  var view = this;
    		_.bindAll(this, 'render');
    		_.bindAll(this, 'submitLogin');
    		_.bindAll(this, 'close');
    	},
    	
    	render:function(flag){
    	  $(this.el).html('');
  	    $(this.el).empty();
    	  if(flag){
    	    $(this.el).append(initpasswordTemplate);  
      	  this.$el.find("#initIdText").val(flag);
      	  this.$el.find("#initIdText").prop('disabled',true);
    	  }else{
      	 $(this.el).append(loginTemplate);
    	  }
    		
     	},
    	
    	submitLogin : function(e){
    	  var data = this.getFormData( this.$el.find('form'));
    	  var view= this;
    	  SessionModel.getInstance()
    	  .login(data)
    	  .then(function(obj){
    	    LOG.debug(obj);
    	    if (obj.init){
    	      view.render(obj.init);
    	    }
    	    
    	  });
    	  return false;
    	},
    	
    	commitPassword : function(e){
    	  var data = this.getFormData( this.$el.find('form'));
    	  if(data.password1 !== data.password2){
    	    console.log("!!!!!");
    	  }else{
    	    var user = new UserModel();
    	    user.initPassword({id: data.loginid, password:data.password1});
    	    var view = this;
    	    view.render();
    	  }
  	    return false;
    	},
    	
    	getFormData: function(form) {
  	    form.find(':input:disabled').removeAttr('disabled');
  	    var unindexed_array = form.serializeArray();
  	    var indexed_array= {};
  	    
  	    $.map(unindexed_array, function(n, i){
              indexed_array[n['name']] = n['value'];
        });
          
        return indexed_array;
    	},
    	
    	close: function(){
    	    this.undelegateEvents();
          this.$el.removeData().unbind(); 
    	}
    });
    return LoginView;
});