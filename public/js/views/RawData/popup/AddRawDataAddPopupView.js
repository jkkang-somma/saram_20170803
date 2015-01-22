define([ 
	'jquery',
	'underscore',
	'backbone',
	'util',
	'text!templates/inputForm/file.html',
	'text!templates/component/progressbar.html',
	'views/component/ProgressbarView',
], function(
	$, _, Backbone, Util,
	FileFormHTML, ProgressbarHTML,
	ProgressbarView
) {
	var ChangeHistoryPopupView = Backbone.View.extend({
		initialize : function() {

		},
		events : {
			
		},
		test : function(event){
			console.log();
		},
		render : function(el) {
			var dfd= new $.Deferred();
            
            if (!_.isUndefined(el)){
    	        this.el=el;
    	    }
    	    this.progressBar= new ProgressbarView();
    	    var _fileForm=$(_.template(FileFormHTML)({label : "출입 기록 (CSV)", id:"AddRawDataFileForm", accept:".csv"}));
    	    
            $(this.el).append(_fileForm);
            $(this.el).append(this.progressBar.render());
			$(this.el).find("#AddRawDataFileForm").change(this.test)
			
            dfd.resolve();
            return dfd.promise();
		},
		setProgressDisabled : function(flag){
			this.progressBar.disabledProgressbar(flag);
		},
		setProgresPercent : function(percent){
			this.progressBar.setPercent(percent);
		}
	});
	
	return ChangeHistoryPopupView;
});