define([
  'jquery',
  'underscore',
  'backbone',
  'models/cm/CommuteModel'

], function($, _, Backbone, commuteModel){
    var CommuteCollection = Backbone.Collection.extend({
        model : commuteModel,
        url:'/bulk'
    });
    
    return CommuteCollection;
});