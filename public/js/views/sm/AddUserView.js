define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/adduserTemplate.html',
  'models/sm/UserModel'
  
], function($, _, Backbone, adduserTemplate, UserModel){
    var AddUserView = Backbone.View.extend({
        el:$(".mid-container"),
        
        events:{
    		"click #addUserCommit":"submitAdd"
    	},
    	
    	initialize:function(){
    		_.bindAll(this, 'render');
    		_.bindAll(this, 'submitAdd');
    		_.bindAll(this, 'close');
    		
    		
    		this.model = new UserModel();
            
            
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
    	},
    	
    	close: function(){
    	    this.undelegateEvents();
            this.$el.removeData().unbind(); 
    	}
    	
    });
    
    return AddUserView;
});