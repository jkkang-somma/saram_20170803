define([
  'jquery',
  'underscore',
  'backbone'
], function($, _,Backbone){
    var WorkingSummaryModel=Backbone.Model.extend({
        urlRoot: '/dashboard/workingSummary',
        idAttribute:"_id",
        initialize: function () {
        }, 
        getCustomUrl: function (method) {//idAttribute값을 사용하지 않고 id로 할때
            switch (method) {
                case 'read':
                    return this.urlRoot;
                    break;
                case 'create':
                    return this.urlRoot;
                    break;
                case 'update':
                    return this.urlRoot;
                    break;
                case 'delete':
                    return this.urlRoot;
                    break;
            }
        },
        sync: function (method, model, options) {
            options || (options = {});
            options.url = this.getCustomUrl(method.toLowerCase());
            return Backbone.sync.apply(this, arguments);
        },
        default:{
            id:undefined,
            name: undefined,
            total_working_day: undefined,
            perception: undefined,
            sick_leave:undefined,
            absenteeism: undefined,
            vacation : undefined,
            night_working_a : undefined,
            night_working_b:undefined,
            night_working_c:undefined,
            holiday_working_a:undefined,
            holiday_working_b:undefined,
            holiday_working_c:undefined,
            total_overtiem_pay:undefined
        },
    });
    return WorkingSummaryModel;
});