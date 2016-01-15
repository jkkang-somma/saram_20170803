define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/navigation.html',
], function($, _, Backbone, navigation){
  var NavigationView = Backbone.View.extend({
    el: $(".side-container"),
  	initialize:function(){
  		_.bindAll(this, 'render');
  	},
    render: function(){
      $(this.el).html(navigation);
    }
  });
  return NavigationView;
});