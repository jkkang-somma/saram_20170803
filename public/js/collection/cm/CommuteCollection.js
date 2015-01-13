define([
  'jquery',
  'underscore',
  'backbone',
  'models/cm/CommuteModel'
], function($, _, Backbone, commuteModel){
    var commuteCollection = Backbone.Collection.extend({
        model : commuteModel,
        url:'/bulk'
    });
    
    return commuteCollection;
});