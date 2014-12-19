define([
  'jquery',
  'underscore',
  'backbone',
  'fittext', 
  'lettering', 
  'textillate', 
  'text!templates/lodingTemplate.html',
  'text!templates/cubeTemplate.html',
  'collection/sm/UserCollection',
  'css!cs/animate.css',
  'css!cs/style.css',
  'css!cs/loding.css',
], function($, _,Backbone, fit, lettering, textillate, lodingTemplate, cubeTemplate, UserCollection){
    var LodingView = Backbone.View.extend({
        el:$(".loding-container"),
    	initialize:function(){
    		_.bindAll(this, 'render');
    		_.bindAll(this, 'close');
    	},
    	render:function(){
    		$(this.el).append(cubeTemplate);
    		$(this.el).append(lodingTemplate);
    		
    		var users= new UserCollection();
    		users.fetch();
    		
    		//$(this.el).find('.texts').append();
    		$(".loding-msg").textillate({
				loop: true,
				minDisplayTime: 2000,
				initialDelay: 0,
				autoStart: true,
				outEffects: [ 'hinge' ],
				in:{
					effect:"bounceIn",
				    delayScale: 1.5,
				    delay: 50,
				    sync: false,
				    shuffle: true,
				    reverse: false,
				    callback: function () {}
				},
				out:{
					effect: 'rotateOutDownLeft',
				    delayScale: 1.5,
				    delay: 50,
				    sync: false,
				    shuffle: true,
				    reverse: false,
				    callback: function () {}	
				}
			});
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
    return LodingView;
});