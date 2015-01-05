define([
  'jquery',
  'underscore',
  'backbone',
  'core/BaseView',
  'text!templates/adduserTemplate.html',
  'models/sm/UserModel'
  
], function($, _, Backbone, BaseView, adduserTemplate, UserModel){
    var AddUserView = BaseView.extend({
        el:$(".main-container"),
        
        events:{
    		"click #addUserCommit":"submitAdd"
    	},
    	
    	initialize:function(){
    		$(this.el).html('');
    	    $(this.el).empty();
    	},
    	
    	render:function(){
    		$(this.el).append(adduserTemplate);
    		
     	},
    	
    	submitAdd : function(e){
    	    this.model = new UserModel(this.getFormData( this.$el.find('form')));
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
    
    return AddUserView;
});