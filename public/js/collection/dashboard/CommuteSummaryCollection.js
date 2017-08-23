define([
    'jquery',
    'underscore',
    'backbone',
    'models/dashboard/CommuteSummaryModel'
], function($, _, Backbone, CommuteSummaryModel) {
    var CommuteSummaryCollection = Backbone.Collection.extend({
        model : CommuteSummaryModel,
        url: '/dashboard/commuteSummary'
    });
    return CommuteSummaryCollection;
});