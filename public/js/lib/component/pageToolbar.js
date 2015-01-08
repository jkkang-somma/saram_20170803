define([
  'jquery',
  'underscore',
  'backbone',
  'log',
  'pageToolbar',
  ], function($, _, Backbone, log, pageToolbar){
    var LOG=log.getLogger('PageToolBar');
    var id=0;
    var PageToolBar = Backbone.View.extend({
        events:{
    	},
    	initialize:function(options){
    	    var defaultData={
    	        el:null, total:0, page:1, maxVisible:10, id:"pageToolbar_"(id++)
    	    }
    	    
            var _options=_.pick(_.defaults(options, defaultData), _.keys(defaultData)); 
    		for (var name in _options){
    		    this[name]=_options[name];
    		}
    		_.bindAll(this, 'render');
    		this.render();
    	},
    	
    	render:function(){
    	    var _pageToolBar=$('<div id="'+this.id+'">Pagination goes here</div>');
    	    $(this.el).append(_pageToolBar);
     	}
    });
    return PageToolBar;
});