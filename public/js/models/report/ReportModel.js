define([
  'jquery',
  'underscore',
  'backbone'
], function($, _,Backbone){
	
    var ReportModel = Backbone.Model.extend({
        urlRoot: '/report',
        idAttribute:"_id",
        initialize: function () {
        },
        defaults:{
        	year: "",		// 휴가 사용 년도 
        },
        commuteYearReportUrl: function() {
          	this.url = this.urlRoot + "/commuteYearReport";
        	return this;
        }
    });
    
    return ReportModel;
});