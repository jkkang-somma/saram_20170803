define([ 
	'jquery',
	'underscore',
	'backbone',
	'util',
	'cmoment',
	'data/document',
	'lib/component/form',
], function($, _, Backbone, Util, Moment, Doc, Form) {
	var _view;
	var DocumentView = Backbone.View.extend({
		initialize : function() {
            _view = this;
		},
		afterRender: function(){
			this.el.find("#btnDownload").click(function(){
				var data = _view.form.getData();
				$.fileDownload(data.docType, {
	     		    successCallback: function (url) {
	     		    	
	     		    },
	     		    failCallback: function (html, url) {
	     		    }
	     		});
				
			});
    	},
		render : function(el) {
			
			_view.el = el;
			var dfd = new $.Deferred();
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
	                name:"docType",
	                label:"자료 선택",
	                firstBlank : true,
	                collection: Doc,
	                group:"docGroup"
		        }]
			});
			
			_form.render().done(function(result){
    	        _view.form=_form;

    	        var panels = _view.el.find('.panel-body');
    	        var tmpl = '<button id="btnDownload" class="btn btn-success btn-block " type="button">양식 다운로드</button>';
    	        $(panels[0]).append(tmpl);
    	        
    	        dfd.resolve(_view);
    	    }).fail(function(){
    	        dfd.reject();
    	    });
    	    
			return dfd.promise();
		},
	});
	
	return DocumentView;
});