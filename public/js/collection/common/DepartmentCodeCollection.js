define([
  'jquery',
  'underscore',
  'backbone',
  'models/common/DepartmentCodeModel'
], function($, _, Backbone, DepartmentCodeModel){
    var DepartmentCodeCollection = Backbone.Collection.extend({
        url:'/department',
        initialize: function(options) {
        },
        model : DepartmentCodeModel
    });
    return DepartmentCodeCollection;
});