define([
  'jquery',
  'underscore',
  'backbone',
  'models/rm/ApprovalModel'
], function($, _, Backbone, ApprovalModel){
    var ApprovalCollection = Backbone.Collection.extend({
        model : ApprovalModel,
        url:'/approval/list',
        initialize : function(){
        },
        save : function(data, id){
            var wrapperData = { data : this.toJSON() };
            if(!_.isUndefined(data.outOffice)){
                wrapperData.outOffice = data.outOffice;
            }
            if(!_.isUndefined(data.inOffice)){
                wrapperData.inOffice = data.inOffice;
            }
            if(!_.isUndefined(data.commute)){
                wrapperData.commute = data.commute;
            }
            
            this.wrapper = new ApprovalCollectionWrapper(wrapperData);
            if(!_.isUndefined(id)){
                this.wrapper.set({_id : id});
            }
            return this.wrapper.save();
        },
        updateState: function(data){
            var wrapperData = { data : data };

            this.wrapper = new ApprovalCollectionWrapper(wrapperData);
            this.wrapper.set({_id : 'updateState'});
            
            return this.wrapper.save();
        }
    });
    var ApprovalCollectionWrapper = Backbone.Model.extend({
        url:'/approval/bulk',
        idAttribute:"_id",
    })
    return ApprovalCollection;
});