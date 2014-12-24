define([
  'jquery',
  'underscore',
  'backbone',
  'log',
  'models/sm/SessionModel',
  'models/sm/UserModel',
  'text!templates/loginTemplate.html',
  'text!templates/initpasswordTemplate.html',
  'css!tool/bootstrap/css/bootstrap-theme.css',
  'css!tool/bootstrap/css/bootstrap.min.css'
  ], function($, _,Backbone, log, SessionModel, UserModel, loginTemplate, initpasswordTemplate){

    var LoginView = Backbone.View.extend({
      el:$(".container"),
    	
      events:{
    		  "click #loginbtn":"submitLogin",
    		  "click #passwordCommit" : "commitPassword"
    	},
    	
    	initialize:function(){
    	  var that = this;
    		_.bindAll(this, 'render');
    		_.bindAll(this, 'submitLogin');
    		_.bindAll(this, 'close');
    		
    		SessionModel.on('change', function(session){
    		  if(session.attributes.login){
    		    window.location.href = '/';
    		  }else{
    		    console.log(session.attributes);
    		    if(session.attributes.init){
    		      that.render(session.attributes.init);
    		    }else{
    		      console.log(session.attributes.msg);
    		    }
    		  }
    		});
    	},
    	
    	render:function(flag){
    	  if(flag){
    	    $(this.el).html('');
    	    $(this.el).empty();
      	  $(this.el).append(initpasswordTemplate);
      	  this.$el.find("#initIdText").val(flag);
      	  this.$el.find("#initIdText").prop('disabled',true);
    	  }else{
    	    SessionModel.get();
      	  if(SessionModel.attributes.login){
      	    window.location.href = '/';
      	  }else{
      		  $(this.el).append(loginTemplate);
      	  }
    	  }
    		
     	},
    	
    	submitLogin : function(e){
    	  var data = this.getFormData( this.$el.find('form'));
    	  SessionModel.login(data);
    	  return false;
    	},
    	
    	commitPassword : function(e){
    	  var data = this.getFormData( this.$el.find('form'));
    	  console.log(data);
    	  if(data.password1 !== data.password2){
    	    console.log("!!!!!");
    	  }else{
    	    UserModel.on("sync",function(event,model,res){
    	      if(res.changedRows > 0){
    	        window.location.href = '/login';
    	      }
    	    });
    	    UserModel.initPassword({id: data.loginid, password:data.password1});
    	    
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