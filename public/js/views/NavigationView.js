define([
  'jquery',
  'underscore',
  'backbone',
  'animator',
  'core/BaseView',
  'text!templates/navigation.html',
], function($, _, Backbone, animator, BaseView, navigation){
  var NavigationView = BaseView.extend({
    el: "#mainNavigation",
  	initialize:function(){
  		_.bindAll(this, 'render');
  		_.bindAll(this, 'show');
  		_.bindAll(this, 'hide');
  	},
    render: function(){
      $(this.el).append(navigation);
      animator.animate(this.el, animator.FADE_IN_DOWN);
    },
    show:function(){
      var _view=this;
      $(_view.el).fadeIn();
    },
    hide:function(callback){
      var _view=this;
      $(_view.el).fadeOut();
    }
  });
  return NavigationView;
});