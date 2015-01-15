// Author: sanghee park <novles@naver.com>
// Create Date: 2014.12.18
define([
  'jquery',
  'underscore',
  'backbone'
], function($, _,Backbone){
    var DepartmentCodeModel=Backbone.Model.extend({
        urlRoot: '/department',
        idAttribute:"_id",
        initialize: function () {
        },
        default:{ 
            code:"",
            name:""
        }
    });
    
    return DepartmentCodeModel;
});