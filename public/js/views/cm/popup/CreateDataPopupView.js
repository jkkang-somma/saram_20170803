define([ 
	'jquery',
	'underscore',
	'backbone',
	'util',
	'cmoment',
	'resulttimefactory',
	'dialog',
	'i18n!nls/common',
	'lib/component/form',
	'collection/common/HolidayCollection',
	'collection/common/RawDataCollection',
	'collection/sm/UserCollection',
	'collection/cm/CommuteCollection',
	'collection/vacation/OutOfficeCollection',
	'collection/vacation/InOfficeCollection',
	'text!templates/default/datepicker.html',
	'text!templates/inputForm/label.html',
], function(
	$, _, Backbone, Util, Moment, ResultTimeFactory, Dialog, i18nCommon, Form,
	HolidayCollection, RawDataCollection, UserCollection, CommuteCollection, OutOfficeCollection, InOfficeCollection,
	DatePickerHTML, LabelHTML
) {
	var resultTimeFactory = ResultTimeFactory.Builder;
	var ChangeHistoryPopupView = Backbone.View.extend({
		initialize : function(data) {
			this.date = data.date;
		},
		render : function(el) {
			var dfd= new $.Deferred();
            
            if (!_.isUndefined(el)){
    	        this.el=el;
    	    }
    	    var _view = this;
    	    var _form = new Form({
    	        el:_view.el,
    	        form:undefined,
    	         childs:[{
	                type:"date",
	                name:"startDate",
	                label:i18nCommon.CREATE_RAW_DATA.CREATE.START_DATE,
	                value: _.isNull(this.date) ? "2015-01-01" : Moment(this.date).add(1,'days'),
	                format:"YYYY-MM-DD",
	                disabled:true,
    	        }, {
	                type:"date",
	                name:"endDate",
	                label:i18nCommon.CREATE_RAW_DATA.CREATE.END_DATE,
	                format:"YYYY-MM-DD",
    	        }, {
    	        	type:"text",
    	        	name:"memo",
    	        	label:i18nCommon.CREATE_RAW_DATA.CREATE.TIP,
    	        	disabled:true,
    	        	value: i18nCommon.CREATE_RAW_DATA.CREATE.TIP_TEXT
    	        }]
    	    });
    	    
    	    _form.render().done(function(){
    	        _view.form=_form;
    	        dfd.resolve();
    	    }).fail(function(){
    	        dfd.reject();
    	    });  
	    
            return dfd.promise();
		},
		createData : function(){
    	    var dfd = new $.Deferred();
    	    
    	    var data = this.form.getData();
    	    
    	    var resultCollection = new CommuteCollection();
    	    var startDate = Moment(data.startDate, resultTimeFactory.DATEFORMAT);
            var endDate = Moment(data.endDate, resultTimeFactory.DATEFORMAT);
            var yesterday = Moment(startDate).subtract(1, 'days');
            
            if(startDate.isAfter(endDate)){
                Dialog.error(i18nCommon.CREATE_RAW_DATA.CREATE.DATE_ERR_MSG);
                dfd.reject();
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
            var inOfficeCollection = new InOfficeCollection();
            
            $.when(
                rawDataCollection.fetch({data: { start : selectedDate.start, end:endDate.add(1,"days").format(ResultTimeFactory.DATEFORMAT) }}),
                userCollection.fetch(),
                holidayCollection.fetch({ data : {  year : startDate.year() } }),
                outOfficeCollection.fetch({data : selectedDate}),
                inOfficeCollection.fetch({data : selectedDate}),
                yesterdayCommuteCollection.fetchDate(yesterday.format(ResultTimeFactory.DATEFORMAT))
            ).done(function(){
                var diff_days = endDate.diff(startDate, 'days');

                _.each(userCollection.models, function(userModel, idx){     // 사용자별로 데이터 생성
                    var today = Moment(startDate);
                    var userId = userModel.attributes.id;
                    var userName = userModel.attributes.name;
                    var userDepartment = userModel.attributes.dept_name;
                    
                    if( userDepartment == "무소속" || userDepartment==="임원" || userId == "000000"){
                        
                    }else{
                        var yesterdayAttribute = {};
                        
                        var userRawDataCollection = new RawDataCollection(); // 해당 사용자의 출입기록 Collection
                        userRawDataCollection.add(rawDataCollection.where({id: userId}));
                        
                        var userOutOfficeCollection = new OutOfficeCollection(); // 해당 사용자의 OutOffice Collection
                        userOutOfficeCollection.add(outOfficeCollection.where({id: userId}));
                        
                        var userInOfficeCollection = new InOfficeCollection();
                        userInOfficeCollection.add(inOfficeCollection.where({id: userId}));
                        
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
                            
                            var todayInOffice = userInOfficeCollection.where({date:todayStr});
                            resultTimeFactory.setInOffice(todayInOffice);
                            
                            
                            // 당일 사용자의 출입기록을 보고 출근 / 퇴근/  가장 빠른,늦은시간 출입 기록을 구한다
                            var rawData = userRawDataCollection.filterDate(todayStr);
                            _.each(rawData, function(rawDataModel){
                                var destTime = Moment(rawDataModel.get("char_date"));
                                var type  = rawDataModel.get("type");
                                resultTimeFactory.checkTime(destTime, type);   
                            });
                            
                            // 결과 저장
                            var result = resultTimeFactory.getResult();
                            resultCollection.add(result);
                            
                            // 다음날 계산을 위해 결과를 yesterdayAttribute에 저장
                            yesterdayAttribute = result;
                            
                            today.add(1, 'days');
                        }
                    }
                });
                dfd.resolve(resultCollection.toJSON());
            });  
            return dfd.promise();
		}
		
	});
	
	return ChangeHistoryPopupView;
});