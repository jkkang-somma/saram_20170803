define([
  'jquery',
  'underscore',
  'backbone', 
], function($, _,Backbone){
    var CommuteSummaryModel = Backbone.Model.extend({
        urlRoot: '/dashboard/commuteSummary',
        idAttribute:'_id',
        initialize: function () {
        },

        default: {
            id:undefined,
            name: undefined,
            date: undefined,
            work_type: undefined,
            vacation_code: undefined,
            out_office_code: undefined,
            overtime_code: undefined
        }
    });
    return CommuteSummaryModel;
});