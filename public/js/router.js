// Author: sanghee park <novles@naver.com>
// Create Date: 2014.12.18
define([
  'jquery',
  'underscore',
  'backbone',
  //'views/SaramView',
  //'views/sm/SecurityView'
], function($, _, Backbone) {
  
  var AppRouter = Backbone.Router.extend({
    routes: {
      '*actions': 'defaultAction'
    }
  });
  
  var initialize = function(){
    // var app_router = new AppRouter;
    
    // app_router.on('route:securityManaber', function(){
    //     var SecurityView = new SecurityView();
    //     SecurityView.render();

    // });
    // app_router.on('route:defaultAction', function (actions) {
    //     var SaramView = new SaramView();
    //     SaramView.render();
    // });
    Backbone.history.start();
  };
  return { 
    initialize: initialize
  };
});