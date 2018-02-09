define([
    'jquery',
    'underscore',
    'backbone',
], function($, _, Backbone) {
    var BookManageCollection = Backbone.Collection.extend({
        url: '/book/manageno',
        initialize: function() {
        }
    });

    return BookManageCollection;
});
