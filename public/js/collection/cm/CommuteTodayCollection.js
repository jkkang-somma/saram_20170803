define([
  'jquery',
  'underscore',
  'backbone',
  'models/cm/CommuteTodayModel'
], function($, _, Backbone, CommuteTodayModel){
    var commuteTodayModel = Backbone.Collection.extend({
        model : CommuteTodayModel,
        url:'/commute/today'
    });
    
    return commuteTodayModel;

    // var commuteTodayCollection = Backbone.Collection.extend({
    //     model : CommuteTodayModel,
    //     url:'/commute/today',
    //     save : function(option, id, commuteTodayColelction){
    //         this.wrapper = new CommuteTodayCollectionWrapper({data : this.toJSON()});
    //         if(!_.isUndefined(id)){
    //             this.wrapper.set({_id:id, commuteToday: commuteTodayColelction.toJSON() });
    //         }
    //         this.wrapper.save({}, option);
    //     },
    //     fetchDate : function(date){
    //         return this.fetch({data : {date:date}});
    //     }
    // });
    // var CommuteTodayCollectionWrapper = Backbone.Model.extend({
    //     url:'/commute/today/bulk',
    //     idAttribute:"_id",
    // })
    // return commuteTodayCollection;
});