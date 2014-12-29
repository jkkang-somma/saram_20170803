define([
  'jquery',
  'underscore',
  'backbone',
  'core/BaseView',
  'text!templates/userlistTemplate.html',
  'collection/sm/UserCollection'
], function($, _,Backbone, BaseView, userlistTemplate, UserCollection){
    var UserListView = BaseView.extend({
        el:$(".main-container"),
        
    	initialize:function(){
     		this.collection = new UserCollection();
    		
    		$(this.el).html('');
    	    $(this.el).empty();
    	},
    	render:function(){
            $(this.el).append(userlistTemplate);
            
    		var userListTable = $(this.el).find('#userListTable');
    		
    		this.collection.fetch({
    		    success : function(data){
            		for(var i =0; i<data.length; i++){
            		    var tr = $('<tr>');
            		    tr.append('<td>'+data.models[i].attributes.id+'</td>');
            		    tr.append('<td>'+data.models[i].attributes.name+'</td>');
            		    tr.append('<td>'+data.models[i].attributes.department+'</td>');
            		    tr.append('<td>'+data.models[i].attributes.name_commute+'</td>');
            		    tr.append('<td>'+data.models[i].attributes.join_company+'</td>');
            		    userListTable.append(tr);
            		}
    		    }   
    		});
     	}
    });
    
    return UserListView;
});