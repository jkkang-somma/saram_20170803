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
  'text!templates/default/button.html',
  'text!templates/layout/default.html',
  'models/common/RawDataModel',
  'collection/common/RawDataCollection',
  'models/sm/UserModel',
  'collection/sm/UserCollection',
  'views/RawData/popup/AddRawDataAddPopupView',
], function($, _, Backbone, BaseView, Grid, Schemas, Util, Dialog, csvParser,
HeadHTML, ContentHTML, ButtonHTML, LayoutHTML,
RawDataModel, RawDataCollection, UserModel, UserCollection,
AddRawDataAddPopupView){
    var RawDataView = BaseView.extend({
        el:$(".main-container"),
        
    	initialize:function(){
    		$(this.el).html('');
    	    $(this.el).empty();
    	    
    	    this.userCollection = new UserCollection();
    	    this.userCollection.fetch();
    	    
    	    this.rawDataCollection = new RawDataCollection();
    	    var today = new Date(), y = today.getFullYear, m = today.getMonth();
    	    var firstDay = new Date(y, m, 1);
    	    var lastDay = new Date(y, m+1, 0);
    	    
    	    this.rawDataCollection.fetch({data : {start : Util.dateToString(firstDay), end : Util.dateToString(lastDay)}});
    	    
            this.gridOption = {
    		    el:"rawDataContent",
    		    id:"rawDataTable",
    		    column:["사번", "이름", "부서", "날짜", "시간", "출입기록"],
    		    dataschema:["id", "name", "department", "date", "time", "type"],
    		    collection:this.rawDataCollection,
    		    detail: true,
    		    fetch: false,
    		    buttons:["search","refresh"]
    		};
    		
    		this.buttonInit();
    	},
    	
    	buttonInit:function(){
    	    var that = this;

    	},
    	
    	render:function(){
    	    var _headSchema=Schemas.getSchema('headTemp');
    	    var _headTemp=_.template(HeadHTML);
    	    var _layout=$(LayoutHTML);
    	    var _head=$(_headTemp(_headSchema.getDefault({title:"출입 기록 관리 ", subTitle:"출입 기록 조회"})));
    	    
    	    _head.addClass("no-margin");
    	    _head.addClass("relative-layout");
    	    
    	     var _content=$(ContentHTML).attr("id", this.gridOption.el);
    	    _layout.append(_head);
            _layout.append(_content);
            
            
    	    $(this.el).append(_layout);
    	    
    	    var _gridSchema=Schemas.getSchema('grid');
    	    this.grid= new Grid(_gridSchema.getDefault(this.gridOption));
            
            return this;
     	},
     	
    });
    return RawDataView;
});