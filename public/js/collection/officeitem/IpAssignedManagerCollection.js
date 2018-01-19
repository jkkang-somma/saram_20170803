define([
    'jquery',
    'underscore',
    'backbone',
    'models/officeitem/IpAssignedManagerModel'
], function($, _, Backbone, IpAssignedManagerModel){
    var IpAssignedManagerModel = Backbone.Collection.extend({
        // initialize: function(options) {
        //     var URL='/IpAssignedManager/IPsearch';
        //     if (!_.isUndefined(options)){
        //         url=URL;
        //         if (_.isString(options)){
        //             url=URL+"/"+ options;
        //         }
        //     }
        // },
        model : IpAssignedManagerModel,
        url:'/IpAssignedManager/IPsearch'
    });
    return IpAssignedManagerModel;
});