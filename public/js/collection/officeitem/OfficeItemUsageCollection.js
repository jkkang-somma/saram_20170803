define([
    'jquery',
    'underscore',
    'backbone',
    'models/officeitem/OfficeItemUsageModel'
], function($, _, Backbone, OfficeItemUsageModel){
    officeItemUsageModel = Backbone.Collection.extend({
        model: OfficeItemUsageModel,
        url: '/officeitemusage/usage'
    });

    return officeItemUsageModel;

});