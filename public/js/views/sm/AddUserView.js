define([
  'jquery',
  'underscore',
  'backbone',
  'core/BaseView',
  'text!templates/adduserTemplate.html',
  'models/sm/UserModel',
  'dialog',
], function($, _, Backbone, BaseView, adduserTemplate, UserModel, Dialog){
    var AddUserView = BaseView.extend({
    	initialize:function(){
    		$(this.el).html('');
    	    $(this.el).empty();
    	    _.bindAll(this, "submitAdd");
    	},
    	render:function(el){
    	    if (!_.isUndefined(el)){
    	        this.el=el;
    	    }
    		$(this.el).append(adduserTemplate);
     	},
    	
    	submitAdd : function(e){
    	    var _userModel=new UserModel(this.getFormData( $(this.el).find('form')));
    	    _userModel.on("invalid", function(model, error) {
                Dialog.warning(error);  
            });
    	    _userModel.save();
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