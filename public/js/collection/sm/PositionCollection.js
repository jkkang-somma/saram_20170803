define([
  'jquery',
  'underscore',
  'backbone',
  'models/sm/PositionModel'
], function($, _, Backbone, PositionModel){
    var PositionCollection = Backbone.Collection.extend({
        model : PositionModel,
        url:'/position/list'
    });
    
    return PositionCollection;
});