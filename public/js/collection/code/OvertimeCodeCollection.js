define([
  'jquery',
  'underscore',
  'backbone',
  'models/code/OvertimeCodeModel'
], function($, _, Backbone, OvertimeCodeModel){
    var OvertimeCodeCollection = Backbone.Collection.extend({
        url:'/codev2/overtime',
        initialize: function() {
        },
        model : OvertimeCodeModel
    });
    return OvertimeCodeCollection;
});