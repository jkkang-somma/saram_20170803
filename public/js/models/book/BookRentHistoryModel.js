define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone) {
    var BookRentHistoryModel = Backbone.Model.extend({
        urlRoot: '/book',
        initialize: function() {

        },
        defaults: {
            history_id: "",
            user_id: "",
            book_name: "",
            author: "",
            publisher: "",
            img_src: "",
            manage_no: "",
            state: "",
            modify_date: "",
        }
    });
    return BookRentHistoryModel;
});
