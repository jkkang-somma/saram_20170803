define([
  'jquery',
  'underscore',
  'backbone',
  'animator',
  'core/BaseView',
  'text!templates/commuteListTemplete.html',
  'collection/cm/CommuteCollection',
], function($, _, Backbone, animator, BaseView, commuteListTmp, CommuteCollection){
  var addReportView = BaseView.extend({
    el:$(".main-container"),
   
  	initialize:function(){
  		this.collection = new CommuteCollection();
  		
  		$(this.el).html('');
	    $(this.el).empty();
  	},
  	
    render: function(){
      $(this.el).append(commuteListTmp);
    }
    
  });
  return addReportView;
});