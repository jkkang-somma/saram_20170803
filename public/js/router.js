// Author: sanghee park <novles@naver.com>
// Create Date: 2014.12.18

define([
	'jquery',
	'underscore',
	'backbone',
	'animator',
	'core/BaseRouter',
	'models/sm/SessionModel',
	'views/LoginView',
	'views/NavigationView',
	'views/sm/UserListView',
	'views/sm/AddUserView',
], function($, _,  Backbone, animator, BaseRouter, SessionModel, LoginView, NavigationView, UserListView, AddUserView){

	var Router = BaseRouter.extend({

		routes : {
			'login' : 'showLogin',
			'usermanager/add' : 'showAddUser',
		      'usermanager' : 'showUserList',
		      '*actions' : 'showHome'
		},
		
		before : function(params, next){
		      // SessionModel.get();
		      // var path = Backbone.history.location.hash;
		      
		      // if(typeof SessionModel.attributes.loginid === 'undefined' ){
		      //   SessionModel.set('redirectFrom', path)
		      //   Backbone.history.navigate('login',{trigger : true});
		      //   window.location.href = "/login";
		      // }else{
		      //   return next();
		      // }
      		return next();
		},

		after : function(){
			//empty
		},

		changeView : function(view){
			
			function setView(view){
				
				if(this.currentView){
					animator.animate(view.$el, animator.FADE_OUT);
					this.currentView.close();
				}
				this.currentView = view;
				view.render();
				animator.animate(view.$el, animator.FADE_IN);
			}

			setView(view);
		},
		
		showAddUser : function(){
			var addUserView = new AddUserView();
			this.changeView(addUserView);
			
		},
		showUserList : function(){
			var userListView = new UserListView();
			this.changeView(userListView)
		},
		showHome : function(){
			var navigationView= new NavigationView();
		      navigationView.render();
		      var userListView = new UserListView();
			this.changeView(userListView);
		},

		showLogin : function(){
			var loginView = new LoginView();
			loginView.render();
		},
	});

	return Router;
});