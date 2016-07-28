define([ 
	'jquery',
	'underscore',
	'backbone',
	'util',
	'cmoment',
	'comboBox',
	'dialog',
	'data/document',
	'lib/component/form',
	'text!templates/default/rowbutton.html',
	'collection/sm/DocumentCollection',
	'models/sm/DocumentModel',
], function($, _, Backbone, Util, Moment, ComboBox, Dialog, Doc, Form, RowButtonHTML , DocumentCollection , DocumentModel) {
	var _view;
	var DocumentView = Backbone.View.extend({
		initialize : function() {
        	_view = this;
		    
            this.model = new DocumentModel();
		},
		afterRender: function(){
			this.el.find("#btnDownload").click(function(){
				var data = _view.form.getData();				
				var fileName = data.filename;
				var url ="/documentlist/?file=" + data.filename;
				
				console.log(url);
				$.fileDownload(url, {
	     		    successCallback: function (url) {
						console.log("success"+fileName);
	     		    },
	     		    failCallback: function (html, url) {
						console.log("fail"+fileName);
	     		    }
	     		});
				
			});
    	},
		render : function(el) {   		
			var dfd = new $.Deferred();
			var _view = this;
			_view.el = el;
			
			if (!_.isUndefined(el)){
    	        this.el=el;
    	    }
			
			documentCollection = new DocumentCollection();
			
			$.when(documentCollection.fetch()).done(function(){
			var _model=_view.model.attributes;
			console.log(_model.filename);
			var _form = new Form({
		        el:_view.el,
		        form:undefined,
		        group:[{
	                name:"docGroup",
	                label:"양식 다운로드",
	                initOpen:true
	            }],
		        
		        childs:[{
	        		type:"combo",
	                name:"filename",
	                label:"선택",
	                firstBlank : true,
	                value : _model.filename,
	                codeKey : "filename",
	                textKey : "filename",
	                collection: documentCollection,
	                group:"docGroup",
	                linkField:"filename"
		        }]
			});
			
			_form.render().done(function(result){
    	        _view.form=_form;     
    	        $(_view.el).find(".form-row").css('margin-bottom','10px');
    	        var panels = _view.el.find('.panel-body');
    	        var tmpl = '<button id="btnDownload" class="btn btn-success btn-block " type="button">다운로드</button>';
    	        $(panels[0]).append(tmpl);
    	        
    	        dfd.resolve(_view);
    	    }).fail(function(){
    	        dfd.reject();
    	    });
			
	    	}).fail(function(e){
		        Dialog.error(i18nCommon.ERROR.USER_EDIT_VIEW.FAIL_RENDER);
		        LOG.error(e.responseJSON.message);
	            dfd.reject();    	      
		    });
			
			return dfd.promise();
		},
		getFormData: function(form) {
    	    var unindexed_array = form.serializeArray();
    	    var indexed_array= {};
    	    
    	    $.map(unindexed_array, function(n, i){
                indexed_array[n['name']] = n['value'];
            });
            
            return indexed_array;
    	}
	});
	
	return DocumentView;
});