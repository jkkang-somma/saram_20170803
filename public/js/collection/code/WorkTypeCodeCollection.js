define([
  'jquery',
  'underscore',
  'backbone',
  'models/code/WorkTypeCodeModel'
], function($, _, Backbone, WorkTypeCodeModel){
    var WorkTypeCodeCollection = Backbone.Collection.extend({
        url:'/codev2/worktype',
        initialize: function() {
        },
        model : WorkTypeCodeModel
    });
    return WorkTypeCodeCollection;
});