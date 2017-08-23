define([
  'jquery',
  'underscore',
  'backbone', 
], function($, _,Backbone){
    var AttendanceModel = Backbone.Model.extend({
        urlRoot: '/dashboard/attendance',
        idAttribute:'_id',
        initialize: function () {
        },
        default: {
            id:undefined,
            name: undefined,
            char_date: undefined,
            type: undefined
        }
    });
    return AttendanceModel;
});
