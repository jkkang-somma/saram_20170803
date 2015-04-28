define([ 
	'jquery',
	'underscore',
	'backbone',
	'util',
	'i18n!nls/common',
	'text!templates/default/file.html',
	'views/component/ProgressbarView',
], function(
	$, _, Backbone, Util, i18nCommon,
	FileFormHTML,
	ProgressbarView
) {
	var AddRawDataAddPopupView = Backbone.View.extend({
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
    	    var _fileForm=$(_.template(FileFormHTML)({label : i18nCommon.ADD_RAW_DATA.ADD_DIALOG.FORM.FILE, id:"AddRawDataFileForm", accept:".csv"}));
    	    
            $(this.el).append(_fileForm);
            $(this.el).append(this.progressBar.render());
			$(this.el).find("#AddRawDataFileForm").change(this.test);
			
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
	
	return AddRawDataAddPopupView;
});