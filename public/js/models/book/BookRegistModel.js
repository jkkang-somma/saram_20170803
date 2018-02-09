define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone) {
    var BookRegistModel = Backbone.Model.extend({
        urlRoot: '/book',
        idAttribute: "_id",
        initialize: function(data) {
        },
        defaults: {
            book_id: "",
            category_1: "",
            category_2: "",
            manage_no: "",
            book_name: "",
            author: "",
            publisher: "",
            publishing_date: "",
            img_src: "",
            isbn: ""
        }
    });
    return BookRegistModel;
});
