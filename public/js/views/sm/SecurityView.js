define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/adduserTemplate.html',
  /*'text!templates/cubeTemplate.html',
  'css!cs/animate.css',
  'css!cs/style.css',
  'css!cs/loding.css',*/
], function(Template, _,$ ,Backbone ){
    var SecurityView = Backbone.View.extend({
        el:$(".main-container"),
    	initialize:function(){
    		_.bindAll(this, 'render');
    		_.bindAll(this, 'close');
    	},
    	render:function(){
    		$(this.el).append(adduserTemplate);
     	},
    	events:{
    		"click":"close"
    	},
    	close:function(){
    		$(this.el).fadeOut( "slow", function() {
			 	this.remove();
			});
    	}
    });
    return SecurityView;
});