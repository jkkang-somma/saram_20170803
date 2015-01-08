define([
  'jquery',
  'underscore',
  'backbone',
  'core/BaseView',
  'text!templates/addHolidayTemplate.html',
  'models/am/HolidayModel'
  
], function($, _, Backbone, BaseView, addholidayTemplate, HolidayModel){
    var AddHolidayView = BaseView.extend({
        el:$(".main-container"),
        
        events:{
    		"click #addHolidayCommit":"submitAdd"
    	},
    	
    	initialize:function(){
    		$(this.el).html('');
    	    $(this.el).empty();
    	},
    	
    	render:function(){
    		$(this.el).append(addholidayTemplate);
    		
     	},
    	
    	submitAdd : function(e){
    	    this.model = new HolidayModel(this.getFormData( this.$el.find('form')));
    	    this.model.save();
    	    return false;
    	    
    	},
    	
    	getFormData: function(form) {
    	    var unindexed_array = form.serializeArray();
    	    var indexed_array= {};
    	    
    	    $.map(unindexed_array, function(n, i){
                indexed_array[n['name']] = n['value'];
            });
            
            return indexed_array;
    	}
    	
    });
    
    return AddHolidayView;
});