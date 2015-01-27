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
  'data/code',
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
], function($, _, Backbone, BaseView, Grid, Schemas, Util, Dialog, csvParser, Moment, Code,
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
   	                   	{ data : "name", 			"title" : "이름", 
 	                   		render: function(data, type, full, meta) {
 	                   			return full.name + "</br>(" +full.id + ")";
 	                   		}
 	                   	},
 	                   	{ data : "department", 		"title" : "부서" },
 	                   	{ data : "char_date", 		"title" : "출입시간" },
 	                   	{ data : "type", 			"title" : "출입기록" }
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
        		    }]
    		};
            
            // 수원 사업자의 경우 컬럼을 추가 
            var dept_code = SessionModel.getUserInfo().dept_code;
            if ( Code.isSuwonWorker(dept_code) ) {
            	this.gridOption.column.push( { data : "need_confirm", 	"title" : "확인필요",
            		render: function(data, type, full, meta) {
               			return (full.need_confirm == 1)? "정상" : "확인 필요" ;
               		}
               	});
            }

    	},
        events : {
            "click #rdSearchBtn" : "getRawData"
        },
        getRawData : function(){
            var startDate = $(this.el).find("#rdFromDatePicker").data("DateTimePicker").getDate().toDate();
            var endDate = $(this.el).find("#rdToDatePicker").data("DateTimePicker").getDate().toDate();
            this.renderTable(startDate, endDate);
        },
        renderTable : function(startDate, endDate){
            var that = this;
            this.progressbar.disabledProgressbar(false);
            this.rawDataCollection.fetch({
                data : {start : Moment(startDate).format("YYYY-MM-DD"), end : Moment(endDate).format("YYYY-MM-DD")},
                success: function(){
                    that.grid.render();
                    that.progressbar.disabledProgressbar(true);
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
    	                label: "검색"
    	            }
    	        })
	        );
	        _btnContainer.append(_searchBtn);
	        
    	    _row.append(_datepickerRange);
    	    _row.append(_btnContainer);
            this.progressbar = new ProgressbarView();
            
    	    _layout.append(_head);
    	    _layout.append(_row);
            _layout.append(_content);
            _layout.append(this.progressbar.render());

    	    $(this.el).append(_layout);
    	    
    	    var today = new Date();
    	    var firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
    	    $(this.el).find("#rdFromDatePicker").datetimepicker({
            	pickTime: false,
		        language: "ko",
		        todayHighlight: true,
		        format: "YYYY-MM-DD",
		        defaultDate: Moment(firstDay).format("YYYY-MM-DD")
            });
            
            $(this.el).find("#rdToDatePicker").datetimepicker({
            	pickTime: false,
		        language: "ko",
		        todayHighlight: true,
		        format: "YYYY-MM-DD",
		        defaultDate: Moment(today).format("YYYY-MM-DD")
            });
            
    	    var _gridSchema=Schemas.getSchema('grid');
        	that.grid= new Grid(_gridSchema.getDefault(that.gridOption));
            that.grid.render();
            
            
            return this;
     	},
    });
    return RawDataView;
});