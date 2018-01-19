define([
    'jquery',
    'underscore',
    'backbone'
], function($, _,Backbone){
    var OfficeItemDetailModel=Backbone.Model.extend({
        urlRoot: '/officeitem/detail',

        idAttribute:"_id",

        initialize: function () {

        },

        default:{
            name : "",
            category_name : "",
            serial_yes : "",
            model_no : "",
            buy_date : ""
        }
    });
    return OfficeItemDetailModel;
});