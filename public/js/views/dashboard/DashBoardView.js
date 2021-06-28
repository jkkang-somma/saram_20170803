define([
  'jquery',
  'underscore',
  'core/BaseView',
  'log',
  'dialog',
  'comboBox',
  'i18n!nls/common',
  'monthpicker',
  'cmoment',
  'code',
  'models/dashboard/WorkingSummaryModel',
  'models/sm/SessionModel',
  'collection/rm/ApprovalCollection',
  'collection/cm/CommentCollection',
  'views/dashboard/CalendarView',
  'views/statistics/AbnormalSummaryView',
  'text!templates/layout/default.html',
  'text!templates/dashboardTemplate.html',
  'text!templates/default/head.html'
], function ($, _, BaseView, log, Dialog, ComboBox, i18Common, Monthpicker, Moment, Code, WorkingSummaryModel, SessionModel,
  ApprovalCollection, CommentCollection, CalendarView, AbnormalSummaryView, LayoutHTML, DashboardHTML, HeadHTML) {
    var LOG = log.getLogger('DashBoardView');
    // function getMinTimeString(data) {
    // 	var hour = Math.floor(data / 60);
    // 	var min = Math.floor(data % 60);
    // 	var result = "";
    // 	if (hour > 0) {
    // 		result += hour + "시간 ";
    // 	}
    // 	result += min + "분";

    // 	return result;
    // }

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
        this.commentCollection = new CommentCollection();

        //초기 검색 조건 설정 이번달. 1일 부터 말일까지.

        _defaultData.id = SessionModel.getUserInfo().id;
        _defaultData.name = SessionModel.getUserInfo().name;

        var _startDate = Moment().startOf('month').format("YYYY-MM-DD");
        var _endDate = Moment().endOf('month').format("YYYY-MM-DD HH:mm:ss");
        var _searchParams = {
          start: _startDate,
          end: _endDate,
          id: _defaultData.id
        };

        this.searchParams = _searchParams;

        _.bindAll(this, 'render');
        _.bindAll(this, 'close');
      },

      destroy: function () {
        if (this.calendarView) {
          this.calendarView.destroy();
        }
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
          if (_.isUndefined(workingSummary.length) || workingSummary.length == 0) {// 조회내역이 없을때
            // if (_firstInitialize && code != '0000') {
            if (_firstInitialize) {
              if (code != '0000') {
                var _startDate = Moment().add(-1, 'month').startOf('month').format("YYYY-MM-DD");
                var _endDate = Moment().add(-1, 'month').endOf('month').format("YYYY-MM-DD HH:mm:ss");
                var _searchParams = {
                  start: _startDate,
                  end: _endDate,
                  id: _defaultData.id
                };
                _view.searchParams = _searchParams;
              }

              _firstInitialize = false;
              _view.render();
            } else {
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
        
        var defaultData = {};
        if (_data.total_working_day === undefined) {
          // defaultData = { top_date: "자료없음" };
          defaultData = { top_date: "" };
        } else {
          if (String(_data.total_working_day).length <= 1) {
            _data.total_working_day = "0" + _data.total_working_day;
          }
          defaultData = { top_date: "(" + _params.start + " ~ " + _configEndDateArr[0] + "-" + _configEndDateArr[1] + "-" + _data.total_working_day + ")" };
        }

        //header
        var _configDateArr = _params.start.split("-");
        var title = _configDateArr[0] + i18Common.UNIT.YEAR + " " + _configDateArr[1] + i18Common.UNIT.MONTH;
        var _headTmp = _.template(HeadHTML);
        var head = $(_headTmp({ title: title, subTitle: "" }));
        layout.append(head);

        // 결재 | 코멘트 | monthPicker
        // <select id="dashboard-member-combo" class="form-control"></select> \
        layout.append(' \
      <div class="pull-right"> \
        <div class="btn-group" id="dashboard-set-yes-calendar" style="top:-15px; margin-right:10px;"></div> \
        <div class="btn-group custom-width-100" id="dashboard-member-combo-div" style="top:-15px; margin-right:10px; display: none;"><select class="btn-group" id="dashboard-member-combo" name="dashboard-member-combo"></select></div> \
				<div class="btn-group" id="privilege-btn-approval" style="top:-15px; margin-right:10px; display: none;"></div> \
				<div class="btn-group" id="privilege-btn-comment" style="top:-15px; margin-right:10px; display: none;"></div> \
				<div class="btn-group" id="monthpickerCon" style="top:-15px;"></div> \
			</div>');

        // 아래 list
        var dashboard = $(_dashboardTemp(defaultData));
        var _defaultRowHTML = '<li class="list-group-item animated  <%= action%>" title="<%= tooltip %>"><span class="badge"><%= value%></span><%= lavel%></li>';


        if (code != '0000') {
          if (this.calendarView) {
            this.calendarView.destroy();
          }
          this.calendarView = new CalendarView({ el: dashboard.find('#calendar')[0] });
          this.calendarView._draw(_params, _data.cleanDay, _data.overTimeWeek);
        } else {
          var view = new AbnormalSummaryView({ el: dashboard.find('#calendar')[0] });
          view.render('dashboard', _view.searchParams);
          dashboard.find('#calendar').css('width', '100%');
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
        if (code != '0000') {
          var _disableField = ["id", "name", "total_working_day", "total_over_time", "total_holiday_over_time", "over_over_time", "over_holiday_over_time", "total_early_time"];
          var timeout = function (data, name, isTop) {

            _delay = _delay + 200;

            setTimeout(function () {
              _action = !_action;
              var rowTmp = _.template(_defaultRowHTML);
              var param = {}

              if (isTop) {
                param = {
                  value: data,
                  lavel: name,
                  action: _action ? "fadeInLeftBig dashboard-top-li" : "fadeInUp dashboard-top-li",
                  class: "dashboard-top-li",
                  tooltip: ""
                }
                if (name.startsWith("평균")) {
                  param.action += " tooltip-marker"
                  param.tooltip = "휴가(반차 포함)를 사용하지 않은 평일 기준 &#10;외근 제외 ( 단, 장기외근은 포함 )&#10;출근/퇴근 기록이 모두 있는 날만 계산";
                }
              } else {
                param = {
                  value: data + getUnit(name.toUpperCase()),
                  lavel: i18Common.DASHBOARD.WORKING_SUMMARY[name.toUpperCase()],
                  action: _action ? "fadeInLeftBig" : "fadeInUp",
                  class: "",
                  tooltip: ""
                }
              }
              var row = rowTmp(param);

              dashboard.find("#list-group").append(row);
            }, _delay);
          };

          // 올해 잔여 연차 일수
          if (_data.vacation_year === _view.searchParams.start.substr(0, 4)) {
            timeout(_data.vacation_year_remain, "잔여 연차 " + _data.vacation_year, true);
          }
          delete _data.vacation_year;
          delete _data.vacation_year_remain;

          // 평균 출근 시간
          if (_data.in_time_avg) {
            timeout(_data.in_time_avg.substr(0, 5), "평균 출근시간", true);

            // 평균 퇴근 시간
            timeout(_data.out_time_avg.substr(0, 5), "평균 퇴근시간", true);
          }
          delete _data.in_time_avg;
          delete _data.out_time_avg;
          delete _data.cleanDay;
          delete _data.overTimeWeek;

          for (var name in _data) {
            // if ((_.indexOf(_validField, name.toUpperCase()) > -1 && _data[name] == 0) || _.indexOf(_disableField, name) > -1) {
            if (_data[name] == 0 || _.indexOf(_disableField, name) > -1) {
              continue;
            }

            timeout(_data[name], name);
          }
        }

        // timeout(getMinTimeString(_data.total_over_time)+"("+_data.over_over_time+")", "total_over_time");
        // timeout(getMinTimeString(_data.total_holiday_over_time)+"("+_data.over_holiday_over_time+")", "total_holiday_over_time");
        // timeout(getMinTimeString(_data.total_early_time), "total_early_time");

        // 캘린더 보기 옵션
        var yesCalendarOn = localStorage.getItem('yesCalendarOn');
        if (yesCalendarOn === undefined || yesCalendarOn === null) {
          localStorage.setItem('yesCalendarOn', "true");
          yesCalendarOn = "true";
        }

        var appendDiv;
        if (yesCalendarOn === "true") {
          appendDiv = $('<div>일정 ON</div>').attr('class', 'btn btn-success');
        } else {
          appendDiv = $('<div>일정 OFF</div>').attr('class', 'btn btn-default');
        }
        // var appendDiv = $('<div>').attr('class', 'btn btn-success');
        // appendDiv.append('일정 ON');
        // console.log("일정 설정 done");
        $('.btn-group#dashboard-set-yes-calendar').append(appendDiv).after(function () {
          $(this).click(function (event) {
            if (event.target.innerHTML.indexOf("ON") >= 0) {
              // turn OFF
              event.target.innerHTML = "일정 OFF";
              event.target.className = "btn btn-default"
              localStorage.setItem('yesCalendarOn', "false");

              $("#dashboard_main .calendar-body .text.yes-calendar-rows").addClass("display-off");
            } else {
              // turn ON
              event.target.innerHTML = "일정 ON";
              event.target.className = "btn btn-success"
              localStorage.setItem('yesCalendarOn', "true");

              $("#dashboard_main .calendar-body .text.yes-calendar-rows").removeClass("display-off");
            }
            
            // console.log(event);
          });
        });


        // 부서장 이상인 경우 직원들의 대시보드를 볼 수 있도록 한다. 임원 부서의 경우 대시보드에 달력이 나오지 않기때문에 선택하지 않음.
        if (SessionModel.getUserInfo().admin >= 1 && SessionModel.getUserInfo().dept_code !== '0000') {
          var memberCombo = $(this.el).find('#dashboard-member-combo');

          var userHtml = "<option value='" + SessionModel.getUserInfo().id + "'>" + SessionModel.getUserInfo().name + "</option>";
          memberCombo.append(userHtml);

          var userCodeCollection = Code.getCollection("user");

          for (var i = 0; i < userCodeCollection.models.length; i++) {
            var user = userCodeCollection.models[i];
            if (user.get('name') === SessionModel.getUserInfo().name) {
              continue;
            }
            if (SessionModel.getUserInfo().admin === 1) {
              if (user.get('dept_code') !== SessionModel.getUserInfo().dept_code) {
                continue;
              }
            }

            userHtml = "<option value='" + user.get('code') + "'>" + user.get('name') + "</option>";
            memberCombo.append(userHtml);
          }

          ComboBox.createCombo(memberCombo);
          memberCombo.selectpicker("val", _view.searchParams.id);
          // todo show
          $('.btn-group#dashboard-member-combo-div').show();

          memberCombo.change(function (value) {
            _view.searchParams.id = memberCombo.val();
            _view.render();
          });
        }

        if (SessionModel.getUserInfo().privilege == '1') {
          // <div class="btn btn-success">미결 : <span style="font-weight: bold; margin-left: 10px;"> 0 </span> 건</div>
          if ($('.btn-group#privilege-btn-approval').children().length == 0) {
            var appendDiv = $('<div>').attr('class', 'btn btn-success');
            appendDiv.append('결재 : ');
            var spanCon = $('<span>').attr('style', 'font-weight: bold; margin-left: 10px;');
            spanCon.append(0);
            appendDiv.append(spanCon);
            appendDiv.append(" 건");
            $('.btn-group#privilege-btn-approval').append(appendDiv).after(function () {
              $(this).click(function () {
                var $this = $(this);
                var num = $this.find('span').html();
                var reportParam = $this.data('data');
                var endDate = reportParam.endDate.split(" ");
                window.location.href = "#reportmanager/" + reportParam.startDate + "/" + endDate[0];
              });
            });
          }

          if ($('.btn-group#privilege-btn-comment').children().length == 0) {
            var appendDiv = $('<div>').attr('class', 'btn btn-success');
            appendDiv.append('코멘트 : ');
            var spanCon = $('<span>').attr('style', 'font-weight: bold; margin-left: 10px;');
            spanCon.append(0);
            appendDiv.append(spanCon);
            appendDiv.append(" 건");
            $('.btn-group#privilege-btn-comment').append(appendDiv).after(function () {
              $(this).click(function () {
                var $this = $(this);
                window.location.href = "#commentmanager/submit/void";
              });
            });
          }

          var today = new Date();
          var firstDay = new Date(today.getFullYear(), today.getMonth() - 1, 1);
          var lastDay = new Date(today.getFullYear() + 1, today.getMonth() - 1, 1);

          var reportParam = {
            managerId: SessionModel.getUserInfo().id,
            startDate: Moment(firstDay).format("YYYY-MM-DD"),
            endDate: Moment(new Date(lastDay - 1)).format("YYYY-MM-DD"),
          };

          _view.approvalCollection.fetch({
            data: reportParam,
            success: function (result) {
              $('.btn-group#privilege-btn-approval').find('span').html(result.length);
              $('.btn-group#privilege-btn-approval').data('data', reportParam);

              var btnCon = $('.btn-group#privilege-btn-approval').find('.btn');
              btnCon.removeClass('btn-success');
              btnCon.removeClass('btn-danger');
              if (result.length > 0) {
                btnCon.addClass('btn-danger');
              } else {
                btnCon.addClass('btn-success');
              }
              $('.btn-group#privilege-btn-approval').show();
            },
            error: function (result) {

            }
          });

          _view.commentCollection.fetch({
            data: reportParam,
            success: function (result) {
              $('.btn-group#privilege-btn-comment').find('span').html(result.models[0].attributes.CommentCount);
              $('.btn-group#privilege-btn-comment').data('data', reportParam);

              var btnCon = $('.btn-group#privilege-btn-comment').find('.btn');
              btnCon.removeClass('btn-success');
              btnCon.removeClass('btn-danger');
              if (result.models[0].attributes.CommentCount > 0) {
                btnCon.addClass('btn-danger');
              } else {
                btnCon.addClass('btn-success');
              }
              $('.btn-group#privilege-btn-comment').show();
            },
            error: function (result) {

            }
          });
        }

        //button monthpicker 
        new Monthpicker({
          el: ".btn-group#monthpickerCon",
          callBack: function (value) {
            var _startDate = Moment(value, "YYYY-MM").startOf('month').format("YYYY-MM-DD");
            var _endDate = Moment(value, "YYYY-MM-DD HH:mm:ss").endOf('month').format("YYYY-MM-DD HH:mm:ss");
            _view.searchParams.start = _startDate;
            _view.searchParams.end = _endDate;
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

          _view.searchParams.start = _startDate;
          _view.searchParams.end = _endDate;
          _view.render();
        });

        this.afterBtn.on('click', function () {
          var value = _view.searchParams.start;
          var _startDate = Moment(value, "YYYY-MM-DD").add(1, 'month').startOf('month').format("YYYY-MM-DD");
          var _endDate = Moment(value, "YYYY-MM-DD HH:mm:ss").add(1, 'month').endOf('month').format("YYYY-MM-DD HH:mm:ss");

          _view.searchParams.start = _startDate;
          _view.searchParams.end = _endDate;
          _view.render();
        });

      }
    });
    return DashBoardView;
  });