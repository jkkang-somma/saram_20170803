define([
	'jquery',
	'underscore',
	'core/BaseView',
	'log',
	'dialog',
	'i18n!nls/common',
	'monthpicker',
	'cmoment',
	'models/dashboard/WorkingSummaryModel',
	'models/sm/SessionModel',
	'collection/rm/ApprovalCollection',
	'views/dashboard/CalendarView',
	'views/statistics/DeptSummaryView',
	'text!templates/layout/default.html',
	'text!templates/dashboardTemplate.html',
	'text!templates/default/head.html'
], function ($, _, BaseView, log, Dialog, i18Common, Monthpicker, Moment, WorkingSummaryModel, SessionModel, ApprovalCollection, CalendarView, DeptSummaryView, LayoutHTML, DashboardHTML, HeadHTML) {
	var LOG = log.getLogger('DashBoardView');
	function getMinTimeString(data) {
		var hour = Math.floor(data / 60);
		var min = Math.floor(data % 60);
		var result = "";
		if (hour > 0) {
			result += hour + "시간 ";
		}
		result += min + "분";

		return result;
	}

	var _defaultData = {
		id: "",
		name: "",
		total_working_day: 0,
		perception: 0,
		sick_leave: 0,
		absenteeism: 0,
		vacation: 0,
	};
	var _firstInitialize = true;

	var DashBoardView = BaseView.extend({
		initialize: function () {
			var view = this;
			this.model = new WorkingSummaryModel({ _id: "-1" });
			this.approvalCollection = new ApprovalCollection();

			//초기 검색 조건 설정 이번달. 1일 부터 말일까지.

			_defaultData.id = SessionModel.getUserInfo().id;
			_defaultData.name = SessionModel.getUserInfo().name;


			var _startDate = Moment().startOf('month').format("YYYY-MM-DD");
			var _endDate = Moment().endOf('month').format("YYYY-MM-DD HH:mm:ss");
			var _searchParams = {
				start: _startDate,
				end: _endDate
			};

			this.searchParams = _searchParams;

			_.bindAll(this, 'render');
			_.bindAll(this, 'close');
		},
		getWorkingSummary: function (params) {
			var _view = this;
			var dfd = new $.Deferred();
			this.model.fetch({
				data: params,
				success: function (model, result) {
					dfd.resolve(result);
				},
				error: function () {
					dfd.reject();
				}
			});
			return dfd.promise();
		},

		render: function () {
			var _view = this;

			this.getWorkingSummary(_view.searchParams).done(function (workingSummary) {
				var code = SessionModel.getUserInfo().dept_code;
				if (workingSummary.length == 0) {// 조회내역이 없을때
					// if (_firstInitialize && code != '0000') {
					if (_firstInitialize) {
						if(code != '0000'){							
							var _startDate = Moment().add(-1, 'month').startOf('month').format("YYYY-MM-DD");
							var _endDate = Moment().add(-1, 'month').endOf('month').format("YYYY-MM-DD HH:mm:ss");
							var _searchParams = {
									start: _startDate,
									end: _endDate
							};
							_view.searchParams = _searchParams;
						}

						_firstInitialize = false;
						_view.render();
					}else {
						_view.workingSummary = _defaultData;
						_view.draw(code);
					}
				} else {
					_view.workingSummary = workingSummary[0];
					_view.draw(code);
				}

				
			}).fail(function () {

			});
		},
		draw: function (code) {
			var _view = this;
			if (_firstInitialize) {//첫 수행
				_firstInitialize = false;
			}
			var _data = _view.workingSummary;
			var _params = _view.searchParams;

			var layout = $(LayoutHTML);

			var _dashboardTemp = _.template(DashboardHTML);
			var _configEndDateArr = _params.end.split("-");
			if (String(_data.total_working_day).length <= 1) {
				_data.total_working_day = "0" + _data.total_working_day;
			}
			var defaultData = {
				top_date: _data.total_working_day == 0 ? "자료없음" : "(" + _params.start + " ~ " + _configEndDateArr[0] + "-" + _configEndDateArr[1] + "-" + _data.total_working_day + ")"
			};

			//header
			var _configDateArr = _params.start.split("-");
			var title = _configDateArr[0] + i18Common.UNIT.YEAR + " " + _configDateArr[1] + i18Common.UNIT.MONTH;
			var _headTmp = _.template(HeadHTML);
			var head = $(_headTmp({ title: title, subTitle: "" }));
			layout.append(head);

			//button
			layout.append('<div class="pull-right"><div class="btn-group" id="privilege-btn" style="top:-15px; margin-right:10px; display: none;"></div><div class="btn-group" id="monthpickerCon" style="top:-15px;"></div></div>');

			// 아래 list
			var dashboard = $(_dashboardTemp(defaultData));
			var _defaultRowHTML = '<li class="list-group-item animated  <%= action%>"><span class="badge"><%= value%></span><%= lavel%></li>';

			
			if(code != '0000'){
				var calendarView = new CalendarView({ el: dashboard.find('#calendar')[0] });
				calendarView._draw(_params);
			}else{
				var view = new DeptSummaryView({ el: dashboard.find('#calendar')[0] });
				view.render('dashboard', _view.searchParams) ;
				dashboard.find('#calendar').css('width', '100%')
			}

			layout.append(dashboard);

			$(this.el).html(layout);
			//fadeInLeftBig
			var _delay = 100;
			var _action = true;
			var getUnit = function (key) {
				var result;
				switch (key) {
					case "TOTAL_OVERTIEM_PAY":
						result = i18Common.UNIT.WON;
						break;
					case "TOTAL_OVER_TIME":
					case "TOTAL_HOLIDAY_OVER_TIME":
					case "OVER_OVER_TIME":
					case "OVER_HOLIDAY_OVER_TIME":
					case "TOTAL_EARLY_TIME":
						result = "";
						break;
					default:
						if (key == "ID" || key == "NAME") {
							result = "";
						} else {
							result = i18Common.UNIT.DAY;
						}
				}
				return result;
			};

			// var _validField = ["NIGHT_WORKING_A", "NIGHT_WORKING_B", "NIGHT_WORKING_C", "HOLIDAY_WORKING_A", "HOLIDAY_WORKING_B", "HOLIDAY_WORKING_C"];
			if(code != '0000'){
				var _disableField = ["id", "name","total_working_day", "total_over_time", "total_holiday_over_time", "over_over_time", "over_holiday_over_time", "total_early_time"];
				var timeout = function (data, name) {
	
					_delay = _delay + 200;
	
					setTimeout(function () {
						_action = !_action;
						var rowTmp = _.template(_defaultRowHTML);
						var row = rowTmp(
							{
								value: data + getUnit(name.toUpperCase()),
								lavel: i18Common.DASHBOARD.WORKING_SUMMARY[name.toUpperCase()],
								action: _action ? "fadeInLeftBig" : "fadeInUp"
							}
						);
	
						dashboard.find("#list-group").append(row);
					}, _delay);
				};
	
				for (var name in _data) {
					// if ((_.indexOf(_validField, name.toUpperCase()) > -1 && _data[name] == 0) || _.indexOf(_disableField, name) > -1) {
					if ( _data[name] == 0 || _.indexOf(_disableField, name) > -1){
						continue;
					}
					
	
					timeout(_data[name], name);
	
				}
			}

			// timeout(getMinTimeString(_data.total_over_time)+"("+_data.over_over_time+")", "total_over_time");

			// timeout(getMinTimeString(_data.total_holiday_over_time)+"("+_data.over_holiday_over_time+")", "total_holiday_over_time");

			// timeout(getMinTimeString(_data.total_early_time), "total_early_time");

			if(SessionModel.getUserInfo().privilege == '1'){
				// <div class="btn btn-success">미결 : <span style="font-weight: bold; margin-left: 10px;"> 0 </span> 건</div>
				if($('.btn-group#privilege-btn').children().length == 0){
					var appendDiv = $('<div>').attr('class', 'btn btn-success');
					appendDiv.append('미결 : ');
					var spanCon = $('<span>' ).attr('style', 'font-weight: bold; margin-left: 10px;');
					spanCon.append(0);
					appendDiv.append(spanCon);
					appendDiv.append(" 건");
					$('.btn-group#privilege-btn').append(appendDiv).after(function(){
						$(this).click(function(){
							var $this = $(this);
							var num = $this.find('span').html();
							if(parseInt(num) > 0){
								var reportParam = $this.data('data');
								var endDate = reportParam.endDate.split(" ");
								window.location.href = "#reportmanager/" +  reportParam.startDate + "/" + endDate[0] ;
							}
						});
					});
				}

				var thisYear = parseInt(_view.searchParams.start.substring(0, 4));
				var reportParam = {
					managerId : SessionModel.getUserInfo().id,
					startDate : (thisYear - 1) + "-01-01",
					endDate : (thisYear + 1) + "-12-31",
				};
									
				_view.approvalCollection.fetch({ 
					data: reportParam,
					success: function(result) {
						$('.btn-group#privilege-btn').find('span').html(result.length);
						$('.btn-group#privilege-btn').data('data', reportParam);		

						var btnCon = $('.btn-group#privilege-btn').find('.btn');
						btnCon.removeClass('btn-success');
						btnCon.removeClass('btn-danger');
						if(result.length > 0){
							btnCon.addClass('btn-danger');
						}else{
							btnCon.addClass('btn-success');
						}
						$('.btn-group#privilege-btn').show();
					},
					error : function(result) {
						
					}
				}); 

			}

			//button monthpicker 
			new Monthpicker({
				el: ".btn-group#monthpickerCon",
				callBack: function (value) {
					var _startDate = Moment(value, "YYYY-MM").startOf('month').format("YYYY-MM-DD");
					var _endDate = Moment(value, "YYYY-MM-DD HH:mm:ss").endOf('month').format("YYYY-MM-DD HH:mm:ss");
					var _searchParams = {
						start: _startDate,
						end: _endDate
					};
					_view.searchParams = _searchParams;
					_view.render();
				}
			});

			_view.addEvent();
		},
		addEvent: function () {
			var _view = this;
			this.preBtn = $("#beforeBtn");
			this.afterBtn = $("#afterBtn");
			this.preBtn.on('click', function () {
				var value = _view.searchParams.start;
				var _startDate = Moment(value, "YYYY-MM-DD").add(-1, 'month').startOf('month').format("YYYY-MM-DD");
				var _endDate = Moment(value, "YYYY-MM-DD HH:mm:ss").add(-1, 'month').endOf('month').format("YYYY-MM-DD HH:mm:ss");
				var _searchParams = {
					start: _startDate,
					end: _endDate
				};
				_view.searchParams = _searchParams;
				_view.render();
			});

			this.afterBtn.on('click', function () {
				var value = _view.searchParams.start;
				var _startDate = Moment(value, "YYYY-MM-DD").add(1, 'month').startOf('month').format("YYYY-MM-DD");
				var _endDate = Moment(value, "YYYY-MM-DD HH:mm:ss").add(1, 'month').endOf('month').format("YYYY-MM-DD HH:mm:ss");
				var _searchParams = {
					start: _startDate,
					end: _endDate
				};
				_view.searchParams = _searchParams;
				_view.render();
			});

		}
	});
	return DashBoardView;
});