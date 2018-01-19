define([
    'jquery',
    'underscore',
    'backbone',
    'models/officeitem/OfficeItemDetailModel'
], function($, _, Backbone, OfficeItemDetailModel){
    officeItemDetailModel = Backbone.Collection.extend({
        model: OfficeItemDetailModel,
        url: '/officeitemusage/detail'
    });

    return officeItemDetailModel;

});