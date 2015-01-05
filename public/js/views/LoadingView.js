define([
  'jquery',
  'underscore',
  'backbone',
  'log', 
  'util',
  //'fittext', 
 // 'lettering', 
  //'textillate', 
  'core/BaseView',
  'text!templates/loadingTemplate.html',
  'text!templates/cubeTemplate.html',
  'css!cs/loding.css',
], function($, _,Backbone, log, Util,
//fittext, lettering, textillate,
BaseView, loadingTemplate, cubeTemplate){
    var LOG=log.getLogger("LODING");
    var LoadingView = BaseView.extend({
        el:$(".loading-container"),
    	initialize:function(){
    		_.bindAll(this, 'render');
    		_.bindAll(this, 'disable');
    	},
    	render:function(){
    		$(this.el).append(cubeTemplate);
    		$(this.el).append(loadingTemplate);
    		//var users=this.model.toJSON();
   // 		for (var i=0; i < users.length; i++){
   // 			$('.loding-msg > .texts').append("<li>"+users[i].name+"님이 출근 하셨습니다.</li>");
   // 		}
   // 		$(".loding-msg").textillate({
			// 	loop: true,
			// 	minDisplayTime: 2000,
			// 	initialDelay: 0,
			// 	autoStart: true,
			// 	outEffects: [ 'hinge' ],
			// 	in:{
			// 		effect:"bounceIn",
			// 	    delayScale: 1.5,
			// 	    delay: 50,
			// 	    sync: false,
			// 	    shuffle: true,
			// 	    reverse: false,
			// 	    callback: function () {}
			// 	},
			// 	out:{
			// 		effect: 'rotateOutDownLeft',
			// 	    delayScale: 1.5,
			// 	    delay: 50,
			// 	    sync: false,
			// 	    shuffle: true,
			// 	    reverse: false,
			// 	    callback: function () {}	
			// 	}
			// });
    	},
    	disable:function(callback){
    		var view=this;
			$(this.el).fadeOut( 1000, function() {
    			view.close();
    			if (Util.isNotNull(callback)&& _.isFunction(callback)){
    				callback();
    			}
			});
    	}
    });
    return LoadingView;
});