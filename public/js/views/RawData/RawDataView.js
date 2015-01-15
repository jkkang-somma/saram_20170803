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
  'text!templates/inputForm/forminline.html',
  'text!templates/inputForm/combobox.html',
  'text!templates/inputForm/label.html',
  'models/common/RawDataModel',
  'collection/common/RawDataCollection',
  'models/sm/UserModel',
  'collection/sm/UserCollection',
  'models/common/DepartmentCodeModel',
  'collection/common/DepartmentCodeCollection',
], function($, _, Backbone, BaseView, Grid, Schemas, Util, Dialog, csvParser,
HeadHTML, ContentHTML, ButtonHTML, LayoutHTML, InlineFormHTML, ComboBoxHTML, LabelHTML,
RawDataModel, RawDataCollection,UserModel, UserCollection,DepartmentCodeModel, DepartmentCodeCollection){
    var RawDataView = BaseView.extend({
        el:$(".main-container"),
        
    	initialize:function(){
    		$(this.el).html('');
    	    $(this.el).empty();
<<<<<<< HEAD
    	    
=======

>>>>>>> deda82b2dfb50066ad0a9daf04ef666efa2c2f6e
    	    this.rawDataCollection = new RawDataCollection();
    	    //this.rawDataCollection.fetch({data : {start : "2014-10-26", end : "2014-11-25"}});
            this.departmentCollection = null;
            this.userCollection = null;
            
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
    		
    		//this.buttonInit();
    	},
    	events: {
    	    "change #rawDataDeptCombo" : "changeDept"
    	},
    	changeDept: function(ref){
            console.log($(ref).value());
            
    	},
    	buttonInit:function(){

    	},
    	
    	render:function(){
    	    var that = this;
    	    var _headSchema=Schemas.getSchema('headTemp');
    	    var _headTemp=_.template(HeadHTML);
    	    var _layout=$(LayoutHTML);
    	    var _head=$(_headTemp(_headSchema.getDefault({title:"출입 기록 관리 ", subTitle:"출입 기록 조회"})));
    	    
    	    _head.addClass("no-margin");
    	    _head.addClass("relative-layout");
    	    
    	    var _inlineForm=$(InlineFormHTML).attr("id", "test");
    	    var _deptComboLabel = $(_.template(LabelHTML)({label:"부서"}));
    	    var _deptCombo = $(_.template(ComboBoxHTML)({id:"rawDataDeptCombo", label:""}));
    	    _inlineForm.append(_deptComboLabel);
    	    _inlineForm.append(_deptCombo);
    	    
    	    var _nameComboLabel = $(_.template(LabelHTML)({label:"이름"}));
    	    var _nameCombo = $(_.template(ComboBoxHTML)({id:"rawDataNameCombo", label:""}));
    	    _inlineForm.append(_nameComboLabel);
    	    _inlineForm.append(_nameCombo);
    	    
    	    this.departmentCollection = new DepartmentCodeCollection();
    	    this.departmentCollection.fetch({
    	        success: function(resultCollection){
	                
	                _deptCombo.find("select").append($("<option></option>"));
                    
    	            _.each(resultCollection.models, function(model){
    	                var option = $("<option>"+model.get("name")+"</option>");
    	                _deptCombo.find("select").append(option);
    	            })     
    	        }
    	    });
    	    
    	    
    	    var _content=$(ContentHTML).attr("id", this.gridOption.el);
    	    _layout.append(_head);
    	    _layout.append(_inlineForm);
            _layout.append(_content);
            
    	    $(this.el).append(_layout);
    	    
    	    //this.rawDataCollection.fetch({data : {start : Util.dateToString(firstDay), end : Util.dateToString(lastDay)}});
    	    
    	    this.rawDataCollection.fetch({data : {start : "2014-10-26", end : "2014-11-25"}}).done(function(){
    	        var _gridSchema=Schemas.getSchema('grid');
        	    that.grid= new Grid(_gridSchema.getDefault(that.gridOption));
        	    
        	    var today = new Date(), y = today.getFullYear, m = today.getMonth();
        	    var firstDay = new Date(y, m, 1);
        	    var lastDay = new Date(y, m+1, 0);       
                that.grid.render();
                return that;
    	    });

     	},
     	
    });
    return RawDataView;
});