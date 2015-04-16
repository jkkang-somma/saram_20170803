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
  'cmoment',
  'code',
  'i18n!nls/common',
  'text!templates/default/head.html',
  'text!templates/default/content.html',
  'text!templates/layout/default.html',
  'text!templates/default/row.html',
  'text!templates/default/datepickerRange.html',
  'text!templates/default/rowbuttoncontainer.html',
  'text!templates/default/rowbutton.html',
  'models/sm/SessionModel',
  'models/common/RawDataModel',
  'collection/common/RawDataCollection',
  'models/sm/UserModel',
  'collection/sm/UserCollection',
  'views/component/ProgressbarView',
], function($, _, Backbone, BaseView, Grid, Schemas, Util, Dialog, csvParser, Moment, Code, i18nCommon,
HeadHTML, ContentHTML, LayoutHTML, RowHTML, DatePickerHTML, RowButtonContainerHTML, RowButtonHTML,
SessionModel, RawDataModel, RawDataCollection,UserModel, UserCollection,
ProgressbarView){
    var RawDataView = BaseView.extend({
        el:$(".main-container"),
        
    	initialize:function(){
    		$(this.el).html('');
    	    $(this.el).empty();
    	    this.rawDataCollection = new RawDataCollection();
    
            this.departmentCollection = null;
            this.userCollection = new UserCollection();
            this.userCollection.fetch();
            
            this.gridOption = {
    		    el:"rawDataContent",
    		    id:"rawDataTable",
    		    column:[
    		         	{ data : "department", 		"title" : i18nCommon.RAW_DATA_LIST.GRID_COL_NAME.DEPARTMENT },
   	                   	{ data : "name", 			"title" : i18nCommon.RAW_DATA_LIST.GRID_COL_NAME.NAME },
 	                   	{ data : "char_date", 		"title" : i18nCommon.RAW_DATA_LIST.GRID_COL_NAME.TIME },
 	                   	{ data : "type", 			"title" : i18nCommon.RAW_DATA_LIST.GRID_COL_NAME.TYPE }
    		    ],
    		    dataschema:["name", "department", "char_date", "type"],
    		    collection:this.rawDataCollection,
    		    detail: true,
    		    fetch: false,
    		    buttons:["search",{
        		    	type:"myRecord",
				        name: "myRecord",
				        filterColumn:["name"], //필터링 할 컬럼을 배열로 정의 하면 자신의 아이디 또는 이름으로 필터링 됨. dataschema 에 존재하는 키값.
				        tooltip: "",
        		    }],
                order: [[3, "desc"]]
        		    
    		};

            var dept_code = SessionModel.getUserInfo().dept_code;
            var admin = SessionModel.getUserInfo().admin;
            
            // 경영지원 팀 인 경우
            if ( dept_code == '1000' || admin == 1 ) {
            	this.gridOption.column.push( { data : "ip_office", 		"title" : i18nCommon.RAW_DATA_LIST.GRID_COL_NAME.IP } );
            	this.gridOption.column.push( { data : "mac",		"title" : i18nCommon.RAW_DATA_LIST.GRID_COL_NAME.MAC } );
            }

            // 경영 지원팀 또는 수원 사업자의 경우 컬럼을 추가
            if ( dept_code == '1000' || Code.isSuwonWorker(dept_code) || admin == 1) {
            	this.gridOption.column.push( { data : "need_confirm", 	"title" : i18nCommon.RAW_DATA_LIST.GRID_COL_NAME.NEED_CONFIRM,
            		render: function(data, type, full, meta) {
               			return (full.need_confirm == 1)? i18nCommon.RAW_DATA_LIST.MSG.OK : i18nCommon.RAW_DATA_LIST.MSG.NOK ;
               		}
               	});
            }
            
            // 경영지원 팀 인 경우
            // if ( dept_code == '1000' || admin == 1 ) {
            // 	this.gridOption.column.push( { data : "mac",		"title" : i18nCommon.RAW_DATA_LIST.GRID_COL_NAME.MAC } );
            // }
    	},
        getRawData : function(){
            var startDate = Moment($(this.el).find("#rdFromDatePicker").data("DateTimePicker").getDate().toDate());
            var endDate = Moment($(this.el).find("#rdToDatePicker").data("DateTimePicker").getDate().toDate());
            if(endDate.diff(startDate, 'days') > 92){
                Dialog.warning("검색 기간이 초과되었습니다. (최대 3개월)");
            }else{
                this.renderTable(startDate, endDate);
            }
        },
        renderTable : function(startDate, endDate){
            var that = this;
            Dialog.loading({
                action:function(){
                    var dfd = new $.Deferred();
                    that.rawDataCollection.fetch({
                        data : {start : startDate.format("YYYY-MM-DD"), end : endDate.format("YYYY-MM-DD")},
                        success: function(){
                            dfd.resolve();
                        }, error: function(){
                            dfd.reject();
                        }
            	    });
            	    return dfd.promise();
        	    },
        	    
                actionCallBack:function(res){//response schema
                    that.grid.render();
                },
                errorCallBack:function(response){
                    Dialog.error( i18nCommon.RAW_DATA_LIST.MSG.LOADING_FAIL );
                },
            });
        },
        
    	render:function(){
    	    var _view= this;
    	    var _headSchema=Schemas.getSchema('headTemp');
    	    var _headTemp=_.template(HeadHTML);
    	    var _layout=$(LayoutHTML);
    	    var _head=$(_headTemp(_headSchema.getDefault({
	            title:i18nCommon.RAW_DATA_LIST.TITLE,
	            subTitle:i18nCommon.RAW_DATA_LIST.SUB_TITLE })
    	    ));
    	    
    	    _head.addClass("no-margin");
    	    _head.addClass("relative-layout");
    	    
    	    var _content=$(ContentHTML).attr("id", this.gridOption.el);
    	    var _row=$(RowHTML);
    	    var _datepickerRange=$(_.template(DatePickerHTML)(
    	    	{ obj : 
    	    		{
    	    			fromId : "rdFromDatePicker",
    	    			toId : "rdToDatePicker"
    	    		}
    	    	})
    	    );
    	    var _btnContainer = $(_.template(RowButtonContainerHTML)({
    	            obj: {
    	                id: "rdBtnContainer"
    	            }
    	        })
    	    );
    	    
    	    var _searchBtn = $(_.template(RowButtonHTML)({
    	            obj: {
    	                id: "rdSearchBtn",
    	                label: i18nCommon.RAW_DATA_LIST.SEARCH_BTN
    	            }
    	        })
	        );
	        
	        _searchBtn.click(function(e){
	            _view.getRawData();
	        });
	        _btnContainer.append(_searchBtn);
	        
    	    _row.append(_datepickerRange);
    	    _row.append(_btnContainer);
            // this.progressbar = new ProgressbarView();
            
    	    _layout.append(_head);
    	    _layout.append(_row);
            _layout.append(_content);
            // _layout.append(this.progressbar.render());

    	    $(this.el).append(_layout);
    	    
    	    var today = new Date();
    	    var firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
    	    $(this.el).find("#rdFromDatePicker").datetimepicker({
            	pickTime: false,
		        language: "ko",
		        todayHighlight: true,
		        format: "YYYY-MM-DD",
		        defaultDate: Moment(today).add(-7,"days").format("YYYY-MM-DD")
            });
            
            $(this.el).find("#rdToDatePicker").datetimepicker({
            	pickTime: false,
		        language: "ko",
		        todayHighlight: true,
		        format: "YYYY-MM-DD",
		        defaultDate: Moment(today).format("YYYY-MM-DD")
            });
            
    	    var _gridSchema=Schemas.getSchema('grid');
        	this.grid= new Grid(_gridSchema.getDefault(this.gridOption));
            this.grid.render();
            this.getRawData();
            
            return this;
     	},
    });
    return RawDataView;
});
