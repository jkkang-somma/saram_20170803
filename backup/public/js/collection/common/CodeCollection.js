define([
  'jquery',
  'underscore',
  'backbone',
  'models/common/CodeModel'
], function($, _, Backbone, CodeModel){
    var CodeCollection = Backbone.Collection.extend({
        initialize: function(options) {
            var URL='/code/list';
            if (!_.isUndefined(options)){
                this.url=URL;
                if (_.isString(options)){
                    this.url=URL+"/"+options;
                }
            }
        },
        model : CodeModel
    });
    return CodeCollection;
});