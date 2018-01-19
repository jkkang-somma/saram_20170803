define([
  'jquery',
  'underscore',
  'backbone',
  'models/officeitem/OfficeItemHistoryModel'
], function(
    $, _, Backbone, OfficeItemHistoryModel
){
    var officeItemHistoryCollection = Backbone.Collection.extend({
        model : OfficeItemHistoryModel,
        url:'/officeitemhistory/history'
    });

    return officeItemHistoryCollection;
});