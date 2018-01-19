define([
    'jquery',
    'underscore',
    'backbone'
], function($, _,Backbone){
    var OfficeItemUsageModel=Backbone.Model.extend({
        urlRoot: '/officeitem/usage',

        idAttribute:"_id",

        initialize: function () {

        },

        default:{
            id : "",
            name : "",
            dept : "",
            desctop : "",
            monitor : "",
            ip : "",
            notebook : "",
            leave_company : ""
        }
    });
    return OfficeItemUsageModel;
});