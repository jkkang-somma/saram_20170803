define([
  'jquery',
  'underscore',
  'backbone'
], function($, _,Backbone){
    var RawDataModel=Backbone.Model.extend({
        urlRoot: '/rawdata',
        
        idAttribute:"_id",
        
        initialize: function () {
            
        },
        companyAccessUrl: function() {
        	this.url = "/companyAccess";
        	return this;
        },
        default:{ 
            year: null,
            id : null,
            name : null,
            department : null,
            char_date: null,
            type: null,
            ip_pc: null,
            ip_office: null,
            need_confirm: 1 // 1: 정상 , 2: 확인 필요
        },
        
    });
    
    return RawDataModel;
});