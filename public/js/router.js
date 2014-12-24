// Author: sanghee park <novles@naver.com>
// Create Date: 2014.12.18
define([
  'jquery',
  'underscore',
  'backbone',
  'animator',
  'views/LoginView',
  'views/sm/UserListView',
  'views/sm/AddUserView',
  
  'views/SaramView',
//  'views/sm/SecurityView'
], function($, _, Backbone,animator, UserListView, AddUserView, SaramView) {
  
  var AppRouter = Backbone.Router.extend({
    routes: {
      'usermanager/add' : 'AddUser',
      'usermanager' : 'UserManager',
      '*actions' : 'defaultAction'
    }
  });
  
  var initialize = function(){
    
    var dfd = $.Deferred();
    var mainContainer=$('.mid-container');
    dfd.resolve("hello world");
    
    var app_router = new AppRouter();
    var currentView;
    
    var renderView = function(view){
      animator.animate(mainContainer, animator.FADE_OUT);
        if(currentView){
          currentView.close();
        }	
        currentView = new view();
        currentView.render();
      animator.animate(mainContainer, animator.FADE_IN);	
    };
    
    app_router.on('route:UserManager', function(){
      renderView(UserListView);
    });
    
    app_router.on('route:AddUser', function(){
      renderView(AddUserView);
    });
    
    Backbone.history.start();
    return dfd.promise();
  };
  return { 
    initialize: initialize
  };
});