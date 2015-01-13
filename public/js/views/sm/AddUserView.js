define([
  'jquery',
  'underscore',
  'backbone',
  'core/BaseView',
  'text!templates/adduserTemplate.html',
  'models/sm/UserModel',
  'collection/common/CodeCollection',
  'log',
  'dialog',
], function($, _, Backbone, BaseView, adduserTemplate, UserModel, CodeCollection, log, Dialog){
    var LOG= log.getLogger("AddUserView");
    var AddUserView = BaseView.extend({
    	initialize:function(){
    		$(this.el).html('');
    	    $(this.el).empty();
    	    _.bindAll(this, "submitAdd");
    	},
    	render:function(el){
    	    var dfd= new $.Deferred();
    	    var view=this;
    	    if (!_.isUndefined(el)){
    	        this.el=el;
    	    }
    	    var codeCollection= new CodeCollection("dept");
    	    codeCollection.fetch().done(function(result){
    	        
    	        var _adduserTemplate= $(adduserTemplate);
    	        var codeList =result;
    	        
                _adduserTemplate.find("#departmentSelector").append("<option></option>");
    	        if (!_.isUndefined(codeList)){
                    for (var index in codeList){
                        var code=codeList[index];
                        _adduserTemplate.find("#departmentSelector").append("<option value='"+code.code+"'>"+code.name+"</option>");
                        
                    }    	       
    	        }
    	        $(view.el).append(_adduserTemplate);
    	        
    	        view.collection=codeCollection;
    	        dfd.resolve();
    	    }).fail(function(e){
    	        LOG.error(e.responseJSON.message);
    	        Dialog.error("CodeCollection loading fail.");
    	        dfd.reject();
    	    });
    	    return dfd.promise();
     	},
    	
    	submitAdd : function(e){
    	    var view = this;
    	    var dfd= new $.Deferred();
    	    var _userModel=new UserModel(this.getFormData( $(this.el).find('form')));
    	    _userModel.on("invalid", function(model, error) {
                Dialog.warning(error);  
            });
    	    _userModel.save({},{
    	        success:function(model, xhr, options){
    	            
    	            //view.collection
    	            var codeList= view.collection.models;
    	            var modelArr=_.pluck(codeList, "attributes");
    	            //var keyArr=_.pluck(models, "code");
    	            var findArr=_.filter(modelArr, function(obj){ 
    	                return obj.code==model.attributes.dept_code;
    	            });

    	            var deptName=findArr[0].name; 
    	            model.attributes.dept_name = deptName;
    	            model.attributes.leave_company ="";
    	            model.attributes.privilege ="0";
    	            dfd.resolve(model);
    	        },
    	        error:function(model, xhr, options){
    	            var respons=xhr.responseJSON;
    	            Dialog.error(respons.message);
    	            dfd.reject();
    	        },
    	        wait:false
    	    });
    	    return dfd.promise();
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