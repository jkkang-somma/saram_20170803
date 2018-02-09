define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone) {
    var BookRentModel = Backbone.Model.extend({
        url: '/book/rent',
        idAttribute: "_id",
        initialize: function(data) {
        },
        defaults: {
            rent_id: "",
            book_id: "",
            user_id: "",
            rent_date: "",
            due_date: "",
            modify_date: "",
            state: ""
        }
    });
    return BookRentModel;
});
