// Author: sanghee park <novles@naver.com>
// Create Date: 2014.12.18
define([
  'jquery',
  'underscore',
  'backbone',
  'log',
  'views/NavigationView',
  'views/sm/UserListView',
], function($, _, Backbone, log, NavigationView, UserListView){
  var LOG=log.getLogger("SaramView");
  var SaramView = Backbone.View.extend({
    el: $(".main-container"),
  	initialize:function(options){
  	  LOG.debug('initialize.....');
  	  _.extend(this, _.pick(options, "affterInitialize"));
  		_.bindAll(this, 'render');
  		_.bindAll(this, 'affterInitialize');
  		this.render();
  		this.affterInitialize();
  	},
    render: function(){
      LOG.debug('render.....');
      var navigationView= new NavigationView();
      navigationView.render();
      var userListView= new UserListView();
      userListView.render();
      
  		this.affterInitialize();
    },
    affterInitialize:function(){
      LOG.debug('affterInitialize.....');
      this.options.affterInitialize();  
    }
  });
  return SaramView;
});