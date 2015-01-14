define([ 
	'jquery',
	'underscore',
	'backbone',
	'util',
	'text!templates/inputForm/file.html',
	'text!templates/component/progressbar.html',
], function($, _, Backbone, Util, FileFormHTML, ProgressbarHTML) {
	var ChangeHistoryPopupView = Backbone.View.extend({
		initialize : function() {

		},
		events : {

		},
		render : function(el) {
			var dfd= new $.Deferred();
            
            if (!_.isUndefined(el)){
    	        this.el=el;
    	    }
    	    var _progressBar=$(_.template(ProgressbarHTML)({percent : 100}));
    	    var _fileForm=$(_.template(FileFormHTML)({label : "출입 기록 (CSV)", id:"AddRawDataFileForm", accept:".csv"}));
    	    
            $(this.el).append(_fileForm);
            $(this.el).append(_progressBar);

            dfd.resolve();
            return dfd.promise();
		}
	});
	
	return ChangeHistoryPopupView;
});