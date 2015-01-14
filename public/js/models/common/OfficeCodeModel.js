// Author: sanghee park <novles@naver.com>
// Create Date: 2014.12.18
define([
  'jquery',
  'underscore',
  'backbone'
], function($, _,Backbone){
    var OfficeCodeModel=Backbone.Model.extend({
        urlRoot: '/officeCode',
        idAttribute:"_id",
        initialize: function () {
        },
        default:{ 
            code:"",
            name:"",
            day_count:""
        }
    });
    
    return OfficeCodeModel;
});