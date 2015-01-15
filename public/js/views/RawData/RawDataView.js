define([
  'jquery',
  'underscore',
  'backbone',
  'core/BaseView',
  'grid',
  'schemas',
  'util',
  'dialog',
  'csvParser',
  'text!templates/default/head.html',
  'text!templates/default/content.html',
  'text!templates/layout/default.html',
  'text!templates/component/progressbar.html',
  'models/common/RawDataModel',
  'collection/common/RawDataCollection',
  'models/sm/UserModel',
  'collection/sm/UserCollection',
  'models/common/DepartmentCodeModel',
  'collection/common/DepartmentCodeCollection',
], function($, _, Backbone, BaseView, Grid, Schemas, Util, Dialog, csvParser,
HeadHTML, ContentHTML, LayoutHTML, ProgressbarHTML,
RawDataModel, RawDataCollection,UserModel, UserCollection,DepartmentCodeModel, DepartmentCodeCollection){
    var RawDataView = BaseView.extend({
        el:$(".main-container"),
        
    	initialize:function(){
    		var that  = this;
    		
    		$(this.el).html('');
    	    $(this.el).empty();
    	    this.rawDataCollection = new RawDataCollection();
    
            this.departmentCollection = null;
            this.userCollection = new UserCollection();
            this.userCollection.fetch();
            
            this.gridOption = {
    		    el:"rawDataContent",
    		    id:"rawDataTable",
    		    column:["사번", "이름", "부서", "출입시간", "출입기록"],
    		    dataschema:["id", "name", "department", "char_date", "type"],
    		    collection:this.rawDataCollection,
    		    detail: true,
    		    fetch: false,
    		    buttons:["search","refresh"]
    		};
    		
    		//this.rawDataCollection.fetch({data : {start : Util.dateToString(firstDay), end : Util.dateToString(lastDay)}});

            
    	},
    
        renderTable : function(startDate, endDate){
            var that = this;
            this.rawDataCollection.fetch({
                data : {start : "2014-10-26", end : "2014-11-25"},
                success: function(){
        	    var today = new Date(), y = today.getFullYear, m = today.getMonth();
        	    var firstDay = new Date(y, m, 1);
        	    var lastDay = new Date(y, m+1, 0);       
                that.grid.render();
                that._disabledProgressbar(true);
                }
    	    });
        },
    	render:function(){
    	    var that = this;
    	    var _headSchema=Schemas.getSchema('headTemp');
    	    var _headTemp=_.template(HeadHTML);
    	    var _layout=$(LayoutHTML);
    	    var _head=$(_headTemp(_headSchema.getDefault({title:"출입 기록 관리 ", subTitle:"출입 기록 조회"})));
    	    
    	    _head.addClass("no-margin");
    	    _head.addClass("relative-layout");
    	    
    	    var _content=$(ContentHTML).attr("id", this.gridOption.el);
    	    var _progressBar=$(_.template(ProgressbarHTML)({percent : 100}));
    	    
    	    _layout.append(_head);
            _layout.append(_content);
            _layout.append(_progressBar);

    	    $(this.el).append(_layout);
    	    
    	    var _gridSchema=Schemas.getSchema('grid');
        	that.grid= new Grid(_gridSchema.getDefault(that.gridOption));
            that.grid.render();
            
            this._disabledProgressbar(false);
            this.renderTable();
            
            return this;
     	},
     	
     	_disabledProgressbar : function(flag){
     	    var progressbar = $(this.el).find(".progress");
     	    if(flag){
     	        progressbar.css("display","none");
     	    }else{
     	        progressbar.css("display","block");
     	    }
     	},
    });
    return RawDataView;
});