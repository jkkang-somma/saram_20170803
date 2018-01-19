define([
  'jquery',
  'underscore',
  'backbone',
  'models/officeitem/OfficeItemCodeModel'
], function(
    $, _, Backbone, OfficeItemCodeModel
){
    var officeItemCodeCollection = Backbone.Collection.extend({
        model : OfficeItemCodeModel,
        url:'/officeitemcode/list'
    });

    return officeItemCodeCollection;
});