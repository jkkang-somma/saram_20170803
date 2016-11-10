define([
  'jquery',
  'underscore',
  'backbone',
  'models/sm/PartModel'
], function($, _, Backbone, PartModel){
    var PartCollection = Backbone.Collection.extend({
        model : PartModel,
        url:'/part/list'
    });
    
    return PartCollection;
});