define([
	'jquery',
	'underscore',
	'backbone',
	'core/BaseView',
	'cmoment',
	'grid',
	'lodingButton',
	'schemas',
	'i18n!nls/common',
    'dialog',
    'views/statistics/DeptSummaryDetailPopup',
	'text!templates/default/head.html',
	'text!templates/default/row.html',
	'text!templates/default/rowdatepicker.html',
	'text!templates/default/rowbuttoncontainer.html',
	'text!templates/default/rowbutton.html',
	'text!templates/default/content.html',
	'text!templates/layout/default.html',
    'text!templates/default/button.html',
    'text!templates/statistics/deptSummaryRow.html'
    ], function($, _, Backbone, BaseView, Moment, Grid, LodingButton, Schemas, i18nCommon, Dialog, DeptSummaryDetailPopup, 
        HeadHTML, RowHTML, DatePickerHTML, RowButtonContainerHTML, RowButtonHTML, ContentHTML, LayoutHTML, 
		ButtonHTML, DeptSummaryRowHtml){
		
		var deptSummaryView = BaseView.extend({
        el:$(".main-container"),
    	initialize:function(){
            var _this = this;
            this.option = {
                currentYearMonth : null
            }
    		this.gridOption = {
        		    el:"dept_summary_content",
        		    id:"deptSummaryTable",
        		    column:[
                                { data : "department",  title : "부 서" },
                                { data : "score",       title : "점 수" },
                                { data : "total_person",title : "총 원"},
                                { data : "late",  	    title : "지 각",
                                    render: function(data, type, full, meta){
                                        return _this.gridColumnRender(data, full, "10");
                                    } 
                                },
                                { data : "leave_early",     "title" : "조 퇴",
                                    render: function(data, type, full, meta){
                                        return _this.gridColumnRender(data, full, "01");
                                    } 
                                },
                                { data : "late_leave_early","title" : "지각&조퇴",
                                    render: function(data, type, full, meta){
                                        return _this.gridColumnRender(data, full, "11");
                                    }
                                },
                                { data : "absent",          "title" : "결 근",
                                    render: function(data, type, full, meta){
                                        return _this.gridColumnRender(data, full, "21");
                                    }
                                },
                                { data : "data_none_1",		"title" : "출근 없음",
                                    render: function(data, type, full, meta){
                                        return _this.gridColumnRender(data, full, "50");
                                    }
                                },
                                { data : "data_none_2",		"title" : "퇴근 없음",
                                    render: function(data, type, full, meta){
                                        return _this.gridColumnRender(data, full, "51");
                                    } 
                                }
             	        ],
        		    collection:null,
        		    dataschema:["department", "score", "total_persion", "late", "leave_early", "late_leave_early", "absent", "data_none_1", "data_none_2"],
        		    detail: true,
                    buttons:["search"],
        		    fetch: false,
                    order : [[2, "asc"],[3, "desc"]]
                };
        },
        
    	events: {
            'click #SearchBtn' : 'onClickSearchBtn',
            'click #deptSummaryTable .td-dept-summary' : 'onClickDetailPopup',
        },
        
    	render:function(viewType, searchParams){
            //var _view=this;
            this.viewType=(viewType != undefined)? viewType : 'default';
            this.searchParams = searchParams;
    	    var _headSchema=Schemas.getSchema('headTemp');
    	    var _headTemp=_.template(HeadHTML);
            var _layOut=$(LayoutHTML);
            
    	    var _head=$(_headTemp(_headSchema.getDefault(
    	    	{
    	    		title:"근태관리",
    	    		subTitle:"부서별 근태현황"
    	    	}
   	    	)));
    	    
    	    _head.addClass("no-margin");
    	    _head.addClass("relative-layout");

 			var _row=$(RowHTML);
    	    var _datepickerRange=$(_.template(DatePickerHTML)(
    	    	{ obj : 
    	    		{
    	    			dateId : "FromDatePicker"
    	    		}
    	    	})
    	    );
    	    var _btnContainer = $(_.template(RowButtonContainerHTML)({
    	            obj: {
    	                id: "ccmBtnContainer"
    	            }
    	        })
    	    );
    	    
    	    var _searchBtn = $(_.template(RowButtonHTML)({
    	            obj: {
    	                id: "SearchBtn",
    	                label: i18nCommon.COMMUTE_TODAY_LIST.SEARCH_BTN,
    	            }
    	        })
	        );
	        _btnContainer.append(_searchBtn);
	        
    	    _row.append(_datepickerRange);
    	    _row.append(_btnContainer);
    	    var _content=$(ContentHTML).attr("id", this.gridOption.el);
            
            if(this.viewType != "dashboard"){
                _layOut.append(_head);
                _layOut.append(_row);
            }
    	    _layOut.append(_content);
    	    
    	    $(this.el).html(_layOut);
    
    		// datePkcker 초기화	    
			var today = new Date();

    	    $(this.el).find("#FromDatePicker").datetimepicker({
            	pickTime: false,
		        language: "ko",
		        todayHighlight: true,
                format: "YYYY-MM",
                minViewMode : 1,    // 년/월만 선택하도록 하는 옵션
		        defaultDate: Moment(today).format("YYYY-MM")
            });
            
    	    // var _gridSchema=Schemas.getSchema('grid');
    	    //this.grid= new Grid(_gridSchema.getDefault(this.gridOption));
            //this.grid.render();
            this.selectDeptSummary();
			
            return this;
        },
         
        onClickSearchBtn: function(evt) {
            this.selectDeptSummary();
        },

        gridColumnRender:function(data, full, typeValue){
            if ( data == 0 ) 
                return data;

            var obj = {
                dept : full.department,
                type : typeValue,
                value: data
            };
            var tpl = _.template(DeptSummaryRowHtml)(obj);
            return tpl;
        },
         
        selectDeptSummary: function() {
            var _this = this;
            var startDate = (this.viewType != 'dashboard')?Moment($(_this.el).find("#FromDatePicker").data("DateTimePicker").getDate()) : (this.searchParams == undefined)? Moment() : Moment(this.searchParams.start);
            var startDateStr = startDate.format('YYYY-MM');
            this.ajaxCall(startDateStr).then(function(result){
                
                for ( let i = 0 ; i < result["DeptSummary"].length ; i++ ) {

                    var rowData = result["DeptSummary"][i];

                    // 부서 인원 셋팅
                    for ( let j = 0 ; j < result["DeptPersionCount"].length ; j++ ) {
                        if ( rowData.department == result["DeptPersionCount"][j].department ) {
                            rowData["total_person"] = result["DeptPersionCount"][j].count;
                            break;
                        }
                    }

                    // 점수 계산
                    if ( _.isUndefined(rowData["total_person"]) ) {
                        rowData["total_person"] = "";
                        rowData["score"] = "";
                        continue;
                    }

                    rowData["score"] = ( rowData["late"] + rowData["leave_early"] + rowData["late_leave_early"]*2 + 
                                         rowData["absent"] + rowData["data_none_1"] + rowData["data_none_2"] ) / rowData["total_person"];
                    rowData["score"] = rowData["score"].toFixed(1);
                }
                
                _this.gridOption.collection = {
                    data:result["DeptSummary"],
                    toJSON : function(){
                        return result["DeptSummary"];
                    }
                };

                if(_this.viewType == 'dashboard'){
                    _this.gridOption.scrollFix = false;
                }

                var _gridSchema = Schemas.getSchema('grid');
                _this.grid = new Grid(_gridSchema.getDefault(_this.gridOption));

                _this.option.currentYearMonth = startDateStr;
            });
        },

        ajaxCall:function(startDateStr) {
            var dfd = new $.Deferred();
            var url = "/statistics/dept";
            var ajaxSetting = {
                method : "GET",
                data : {startDate:startDateStr},
                success : function(result){
                    dfd.resolve(result);
                },
                error : function(){
                    dfd.resolve();
                }
            };
            
            $.ajax( url, ajaxSetting );
            return dfd.promise();
        },

        onClickDetailPopup:function(evt){
            var _this = this;

            var data = JSON.parse( $(evt.currentTarget).attr('data') );
            data["yearMonth"] = this.option.currentYearMonth;
            
            var deptSummaryDetailPopup = new DeptSummaryDetailPopup(data);
            Dialog.show({
                title: "세부내역 ("+_this.option.currentYearMonth + ", " + data.dept+")", 
                content: deptSummaryDetailPopup,
                buttons: [{
                    label : "닫기",
                    action : function(dialog){
                        dialog.close();
                    }
                }]
            });
        }
	});
	return deptSummaryView;
});
