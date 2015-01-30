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
  'views/cm/popup/CreateDataPopupView',
  'views/cm/popup/CreateDataRemovePopupView',
  'views/component/ProgressbarView'
], function($, _, Backbone, BaseView, Grid, Schemas, Dialog, Moment, ResultTimeFactory, Code,
HeadHTML, ContentHTML, LayoutHTML, ProgressbarHTML, ForminlineHTML, LabelHTML,
CommuteModel, 
HolidayCollection, RawDataCollection, UserCollection, CommuteCollection, OutOfficeCollection,
CreateDataPopupView, CreateDataRemovePopupView, ProgressbarView){
    var resultTimeFactory = ResultTimeFactory.Builder;
    
    function dateToText(data){
        return _.isNull(data) ? null : Moment(data).format("MM-DD<br>HH:mm:SS");
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
                    {"title": "날짜", "data": "date"},
                    {"title": "이름", "data": "name"},
                    {"title": "부서", "data": "department"},
                    {"title": "근무<br>형태", "data": "work_type",
                        "render": function (data, type, rowData, meta) {
                            return Code.getCodeName(Code.WORKTYPE, data);
                       }
                    },
                    {"title": "출근<br>기준", "data": "standard_in_time",
                        "render": function (data, type, rowData, meta) {
                            return dateToText(data);
                       }
                    },
                    {"title": "출근<br>시간", "data": "in_time",
                        "render": function (data, type, rowData, meta) {
                            return dateToText(data);
                       }
                    },
                    {"title": "지각<br>(분)", "data": "late_time"},
                    {"title": "퇴근<br>기준", "data": "standard_out_time",
                        "render": function (data, type, rowData, meta) {
                            return dateToText(data);
                       }
                    },
                    {"title": "퇴근<br>시간", "data": "out_time",
                        "render": function (data, type, rowData, meta) {
                            return dateToText(data);
                            
                       }
                    },
                    {"title": "초과근무<br>(분)", "data": "over_time"},
                    {"title": "초과근무", "data": "overtime_code",
                        "render": function (data, type, rowData, meta) {
                            return Code.getCodeName(Code.OVERTIME, data);
                        }
                    },
                    {"title": "근태", "data": "vacation_code",
                        "render": function (data, type, rowData, meta) {
                            return Code.getCodeName(Code.OFFICE, data);

                        }
                    },
                    {"title": "외근<br>출장", "data": "out_office_code",
                        "render": function (data, type, rowData, meta) {
                            return Code.getCodeName(Code.OFFICE, data);
                        }
                    },
    		    ],
    		    dataschema:["date", "name", "in_time", "out_time", "work_type", "standard_in_time" ,"standard_out_time", "late_time", "over_time", "overtime_code", "vacation_code", "out_office_code"],
    		    collection:this.commuteCollection,
    		    detail: true,
    		    fetch: false,
    		    buttons:["search"]
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
    	        tooltip:"근태 생성",
    	        click:function(){
                    var createDataPopupView= new CreateDataPopupView({date : that.lastestDate});
                    
                    Dialog.show({
                        title:"근태 데이터 생성", 
                        content:createDataPopupView, 
                        buttons: [{
                            id: 'createDataCreateBtn',
                            cssClass: Dialog.CssClass.SUCCESS,
                            label: '데이터 생성',
                            action: function(dialog) {
                                that._createData(createDataPopupView).done(function(){ // 데이터 생성
                                    dialog.close();
                                    that.grid.render();
                                    Dialog.show("데이터 생성 완료!");    
                                });
                            }
                        }, {
                            label : "취소",
                            action: function(dialog){
                                dialog.close();
                            }
                        }],
                    });
                }
    	    });
    	},
    	_createData : function(view){
    	    var dfd = new $.Deferred();
    	    var that = this;
    	    var startDate = view.getStartDate();
            var endDate = view.getEndDate();
            var yesterday = Moment(startDate).subtract(1, 'days');
            
            
            
            if(startDate.isAfter(endDate)){
                Dialog.error("시작일이 종료일보다 큽니다.");
                return;
            }else{
                this.commuteCollection.reset();    
                view.disabledProgressbar(false); // display progressbar 
            }
            
            var selectedDate = {
                start:startDate.format(ResultTimeFactory.DATEFORMAT),
                end:endDate.format(ResultTimeFactory.DATEFORMAT)
            };
            
            var rawDataCollection = new RawDataCollection();            // 해당기간의 출입기록
            var userCollection = new UserCollection();                  // 전체 사용자 목록
            var holidayCollection = new HolidayCollection();            // 해당 연도 전체 휴일 목록
            var outOfficeCollection = new OutOfficeCollection();        // 휴가 / 외근 / 출장 목록
            var yesterdayCommuteCollection = new CommuteCollection();   // 선택일 전날 근태 데이터 목록

            $.when(
                rawDataCollection.fetch({data: selectedDate}),
                userCollection.fetch(),
                holidayCollection.fetch({ data : {  year : startDate.year() } }),
                outOfficeCollection.fetch({data : selectedDate}),
                yesterdayCommuteCollection.fetchDate(yesterday.format(ResultTimeFactory.DATEFORMAT))
            ).done(function(){
                
                var diff_days = endDate.diff(startDate, 'days');

                _.each(userCollection.models, function(userModel, idx){     // 사용자별로 데이터 생성
                    var today = Moment(startDate);
                    var userId = userModel.attributes.id;
                    var userName = userModel.attributes.name;
                    var userDepartment = userModel.attributes.dept_name;
                    if( userDepartment == "무소속" || userDepartment==="임원"){
                        
                        
                    }else{
                        var yesterdayAttribute = {};
                        
                        var userRawDataCollection = new RawDataCollection(); // 해당 사용자의 출입기록 Collection
                        _.each(rawDataCollection.filterID(userId), function(model){
                            userRawDataCollection.add(model);
                        });
                        
                        var userOutOfficeCollection = new OutOfficeCollection(); // 해당 사용자의 OutOffice Collection
                        _.each(outOfficeCollection.filterID(userId), function(model){
                            userOutOfficeCollection.add(model);
                        });
                        
                        var filterDate = yesterdayCommuteCollection.where({id : userId}); // 시작일 - 1의 근태 데이터
                        if(filterDate.length > 0){
                            yesterdayAttribute = filterDate[0].toJSON();
                            yesterdayAttribute.out_time = Moment(yesterdayAttribute.out_time).year(yesterdayAttribute.year);
                            yesterdayAttribute.out_time = yesterdayAttribute.out_time.toDate();
                        }else{
                            yesterdayAttribute.out_time = null;
                        }
                            
                        resultTimeFactory.init(userId, userName, userDepartment); //계산전 초기화
                        
                        for(var i=0; i <= diff_days; i++){ //차이나는 날짜만큼 기본데이터 생성 (사원수 X 날짜)
                            var todayStr = today.format(ResultTimeFactory.DATEFORMAT);    // 오늘 날짜(str)
                            var holidayData = holidayCollection.where({ // 오늘 휴일 목록
                                date: todayStr
                            });    
                            
                            resultTimeFactory.initToday(todayStr, holidayData); //계산전 초기화    
                            
                            // 출근 기준시간 판단
                            var yesterdayOutTime = _.isNull(yesterdayAttribute.out_time)? null :Moment(yesterdayAttribute.out_time);
                            resultTimeFactory.setStandardInTime(yesterdayOutTime);
                            
                            // 휴가/외근/출장 판단
                            var todayOutOffice = userOutOfficeCollection.where({date: todayStr});
                            resultTimeFactory.setOutOffice(todayOutOffice);
                            
                            // 휴일 판단
                            resultTimeFactory.setHoliday();
                            
                            // 당일 사용자의 출입기록을 보고 출근 / 퇴근/  가장 빠른,늦은시간 출입 기록을 구한다
                            var rawData = userRawDataCollection.filterDate(todayStr);
                            _.each(rawData, function(rawDataModel){
                                var destTime = Moment(rawDataModel.get("char_date"));
                                var type  = rawDataModel.get("type");
                                resultTimeFactory.checkTime(destTime, type);   
                            });
                            
                            // 결과 저장
                            var result = resultTimeFactory.getResult();
                            that.commuteCollection.add(result);
                            
                            // 다음날 계산을 위해 결과를 yesterdayAttribute에 저장
                            yesterdayAttribute = result;
                            
                            today.add(1, 'days');
                        }
                    }
                    
                    view.setProgressbarPercent( (idx+1) / userCollection.models.length * 100 );
                });
                dfd.resolve();
            });  
            return dfd.promise();
    	},
    	_addCommitBtn : function(){
    	    var that = this;
    	    this.gridOption.buttons.push({
    	        type:"custom",
    	        name:"ok",
    	        tooltip:"저장",
    	        click:function(){
    	            Dialog.confirm({
    					msg : "근태 데이터를 서버에 저장하시겠습니까?",
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
    	                    Dialog.info("데이터 전송이 완료되었습니다.");
                        },
                        errorCallBack:function(response){
    	                    Dialog.error("데이터 전송 실패! \n ("+ response.responseJSON.message +")");
                        },
    	            });
    	        }
    	    });  
    	},
    	
    	render:function(){
            var _headSchema=Schemas.getSchema('headTemp');
    	    var _headTemp=_.template(HeadHTML);
    	    var _layout=$(LayoutHTML);
    	    var _head=$(_headTemp(_headSchema.getDefault({title:"근태 관리 ", subTitle:"근태 자료 생성"})));
    	    
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