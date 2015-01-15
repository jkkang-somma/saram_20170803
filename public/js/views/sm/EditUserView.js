define([
  'jquery',
  'underscore',
  'underscore.string',
  'backbone',
  'core/BaseView',
  'log',
  'dialog',
  'i18n!nls/user',
  'lib/component/form',
  'models/sm/UserModel',
  'collection/common/CodeCollection',
  'text!templates/default/input.html',
], function($, _, _S, Backbone, BaseView, log, Dialog, i18nUser, Form, UserModel, CodeCollection, container){
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
    	    if (!_.isUndefined(el)){
    	        this.el=el;
    	    }
    // 	        ID:"Id",
    // DEPT:"Department",
    // NAME_COMMUTE:"Name Commute",
    // JOIN_COMPANY:"Join Date",
    // LEAVE_COMPANY:"Leave Date",
    // PRIVILEGE:"Privilege"
    	    
    	    var _form = new Form({
    	        el:this.el,
    	        form:undefined,
    	        childs:[{
    	                type:"input",
    	                name:"name",
    	                label:i18nUser.NAME,
    	                value:view.model.attributes.name
    	        },{
    	                type:"input",
    	                name:"id",
    	                label:i18nUser.ID,
    	                value:view.model.attributes.id
    	        },{
    	                type:"input",
    	                name:"name_commute",
    	                label:i18nUser.NAME_COMMUTE,
    	                value:view.model.attributes.name_commute
    	        },{
    	                type:"input",
    	                name:"id",
    	                label:i18nUser.ID,
    	                value:view.model.attributes.id
    	        },{
    	                type:"input",
    	                name:"id",
    	                label:i18nUser.ID,
    	                value:view.model.attributes.id
    	        }]
    	    });
    	    
    	    _form.render().done(function(){
    	        dfd.resolve();
    	    }).fail(function(){
    	        dfd.reject();
    	    });
    	    
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