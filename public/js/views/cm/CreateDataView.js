define([
  'jquery',
  'underscore',
  'backbone',
  'core/BaseView',
  'grid',
  'schemas',
  'dialog',
  'cmoment',
  'resulttimefactory',
  'data/code',
  'i18n!nls/common',
  'text!templates/default/head.html',
  'text!templates/default/content.html',
  'text!templates/layout/default.html',
  'text!templates/component/progressbar.html',
  'text!templates/inputForm/forminline.html',
  'text!templates/inputForm/label.html',
  'models/cm/CommuteModel',
  'collection/common/HolidayCollection',
  'collection/common/RawDataCollection',
  'collection/sm/UserCollection',
  'collection/cm/CommuteCollection',
  'collection/vacation/OutOfficeCollection',
  'collection/vacation/InOfficeCollection',
  'views/cm/popup/CreateDataPopupView',
  'views/cm/popup/CreateDataRemovePopupView',
  'views/component/ProgressbarView'
], function($, _, Backbone, BaseView, Grid, Schemas, Dialog, Moment, ResultTimeFactory, Code, i18nCommon,
    HeadHTML, ContentHTML, LayoutHTML, ProgressbarHTML, ForminlineHTML, LabelHTML,
    CommuteModel, 
    HolidayCollection, RawDataCollection, UserCollection, CommuteCollection, OutOfficeCollection, InOfficeCollection,
    CreateDataPopupView, CreateDataRemovePopupView, ProgressbarView
){
    function dateToText(data){
        return _.isNull(data) ? null : Moment(data).format("MM-DD<br>HH:mm:ss");
    }
    
    var CreateDataView = BaseView.extend({
        
        el:$(".main-container"),
       
    	initialize:function(){
    		$(this.el).html('');
    	    $(this.el).empty();
    	    this.commuteCollection = new CommuteCollection();
    	    
    		this.gridOption = {
    		    el:"createCommuteListContent",
    		    id:"createCommuteListTable",
    		    column:[
                    {"title": i18nCommon.CREATE_COMMUTE_RESULT.GRID_COL_NAME.DATE,       "data": "date"},
                    {"title": i18nCommon.CREATE_COMMUTE_RESULT.GRID_COL_NAME.DEPARTMENT, "data": "department"},
                    {"title": i18nCommon.CREATE_COMMUTE_RESULT.GRID_COL_NAME.NAME,       "data": "name"},
                    {"title": i18nCommon.CREATE_COMMUTE_RESULT.GRID_COL_NAME.WORK_TYPE,  "data": "work_type",
                        "render": function (data, type, rowData, meta) {
                            return Code.getCodeName(Code.WORKTYPE, data);
                       }
                    },
                    {"title": i18nCommon.CREATE_COMMUTE_RESULT.GRID_COL_NAME.STDIN_TIME, "data": "standard_in_time",
                        "render": function (data, type, rowData, meta) {
                            return dateToText(data);
                       }
                    },
                    {"title": i18nCommon.CREATE_COMMUTE_RESULT.GRID_COL_NAME.IN_TIME,    "data": "in_time",
                        "render": function (data, type, rowData, meta) {
                            return dateToText(data);
                       }
                    },
                    {"title": i18nCommon.CREATE_COMMUTE_RESULT.GRID_COL_NAME.LATE_TIME,  "data": "late_time"},
                    {"title": i18nCommon.CREATE_COMMUTE_RESULT.GRID_COL_NAME.STDOUT_TIME, "data": "standard_out_time",
                        "render": function (data, type, rowData, meta) {
                            return dateToText(data);
                       }
                    },
                    {"title": i18nCommon.CREATE_COMMUTE_RESULT.GRID_COL_NAME.OUT_TIME,   "data": "out_time",
                        "render": function (data, type, rowData, meta) {
                            return dateToText(data);
                            
                       }
                    },
                    {"title": i18nCommon.CREATE_COMMUTE_RESULT.GRID_COL_NAME.OVER_TIME,  "data": "over_time"},
                    {"title": i18nCommon.CREATE_COMMUTE_RESULT.GRID_COL_NAME.OVERTIME_CODE, "data": "overtime_code",
                        "render": function (data, type, rowData, meta) {
                            return Code.getCodeName(Code.OVERTIME, data);
                        }
                    },
                    {"title": i18nCommon.CREATE_COMMUTE_RESULT.GRID_COL_NAME.VACATION_CODE, "data": "vacation_code",
                        "render": function (data, type, rowData, meta) {
                            return Code.getCodeName(Code.OFFICE, data);
                        }
                    },
                    {"title": i18nCommon.CREATE_COMMUTE_RESULT.GRID_COL_NAME.OUT_OFFICE_CODE, "data": "out_office_code",
                        "render": function (data, type, rowData, meta) {
                            return Code.getCodeName(Code.OFFICE, data);
                        }
                    },
    		    ],
    		    dataschema:[
    		        "date", "name", "in_time", "out_time", "work_type", "standard_in_time" ,"standard_out_time",
    		        "late_time", "over_time", "overtime_code", "vacation_code", "out_office_code"
    		    ],
    		    collection:this.commuteCollection,
    		    detail: true,
    		    fetch: false,
    		    buttons:["search"],
    		    order:[[1,"asc"]]
    		};
    		
    		this._dialogInit();
    		
    	},
    	
    	_dialogInit: function(){
    	    this._addAddBtn();
    	    this._addCommitBtn();
        },
    	_addAddBtn : function(){
    	    var that = this;
    	    this.gridOption.buttons.push({
    	        type:"custom",
    	        name:"add",
    	        tooltip:i18nCommon.CREATE_COMMUTE_RESULT.CREATE_DIALOG.TOOLTIP,
    	        click:function(){
                    var createDataPopupView= new CreateDataPopupView({date : that.lastestDate});
                    
                    Dialog.show({
                        title:i18nCommon.CREATE_COMMUTE_RESULT.CREATE_DIALOG.TITLE, 
                        content:createDataPopupView, 
                        buttons: [{
                            id: 'createDataCreateBtn',
                            cssClass: Dialog.CssClass.SUCCESS,
                            label: i18nCommon.CREATE_COMMUTE_RESULT.CREATE_DIALOG.BUTTON.CREATE,
                            action: function(dialog) {
                                Dialog.confirm({
                        			msg : i18nCommon.CREATE_COMMUTE_RESULT.CREATE_DIALOG.ASK,
                        			action:function(){
                        	            return createDataPopupView.createData();
                                    },
                                    actionCallBack:function(result){
                                        that.commuteCollection.reset();
                                        that.commuteCollection.add(result);
                                        that.grid.render();
                                        dialog.close();
                                        Dialog.show(i18nCommon.CREATE_COMMUTE_RESULT.CREATE_DIALOG.MSG.CREATE_DATA_COMPLETE);    
                                    },
                                    errorCallBack:function(response){
                                        Dialog.error(i18nCommon.CREATE_COMMUTE_RESULT.CREATE_DIALOG.MSG.CREATE_DATA_CANCEL);
                                    },
                                });  
                            }
                        }, {
                            label : i18nCommon.CREATE_COMMUTE_RESULT.CREATE_DIALOG.BUTTON.CANCEL,
                            action: function(dialog){
                                dialog.close();
                            }
                        }],
                    });
                }
    	    });
    	},
    	_addCommitBtn : function(){
    	    var that = this;
    	    this.gridOption.buttons.push({
    	        type:"custom",
    	        name:"ok",
    	        tooltip:i18nCommon.CREATE_COMMUTE_RESULT.COMMIT_DIALOG.TOOLTIP,
    	        click:function(){
    	            Dialog.confirm({
    					msg : i18nCommon.CREATE_COMMUTE_RESULT.COMMIT_DIALOG.MESSAGE,
    					action:function(){
                            var dfd = new $.Deferred();
                            that.commuteCollection.save({
            	                success:function(){
            	                    dfd.resolve();
            	                },
            	                error: function(model, response){
            	                    dfd.reject();
            	                }
            	            });
            	            return dfd;
                        },
                        actionCallBack:function(res){//response schema
    	                    that._setLabel();
    	                    Dialog.info(i18nCommon.CREATE_COMMUTE_RESULT.COMMIT_DIALOG.MSG.COMMIT_DATA_COMPLETE);
                        },
                        errorCallBack:function(response){
    	                    Dialog.error(i18nCommon.CREATE_COMMUTE_RESULT.COMMIT_DIALOG.MSG.COMMIT_DATA_FAIL);
                        },
    	            });
    	        }
    	    });  
    	},
    	
    	render:function(){
            var _headSchema=Schemas.getSchema('headTemp');
    	    var _headTemp=_.template(HeadHTML);
    	    var _layout=$(LayoutHTML);
    	    var _head=$(_headTemp(_headSchema.getDefault(
    	        {
    	            title:i18nCommon.CREATE_COMMUTE_RESULT.TITLE,
    	            subTitle:i18nCommon.CREATE_COMMUTE_RESULT.SUB_TITLE
    	        })
    	    ));
    	    
    	    _head.addClass("no-margin");
    	    _head.addClass("relative-layout");
    	    
    	    var _content=$(ContentHTML).attr("id", this.gridOption.el);
    	    
    	    var _row=$(ForminlineHTML);
    	    var _label = $(_.template(LabelHTML)({label : ""}));
    	    this.label = _label;
    	    _row.append(_label);
    	    _layout.append(_head);
    	    _layout.append(_row);
            _layout.append(_content);
            
    	    $(this.el).append(_layout);
    	    this.lastestDate = null;
            this._setLabel();
            
    	    var _gridSchema=Schemas.getSchema('grid');
    	    this.grid= new Grid(_gridSchema.getDefault(this.gridOption));
    	    
            return this;
     	},
     	_setLabel : function(){
     	    var that = this;
     	    $.get(
    	        "/commute/lastiestdate",
    	        function(data){
    	            if(data.length === 0){
    	                that.label.parent().css("display","none");
    	            }else{
    	                that.label.parent().css("display","block");
    	                that.label.text("Lastest data : " + data["0"].date);
    	                that.lastestDate = data["0"].date;
    	            }
    	        }
    	    );
     	},
    });
    
    return CreateDataView;
});