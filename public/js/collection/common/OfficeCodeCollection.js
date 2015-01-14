define([
  'jquery',
  'underscore',
  'backbone',
  'models/common/OfficeCodeModel'
], function($, _, Backbone, OfficeCodeModel){
    var OfficeCodeCollection = Backbone.Collection.extend({
        url:'/officeCode',
        initialize: function(options) {
        },
        model : OfficeCodeModel
    });
    return OfficeCodeCollection;
});