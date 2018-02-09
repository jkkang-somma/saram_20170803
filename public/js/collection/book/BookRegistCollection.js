define([
    'jquery',
    'underscore',
    'backbone',
    'models/book/BookRegistModel'
], function($, _, Backbone, BookRegistModel) {
    var BookRegistCollection = Backbone.Collection.extend({
        model: BookRegistModel,
        url: '/book/regist',
        initialize: function(options) {
            this.options = _.extend({
                isFiltered: true
            }, options);
        }
    });

    return BookRegistCollection;
});
