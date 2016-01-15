define([
  'jquery',
  'underscore',
  'backbone'
], function($, _,Backbone){
	
    var ApprovalIndexModel = Backbone.Model.extend({
        urlRoot: '/approval/appIndex/add',
        idAttribute:"_id",
        initialize: function () {
        },
        default:{
            yearmonth : null,
            seq : null
        },
    });
    
    return ApprovalIndexModel;
});