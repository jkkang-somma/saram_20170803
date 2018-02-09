define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone) {
    var BookModel = Backbone.Model.extend({
        url: '/book/library',
         idAttribute: "_id",
        initialize: function() {
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
            isbn: "",
        }
    });
    return BookModel;
});
