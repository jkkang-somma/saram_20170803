define([
  'jquery',
  'underscore',
  'backbone',
  'core/BaseView',
  'lib/component/form',
  'models/sm/UserModel',
  'collection/common/CodeCollection',
  'log',
  'dialog',
], function($, _, Backbone, BaseView, Form, UserModel, CodeCollection, log, Dialog){
    var LOG= log.getLogger("EditUserView");
    var EditUserView = BaseView.extend({
    	initialize:function(data){
    		$(this.el).html('');
    	    $(this.el).empty();
    	    
    	    this.model=new UserModel(data);
    	    _.bindAll(this, "submitSave");
    	},
    	render:function(el){
    	    var dfd= new $.Deferred();
    	    var view=this;
    	    var form = new Form();
    	    return dfd.promise();
     	},
    	
    	submitSave : function(e){
    	    
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
    
    return EditUserView;
});