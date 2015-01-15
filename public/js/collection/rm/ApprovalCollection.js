define([
  'jquery',
  'underscore',
  'backbone',
  'models/rm/ApprovalModel'
], function($, _, Backbone, ApprovalModel){
    var ApprovalCollection = Backbone.Collection.extend({
        model : ApprovalModel,
        url:'/approval/list',
        initialize : function(){
        }
    });
    
    return ApprovalCollection;
});