define([
  'jquery',
  'underscore',
  'backbone',
  'core/BaseView',
  'text!templates/createdataTemplate.html',
], function($, _,Backbone, BaseView, createdataTemplate){
    var CreateDataView = BaseView.extend({
        el:$(".main-container"),
        
    	initialize:function(){
    		$(this.el).html('');
    	    $(this.el).empty();
    	},
    	render:function(){
            $(this.el).append(createdataTemplate);

     	}
    });
    
    return CreateDataView;
});