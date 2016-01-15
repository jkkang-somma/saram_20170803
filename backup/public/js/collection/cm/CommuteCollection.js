define([
  'jquery',
  'underscore',
  'backbone',
  'models/cm/CommuteModel',
  'collection/cm/ChangeHistoryCollection'
], function($, _, Backbone,
    commuteModel, ChangeHistoryCollection){
        
    var CommuteCollection = Backbone.Collection.extend({
        model : commuteModel,
        url:'/commute',
        save : function(option, id, changeHistoryColelction){
            this.wrapper = new CommuteCollectionWrapper({data : this.toJSON()});
            if(!_.isUndefined(id)){
                this.wrapper.set({_id:id, changeHistory: changeHistoryColelction.toJSON() });
            }
            this.wrapper.save({}, option);
        },
        fetchDate : function(date){
            return this.fetch({data : {date:date}});
        }
    });
    var CommuteCollectionWrapper = Backbone.Model.extend({
        url:'/commute/bulk',
        idAttribute:"_id",
    })
    return CommuteCollection;
});