define([
  'jquery',
  'underscore',
  'backbone',
  'models/sm/DepartmentModel'
], function($, _, Backbone, DepartmentModel){
    var DepartmentCollection = Backbone.Collection.extend({
        model : DepartmentModel,
        url:'/department/list'
    });
    
    return DepartmentCollection;
});