define([
  'jquery',
  'underscore',
  'backbone',
  'animator',
  'text!templates/navigation.html',
], function($, _, Backbone, animator, navigation){
  var NavigationView = Backbone.View.extend({
    el: $(".top-container"),
  	initialize:function(){
  		_.bindAll(this, 'render');
  	},
    render: function(){
      $(this.el).append(navigation);
      animator.animate(this.el, animator.FADE_IN_DOWN);
    }
  });
  return NavigationView;
});