define([
  'jquery',
  'underscore',
  'backbone'
], function($, _,Backbone){
    var ErrorModel=Backbone.Model.extend({
        idAttribute:"seq",
        initialize: function () {
        },
        default:{ 
            modul: null, 
            msg: '',
            fail_reson: '',
            callback: function(){}
        }
    });
    return ErrorModel;
});