define([
  'jquery',
  'underscore',
  'backbone',
  'models/officeitem/OfficeItemModel',
], function($, _, Backbone, OfficeItemModel){
    var OfficeItemCollection = Backbone.Collection.extend({
        model : OfficeItemModel,
        url:'/officeitemmanager/list'
    });
    
    return OfficeItemCollection;
});