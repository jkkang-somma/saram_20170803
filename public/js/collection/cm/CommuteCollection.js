define([
  'jquery',
  'underscore',
  'backbone',
  'models/cm/CommuteModel'

], function($, _, Backbone, commuteModel){
    var CommuteCollection = Backbone.Collection.extend({
        model : commuteModel,
        url:'/commute',
        save : function(option, data){
            this.wrapper = new CommuteCollectionWrapper(this.toJSON());
            this.wrapper.save({}, option);
        },
        fetchDate : function(date){
            this.fetch({data : {date:date}});
        }
    });
    var CommuteCollectionWrapper = Backbone.Model.extend({
        url:'/commute/bulk',
    })
    return CommuteCollection;
});