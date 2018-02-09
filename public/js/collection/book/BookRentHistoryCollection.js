define([
    'jquery',
    'underscore',
    'backbone',
    'models/book/BookRentHistoryModel'
], function($, _, Backbone, BookRentHistoryModel) {
    var BookRentHistoryCollection = Backbone.Collection.extend({
        model: BookRentHistoryModel,
        url: '/book/history',
        initialize: function() {
            
        }
    });

    return BookRentHistoryCollection;
});