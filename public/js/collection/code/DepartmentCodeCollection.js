define([
  'jquery',
  'underscore',
  'backbone',
  'models/code/DepartmentCodeModel'
], function($, _, Backbone, DepartmentCodeModel){
    var DepartmentCodeCollection = Backbone.Collection.extend({
        url:'/codev2/department',
        initialize: function() {
        },
        model : DepartmentCodeModel
    });
    return DepartmentCodeCollection;
});