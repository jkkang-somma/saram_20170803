define([
  'jquery',
  'underscore',
  'backbone',
  'models/dashboard/AttendanceModel'
], function($, _, Backbone, AttendanceModel){
    var AttendanceCollection = Backbone.Collection.extend({
        model : AttendanceModel,
        url: '/dashboard/attendance'
    });
    return AttendanceCollection;
});