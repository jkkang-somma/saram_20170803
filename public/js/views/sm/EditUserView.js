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
    	                name:"join_company",
    	                label:i18nUser.JOIN_COMPANY,
    	                value:view.model.attributes.join_company
    	        },{
    	                type:"input",
    	                name:"leave_company",
    	                label:i18nUser.LEAVE_COMPANY,
    	                value:view.model.attributes.leave_company
    	        },{
    	                type:"input",
    	                name:"privilege",
    	                label:i18nUser.PRIVILEGE,
    	                value:view.model.attributes.privilege
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