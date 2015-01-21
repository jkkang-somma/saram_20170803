define([
  'jquery',
  'underscore',
  'backbone',
  'models/code/OfficeCodeModel'
], function($, _, Backbone, OfficeCodeModel){
    var OfficeCodeCollection = Backbone.Collection.extend({
        url:'/codev2/office',
        initialize: function() {
        },
        model : OfficeCodeModel
    });
    return OfficeCodeCollection;
});