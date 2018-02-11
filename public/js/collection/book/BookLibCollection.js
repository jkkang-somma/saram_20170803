define([
    'jquery',
    'underscore',
    'backbone',
    'models/book/BookModel'
], function($, _, Backbone, BookModel) {
    var BookLibCollection = Backbone.Collection.extend({
        model: BookModel,
        url: '/book/library',
        initialize: function(options) {
            this.options = _.extend({
                isFiltered: true
            }, options);
        },
        filterByCategory: function(rule, first) {

            if (first)
                this.origModels = this.models;
            
            if (rule.category_1 == 'all') {
                this.models = this.origModels;
            }
            else {
                this.models = this.origModels;
                this.filterModels = this.where(rule);
                this.models = this.filterModels;
            }
            this.reset(this.models);
        }
    });

    return BookLibCollection;
});
