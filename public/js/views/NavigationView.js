define([
  'jquery',
  'underscore',
  'backbone',
  'animator',
  'core/BaseView',
  'text!templates/navigation.html',
], function($, _, Backbone, animator, BaseView, navigation){
  var NavigationView = BaseView.extend({
    el: $(".nav"),
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