/**
 * 2017.08.03. ~ 2017.08.25.. 
 */
define([
  'jquery',
  'underscore',
  'backbone',
  'code',
  'cmoment',
  'util',
  'schemas',
  'dialog',
  'i18n!nls/common',
  'models/sm/SessionModel',
  'collection/dashboard/AttendanceCollection',
  'collection/dashboard/CommuteSummaryCollection',
  'collection/common/HolidayCollection',
  'collection/vacation/InOfficeCollection',
  'collection/vacation/OutOfficeCollection',
  'collection/yescalendar/YesCalendarCollection',
  'text!templates/calendarTemplateBase.html',
  'views/rm/AddNewReportView',
  'views/yescalendar/popup/YesCalendarDialog',
], function ($, _, Backbone, Code, Moment, Util, Schemas, Dialog, i18nCommon, SessionModel, AttendanceCollection, CommuteSummaryCollection, HolidayCollection,
  InOfficeCollection, OutOfficeCollection, YesCalendarCollection, calendarHTML, AddNewReportView, YesCalendarDialog) {

    var CalendarView = Backbone.View.extend({

      elements: {
        targetUserId: "",
        _isShowPopup: 0, // 0: none , 1: ignore, 2: display
        cleanDay: "",
        overTimeWeek: [],
        startDate: "",
        endDate: "",
        yesCalendarWeekData: [{
          startWeekDay: "", // 일주일 시작일
          endWeekDay: "",   // 일주일 종료일
          calData: {}       // 해당 기간에 출력해야할 스케쥴 
        }],
        yesCalendarDataAll: {}
      },
      initialize: function (opt) {
        this.$el = $(opt.el);
        this.commuteSummaryCollection = new CommuteSummaryCollection();
        this.attendanceCollection = new AttendanceCollection();
        this.holidayCollection = new HolidayCollection();
        this.yesCalendarCollection = new YesCalendarCollection();
        this._today = new Moment().format("YYYY-MM-DD");

        this.elements._bindEvent1 = _.bind(this.resetPopupMenu, this);
        $(window).on("click", this.elements._bindEvent1);
      },

      destroy: function () {
        $(window).off("click", this.elements._bindEvent1);
      },

      events: {
        'click #calendarSubmit': 'onClickOpenOvertimePopup',
        'click .cc-header.clickable': 'onClickDayLink',
        'click td': 'onClickDaySubmit',
        'click .yes-cal-row.empty': 'onClickDaySubmit',
        'click #submit_item' : 'onClickSubmitMenu',
        'click #add_yescalendar' : 'onClickAddYesCalendarMenu',
        'click .yes-cal-row .clickable': 'onClickYesCalendarItem',
      },
      _draw: function (params, cleanDay, overTimeWeek) {
        this.elements.targetUserId = params.id;
        this.elements.cleanDay = cleanDay;
        this.elements.overTimeWeek = overTimeWeek;
        this.elements.startDate = params.start;
        this.elements.endDate = params.end;
        
        var _view = this;
        var yearData = new Moment(params.start);
        _view.getHolidaySummary({ year: yearData.year() }).done(function (result) { // 휴일 조회
          _view.holiday = result;
          _view.getInOutofficeSummary(params).done(function (result) {
            _view.inOutData = result;
            _view.getAttendance(params).done(function (result) {  // 출입 기록 조회
              _view.attendance = result;
              _view.getCommuteSummary(params).done(function (result) {
                _view.commuteSummary = result;
                _view.getYesCalendar(params).done(function (result) {
                  _view.yesCalendarDataList = result;
                  _view.drawCalendar(params);
                });
              }).fail(function () {

              });
            }).fail(function () {

            });
          });
        }).fail(function () {

        });

      },

      getHolidaySummary: function (params) {
        var _view = this;
        var dfd = new $.Deferred();
        this.holidayCollection.fetch({
          data: params,
          success: function (collection, result) {
            _view.overTimeDay = Util.getApprovalLimitDate(_view.holidayCollection)
            dfd.resolve(result);
          },
          error: function () {
            dfd.reject();
          }
        });
        return dfd.promise();
      },

      getInOutofficeSummary: function (params) {
        var _view = this;
        var dfd = new $.Deferred();

        var inOfficeCollection = new InOfficeCollection();
        var outOfficeCollection = new OutOfficeCollection();

        $.when(
          outOfficeCollection.fetch({
            data: params
          }),
          inOfficeCollection.fetch({
            data: params
          })
        ).done(function () {
          var data = {
            outoffice: outOfficeCollection.filterID(params.id),
            inoffice: inOfficeCollection.filterID(params.id)
          };
          dfd.resolve(data);
        });

        return dfd.promise();
      },

      getCommuteSummary: function (params) {
        var _view = this;
        var dfd = new $.Deferred();
        this.commuteSummaryCollection.fetch({
          data: params,
          success: function (commuteSummaryCollection, result) {
            dfd.resolve(result);
          },
          error: function () {
            dfd.reject();
          }
        });
        return dfd.promise();
      },

      getYesCalendar: function(params) {
        var _view = this;
        var dfd = new $.Deferred();
        
        this.yesCalendarCollection.fetch({
          data: params,
          success: function (yesCalendarCollection, result) {
            dfd.resolve(result);
          },
          error: function () {
            dfd.reject();
          }
        });
        return dfd.promise();
      },

      getAttendance: function (params) {
        var _view = this;
        var dfd = new $.Deferred();
        this.attendanceCollection.fetch({
          data: params,
          success: function (attendanceCollection, result) {
            dfd.resolve(result);
          },
          error: function () {
            dfd.reject();
          }
        });
        return dfd.promise();
      },

      drawHoliday: function (selDate) {
        var _view = this;
        var thisMonth = new Moment(selDate);
        thisMonth = thisMonth.month();
        _.each(_view.holiday, function (dd) {
          var holDate = new Moment(dd.date);
          var holMonth = holDate.month();
          if (thisMonth == holMonth) {
            // console.log(dd);
            var holId = holDate.format("YYYY-MM-DD");
            var holCon = $(_view.el).find('#' + holId);
            holCon.addClass('holiday');
            // cc-header
            holCon.find('.cc-header').append('<span>' + dd.memo + '</span>')
          }

        });
      },

      drawCleanDay: function () {
        var _view = this;
        if (this.elements.cleanDay === "") {
          return;
        }

        var toDay = new Moment().format('YYYY-MM-DD');
        if (this.elements.cleanDay < toDay) {
          return;
        }

        var cleanDayEl = $(_view.el).find('#' + this.elements.cleanDay);
        if (cleanDayEl.length === 1) {
          cleanDayEl.addClass('clean-day');
          cleanDayEl.attr('title', '쾌적한 근무 환경 및 임직원 건강을 위해 청소하는 날입니다~');
        }
      },

      drawOverTimeWeek: function () {
        var _view = this;
        if (SessionModel.getUserInfo().admin !== Schemas.ADMIN) {
          return;
        }
        if (this.elements.overTimeWeek === []) {
          return;
        }

        for (var overTime of this.elements.overTimeWeek) {
          if (overTime.overTime) {
            var baseDate = overTime.date;
            var overTimeEl = $(_view.el).find('#' + baseDate + " .over-time");
            if (overTimeEl.length === 1) {
              overTimeEl.html(Util.timeformat(overTime.overTime, true));
              if (overTime.overTime > 720) {
                overTimeEl.addClass("red");
              }
            }
          }
        }
      },

      refreshYesCalendarData: function() {
        var _this = this;
        this.getYesCalendar({start: this.elements.startDate, end: this.elements.endDate}).done(function (result) {
          _this.yesCalendarDataList = result;
          _this.drawYesCalendar();
        })
      },

      drawYesCalendar: function() {

        // 초기화
        $(".yes-cal-row").remove();
        this.elements.yesCalendarDataAll = {};
        for (var weekData of this.elements.yesCalendarWeekData) {
          weekData.calData = {};
        }

        // 출력 시작
        for (var calendarItem of this.yesCalendarDataList) { // max unlimit
          this.elements.yesCalendarDataAll[calendarItem.calendar_id] = calendarItem;
          for (var weekData of this.elements.yesCalendarWeekData) { // max 6
            if ( (weekData.startWeekDay <= calendarItem.start && weekData.endWeekDay >= calendarItem.start) ||
                 (weekData.startWeekDay <= calendarItem.end && weekData.endWeekDay >= calendarItem.end) ||
                 (weekData.startWeekDay > calendarItem.start && weekData.endWeekDay < calendarItem.end) // 주 전체를 그려야할 일정
               ) {
              // 몇일자인지 확인 후 일주일 단위 내에서 모든 일자의 자리 정보를 확인한다.
              
              // 캘린더 상에 출력 시작일 ( 일주일 이내 )
              var calStartDate = calendarItem.start;
              if (calStartDate < weekData.startWeekDay) {
                calStartDate = weekData.startWeekDay;
              }

              // 캘린더 상에 출력 종료일 ( 일주일 이내 )
              var calEndDate = calendarItem.end;
              if (calEndDate > weekData.endWeekDay) {
                calEndDate = weekData.endWeekDay;
              }

              // 일주일 내에서 출력 일 수
              calEndDateMoment = Moment(calEndDate);
              calStartDateMoment = Moment(calStartDate);
              var weekDateDiff = calEndDateMoment.diff(calStartDateMoment, "days") + 1;

              // 들어갈 자리가 있는지 확인
              if (_.isUndefined(weekData.calData[calStartDate])) {
                weekData.calData[calStartDate] = [];
              }

              var tmpMoment = Moment(calStartDate);
              var findIndex = -1;
              
              // var isFind = false;
              while(true) {
                for (var dIdx = 0 ; dIdx < weekDateDiff ; dIdx++ ) {
                  var dIdxDateStr = tmpMoment.format('YYYY-MM-DD');
                  
                  if (_.isUndefined(weekData.calData[dIdxDateStr])) {
                    weekData.calData[dIdxDateStr] = [];
                  }

                  if (dIdx === 0 && findIndex == -1) {
                    // 최초 1회만 실시
                    var findEmptyIndex = weekData.calData[dIdxDateStr].findIndex(function(s) { return s === "empty"});
                    if (findEmptyIndex === -1) {
                      findIndex = weekData.calData[dIdxDateStr].length;
                    } else {
                      findIndex = findEmptyIndex;
                    }
                  } else {
                    if (weekData.calData[dIdxDateStr][findIndex] !== undefined && weekData.calData[dIdxDateStr][findIndex] !== "empty") {
                      // isFind = false;
                      break;
                    }
                  }

                  tmpMoment.add(1, "days");
                }

                if (dIdx === weekDateDiff) {
                  // Find Index!!
                  break;
                }
                findIndex++; // 자리를 찾지 못했을 경우 한칸 아래로 다시 검색
              }

              // LOG!!!!
              // console.log(`${calStartDate} - ${calEndDate} - ${weekDateDiff} : ${calendarItem.title} - line index : ${findIndex}`);

              // DOM 출력
              var yesCalendarEl = $(this.el).find("#" + calStartDate + " .yes-calendar-rows");

              if ( findIndex > yesCalendarEl.children().length ) {
                for (var emptyIdx = 0 ; emptyIdx < findIndex ; emptyIdx++) {
                  // 빈칸 출력
                  yesCalendarEl.append('<div class="yes-cal-row empty">  </div>');
                }
              }

              // var $calTemplate = '<div class="day-<DAY_COUNT>" style="background:<COLOR>"> <TITLE> </div>';
              
              var targetEl = yesCalendarEl.children().eq(findIndex);
              if (targetEl.length === 1) {
                var $calTemplate2 = $('<div>');
                targetEl.removeClass("empty");
                targetEl.append(
                  $calTemplate2.addClass("yes-cal-row-item")
                    .addClass("day-" + weekDateDiff)
                    .addClass("clickable")
                    .text(calendarItem.title)
                    .attr("data", calendarItem.calendar_id)
                    .css("color", calendarItem.fcolor)
                    .css("background", calendarItem.color));
              } else {
                var $calTemplate1 = $('<div class="yes-cal-row">  </div>');
                var $calTemplate2 = $('<div>');
                
                yesCalendarEl.append(
                  $calTemplate1.append(
                    $calTemplate2.addClass("yes-cal-row-item")
                      .addClass("day-" + weekDateDiff)
                      .addClass("clickable")
                      .text(calendarItem.title)
                      .attr("data", calendarItem.calendar_id)
                      .css("color", calendarItem.fcolor)
                      .css("background", calendarItem.color))
                )
              }

              // 출력 자리 셋팅 ( 메모리 상 자리 설정 )
              tmpMoment = Moment(calStartDate);
              for (var dIdx = 0 ; dIdx < weekDateDiff ; dIdx++ ) {
                var dIdxDateStr = tmpMoment.format('YYYY-MM-DD');
                for (var emptyIdx = 0 ; emptyIdx < findIndex ; emptyIdx++) {
                  if ( weekData.calData[dIdxDateStr][emptyIdx] === undefined ) {
                    weekData.calData[dIdxDateStr][emptyIdx] = "empty";
                  }
                }
                weekData.calData[dIdxDateStr][findIndex] = `${calStartDate} - ${calEndDate} - ${weekDateDiff} : ${calendarItem.title}`;
                tmpMoment.add(1, "days");
              }
            }
          }
        }

        // 보기 옵션에 따른 숨김 처리
        var yesCalendarOn = localStorage.getItem('yesCalendarOn');
        if (yesCalendarOn !== "true") {
          $("#dashboard_main .calendar-body .text.yes-calendar-rows").addClass("display-off");
        }
        
      },

      drawCalendar: function (params) {
        var _view = this;
        var year = params.start.split("-")[0];
        var month = params.start.split("-")[1] - 1;

        //var now = new Date();
        // 현재 달의 1일의 요일
        var theDate = new Date(year, month);
        var startDayOfWeek = theDate.getDay();
        var lastDay = new Date(year, month + 1, 0).getDate();
        var row = Math.ceil((startDayOfWeek + lastDay) / 7);
        var data = [];
        var commuteData;
        var attenData;
        var workType;
        var overTime;
        var outOffice;
        var vacation;
        var tmpDay;
        var tmpTime;
        var openTag;
        var closeTag = "</div>";
        var exist = true;
        var inoutData = _view.inOutData;

        for (var i = 0; i < lastDay; i++) {
          tmpDay = i + 1;
          workType = "";
          overTime = "";
          outOffice = "";
          vacation = "";
          openTag = "";
          exist = true;

          commuteData = _view.getCommuteByDay(year, month, i);

          var dateStr = year + "-";
          dateStr += (month < 9) ? "0" + (month + 1) + "-" : (month + 1) + "-";
          dateStr += (i < 9) ? "0" + (i + 1) : (i + 1);
          if (commuteData.length == 0) {
            attenData = _view.checkAtten(year, month, i);
            if (_.isUndefined(attenData)) {
              exist = false;
            } else {
              // need_confirm == 2 인 경우 빨강색으로 표시
              tmpTime = attenData.char_date.split(" ")[1].split(":");
              if (attenData.need_confirm === 1) {
                workType = "<div class='attenTime'>" + tmpTime[0] + ":" + tmpTime[1] + closeTag;
              } else {
                workType = "<div class='attenTime' style='color:red'>" + tmpTime[0] + ":" + tmpTime[1] + closeTag;
                overTime = "<div class='attenTime' style='color:red'>확인필요</div>"
              }
            }

          } else { // commuteData.length !== 0
            workType = Code.getCodeName(Code.WORKTYPE, commuteData[0].work_type);
            if (workType !== "휴일") {
              if (workType === "조퇴" || workType === "지각" || workType === "지각,조퇴") {
                openTag = "<div class='work-late-leave'>";
              } else if (workType === "결근" || workType === "결근_미결") {
                openTag = "<div class='work-cri'>";
                workType = "결근";
              } else if (workType === "휴일근무_미결") {
                // no display
              } else if (workType === "휴일근무") {
                openTag = "<div class='work-normal holiday'>";
              } else if (workType === "출근기록_없음") {
                openTag = "<div class='work-cri'>";
                workType = "출근없음";
              } else if (workType === "퇴근기록_없음") {
                openTag = "<div class='work-cri'>";
                workType = "퇴근없음";
              } else {
                openTag = "<div class='work-normal'>";
              }

              if (workType === "정상") {
                // 정상인 경우 출력하지 않음.
                workType = "";
              } else {
                workType = openTag + workType + closeTag;
              }

            } else {
              workType = "<div class='holiday'></div>";
            }
            if (commuteData[0].overtime_code != null) {
              overTime = Code.getCodeName(Code.OVERTIME, commuteData[0].overtime_code);
              if (overTime.indexOf("A형") >= 0) {
                openTag = "<div class='overA'>";
              } else if (overTime.indexOf("B형") >= 0) {
                openTag = "<div class='overB'>";
              } else {
                openTag = "<div class='overC'>";
              }
              overTime = openTag + overTime.split("_")[1] + closeTag;
            } else {
              // 상신 버튼 출력
              if (commuteData[0].work_night_falg === '상신') {
                overTime = '<div class="work-normal">상신중</div>'
              } else if (Moment(_view.overTimeDay).isBefore(commuteData[0].date) || Moment(_view.overTimeDay).isSame(commuteData[0].date)) {
                if (commuteData[0].over_time >= 120) {
                  if (commuteData[0].id === SessionModel.getUserInfo().id) {
                    overTime = '<button id="calendarSubmit" class="overSubmit glyphicon glyphicon-edit">상신</button>'
                  } else {
                    overTime = '<button id="calendarSubmit" disabled class="overSubmit no-hover glyphicon glyphicon-edit">상신</button>'
                  }
                }
              }
            }
          }

          // outoffice 
          var outOfficeInfo = _.find(inoutData.outoffice, function (d) {
            var data = d.attributes;
            return data.date == dateStr;
          });
          // if (commuteData[0].out_office_code != null) {
          if (!_.isUndefined(outOfficeInfo)) {
            var outCode = outOfficeInfo.attributes.office_code;
            outOffice = Code.getCodeName(Code.OFFICE, outCode);
            if (outOffice.indexOf('휴가') > -1 || outOffice.indexOf('반차') > -1) {
              openTag = "<div class='vacation'>";
              if (outOffice.indexOf(",") >= 0 && outOffice.indexOf("(") >= 0) {
                outOffice = outOffice.replace(/반차/g, "").replace(/휴가/g, "").replace(/ /g, "").replace("(오전)", "").replace("(오후)", "");
              } else if (outOffice.indexOf(",") >= 0) {
                outOffice = outOffice.replace(/ /g, "").replace(/반차/g, "").replace(/휴가/g, "");
              } else if (outOffice.indexOf("(") >= 0) {
                outOffice = outOffice.replace("휴가", "").replace("(", "").replace(")", "");
              }
            } else {
              openTag = "<div class='outOffice'>";
            }
            outOffice = openTag + outOffice + closeTag;
          }

          var pushData = {
            "days": tmpDay,
            "workType": workType,
            "overTime": overTime,
            "outOffice": outOffice,
            "vacation": vacation,
            "exist": exist,
            "commuteExist": commuteData.length === 1
          };
          data.push(pushData);
        }

        //var calendarData = { "row": row, "startDayOfWeek": startDayOfWeek, "lastDay": lastDay, "year": year, "month": month, "data": data };
        //this.$el.html(_.template(calendarHTML)(calendarData));

        this.$el.html(calendarHTML);
        var calBody = $(this.el).find("#calendar_body");
        var resultHtml = this.makeOneWeekHtml(row, startDayOfWeek, lastDay, year, month, data);
        calBody.append(resultHtml);

        var todayBox = $(this.el).find("#" + this._today);
        if (todayBox.length > 0) {
          todayBox.css('border', '2px solid #34495e');
        }

        // 2019.07.19 KJK 아래 코드 왜 있는지 모르겠음...
        // var holiday = $('.holiday');
        // var bgColor1 = $('.cc-header').eq(0).css("background-color");
        // var bgColor2 = $('.cc-header').eq(6).css("background-color");
        // var textColor = $('.cc-header').eq(0).css("color")
        // var target;
        // for (var k = 0, len = holiday.length; k < len; k++) {
        //   target = $('.holiday').parent().parent().parent().find('.cc-header').eq(k);
        //   if (bgColor1 !== target.css("background-color") && bgColor2 !== target.css("background-color")) {
        //     target.css("background-color", bgColor1);
        //     target.css("color", textColor);
        //   }
        // }

        _view.drawHoliday(params.start);
        _view.drawCleanDay();
        _view.drawOverTimeWeek();
        _view.drawYesCalendar();
      },

      makeOneWeekHtml: function (row, startDayOfWeek, lastDay, year, month, data) {
        var resultHtml = '';

        var tdTemplate = '<td id="" class="">';
        var calendar_content = '<div class="calendar-content">';
        var cc_header = '<div class="cc-header <HEADER_CLASS>"><DAY></div>';
        var cc_content = '<div class="c-content"> <div class="text"><A></div><div class="text"><B></div> </div>';
        var cc_yesCalendar = '<div class="c-content"> <div class="text yes-calendar-rows"></div> </div>';

        var day = 0;
        var lastDate = "";
        var lastIndex = 1;
        this.elements.yesCalendarWeekData = [];
        var yesCalDateAnchorDate = Moment(year + '-' + Util.get02dStr(month + 1) + '-' + Util.get02dStr(day+1));

        for (var i = 1; i <= row; i++) {
          resultHtml += "<tr>";

          if (i === 1) {
            // 0:일요일, 1:월요일, 2:화요일, 3:수요일, 4:목요일, 5:금요일, 6:토요일
            var startWeekDate = yesCalDateAnchorDate.format('YYYY-MM-DD');
            var endWeekDate = yesCalDateAnchorDate.add(7 - startDayOfWeek - 1, "days").format('YYYY-MM-DD');
            this.elements.yesCalendarWeekData.push({startWeekDay: startWeekDate, endWeekDay: endWeekDate, calData: {}});
          } else {
            var startWeekDate = yesCalDateAnchorDate.add(1, "days").format('YYYY-MM-DD');
            var lastWeekDate = "";
            if (lastDay < day+7) {
              lastWeekDate = Moment(year + '-' + Util.get02dStr(month + 1) + '-' + lastDay).format('YYYY-MM-DD');
            } else {
              lastWeekDate = yesCalDateAnchorDate.add(6, "days").format('YYYY-MM-DD');
            }

            this.elements.yesCalendarWeekData.push({ startWeekDay: startWeekDate, endWeekDay: lastWeekDate, calData: {}});
          }

          for (var j = 1; j <= 7; j++) {
            if (i == 1 && j <= startDayOfWeek) {
              // 1일 시작 전
              // if ( data[0].exist ) {
              var prevDate = Moment(year + "-" + (month+1) + "-1").add(j - startDayOfWeek - 1, "days").format('YYYY-MM-DD');
              resultHtml += tdTemplate;
              resultHtml = resultHtml.replace('id=""', 'id="' +prevDate + '"');

              resultHtml += cc_header.replace("<HEADER_CLASS>", "opacity3").replace("<DAY>", prevDate.substr(8,2));
              resultHtml += cc_content.replace("<A>", "").replace("<B>", "");
              resultHtml += cc_content.replace("<A>", "").replace('<div class="text"><B>', '<div class="over-time">');
              continue;
            } else if (_.isUndefined(data[day])) {
              // 말일 종료 후
              resultHtml += tdTemplate;
              var afterDate = Moment(lastDate).add(lastIndex++, "days").format('YYYY-MM-DD');
              resultHtml = resultHtml.replace('id=""', 'id="' + afterDate + '"');
              resultHtml += cc_header.replace("<HEADER_CLASS>", "opacity3").replace("<DAY>", afterDate.substr(9,1));
              resultHtml += cc_content.replace("<A>", "").replace("<B>", "");
              resultHtml += cc_content.replace("<A>", "").replace('<div class="text"><B>', '<div class="over-time">');
            } else {
              // 1일 ~ 말일까지
              if (j == 7) {
                // 토요일
                resultHtml += tdTemplate.replace('class=""', 'class="saturday"');
              } else if (j == 1 || data[day].workType.indexOf("holiday") >= 0) {
                // 쉬는 날
                resultHtml += tdTemplate.replace('class=""', 'class="holiday"');
              } else {
                if (data[day].exist) {
                  resultHtml += tdTemplate;
                } else {
                  resultHtml += tdTemplate.replace('class=""', 'class="disabled"');
                }
              }

              lastDate = year + '-' + Util.get02dStr(month + 1) + '-' + Util.get02dStr(data[day].days);
              resultHtml = resultHtml.replace('id=""', 'id="' + lastDate + '"');

              resultHtml += calendar_content;
              resultHtml += cc_header.replace("<DAY>", data[day].days);

              if (data[day].commuteExist === true && SessionModel.getUserInfo().id === this.elements.targetUserId) {
                resultHtml = resultHtml.replace("<HEADER_CLASS>", "clickable");
              } else {
                resultHtml = resultHtml.replace("<HEADER_CLASS>", "");
              }
              resultHtml += cc_content.replace("<A>", data[day].workType).replace("<B>", data[day].overTime);
              // resultHtml += cc_content.replace("<A>", data[day].outOffice).replace("<B>", data[day].vacation);
              resultHtml += cc_content.replace("<A>", data[day].outOffice).replace('<div class="text"><B>', '<div class="over-time">');
              // 윗 코드에 관하여... 원래 설계상 네번째 칸에 vacation 정보를 출력하려 하였으나 구현오류로 인하여 vacation 정보가 세번째 칸에 outOffice에 출력되고 있음.
              // 따라서 네번재 칸은 매주 월요일 자리에 주간 초과근무 시간을 출력하도록 추가 구현 함.
            }
            resultHtml += cc_yesCalendar;

            day++;
            resultHtml += "</div></td>"; // calendar-content
          }

          resultHtml += "</tr>";
        }
        return resultHtml;
      },

      checkAtten: function (year, month, day) {
        var _view = this;
        var dateStr = "";
        var result = _.select(_view.attendance, function (atten) {
          dateStr = year + "-";
          dateStr += (month < 9) ? "0" + (month + 1) + "-" : (month + 1) + "-";
          dateStr += (day < 9) ? "0" + (day + 1) : (day + 1);

          if (atten.char_date.split(" ")[0] == dateStr && atten.type.indexOf("출근") > -1 && Number(atten.char_date.split(" ")[1].split(":")[0]) > 5) {
            return atten.char_date;
          }
        });
        if (result.length != 0) {
          var confirmResult = _.filter(result, { need_confirm: 1 })
          if (confirmResult.length !== 0) {
            // 정상적인 첫번째 출근시간을 return
            return confirmResult[0]
          }
          return result[0];
          // 아래 로직이 왜 필요한지 모르겠음. KJK 2019.04.15
          // } else {
          //     result = _.select(_view.attendance, function (atten) {
          //         if (atten.char_date.split(" ")[0] == dateStr && atten.type.indexOf("출근") > -1 && Number(atten.char_date.split(" ")[1].split(":")[0]) > 5) {
          //             return atten.char_date;
          //         }
          //     });
          //     return result[0];
        }
      },

      getCommuteByDay: function (year, month, day) {
        var _view = this;
        var dateStr = year + "-";
        dateStr += (month < 9) ? "0" + (month + 1) + "-" : (month + 1) + "-";
        dateStr += (day < 9) ? "0" + (day + 1) : (day + 1);

        commuteData = _.select(_view.commuteSummary, function (com) {
          if (com.date == dateStr) {
            return com;
          }
        });
        return commuteData;
      },

      // 상신 버튼 클릭시 페이지 이동
      onClickOpenOvertimePopup: function (evt) {
        window.location.href = "#commutemanager/" + evt.target.parentElement.parentElement.parentElement.parentElement.id;
      },

      onClickDayLink: function(evt) {
        if (evt.target.parentElement.parentElement.id === "") {
          window.location.href = "#commutemanager/" + evt.target.parentElement.parentElement.parentElement.id;
        } else {
          window.location.href = "#commutemanager/" + evt.target.parentElement.parentElement.id;
        }
      },

      resetPopupMenu: function () {
        // 0: none , 1: ignore, 2: display
        if (this.elements._isShowPopup == 0 || this.elements._isShowPopup == 1) {
          this.elements._isShowPopup = 2;
          return;
        }

        $($("#submit_popup_menu")[0]).css("display", "none");
        this.elements._isShowPopup = 0;
      },

      onClickDaySubmit: function(event) {
        this.elements._isShowPopup = 0;

        var targetDate = "";

        if (event.target.className.indexOf("yes-cal-row empty") >= 0) {
          targetDate = targetDate = event.target.parentElement.parentElement.parentElement.parentElement.id;
        } else {
          targetDate = event.target.parentElement.parentElement.parentElement.id;
          if (targetDate === "" || targetDate === "calendar_body") {
            targetDate = event.target.parentElement.parentElement.id;
            if (targetDate === "") {
              // over-time class 인 경우에 날짜 찾기
              targetDate = event.target.id;
              if (targetDate === "") {
                return;
              }
            }
          }
        }
        var now = new Moment().format("YYYY-MM-DD");
        
        this.elements._isShowPopup = 1;

        $($("#submit_popup_menu")[0]).css("display", "block").css("top", event.pageY).css("left", event.pageX);
        if (targetDate >= now) {
          $($("#submit_item")[0]).attr("date", targetDate);
          $($("#submit_item")[0]).css("display", "block");
        } else {
          $($("#submit_item")[0]).css("display", "none");
        }
        $($("#add_yescalendar")[0]).attr("date", targetDate);

        // 관리자인 경우에만 일정 사용 하도록 하는 코드 제거 
        // if (SessionModel.getUserInfo().admin === Schemas.ADMIN) {
        //   $($("#submit_popup_menu")[0]).css("display", "block").css("top", event.pageY).css("left", event.pageX);
        //   if (targetDate >= now) {
        //     $($("#submit_item")[0]).attr("date", targetDate);
        //     $($("#submit_item")[0]).css("display", "block");
        //   } else {
        //     $($("#submit_item")[0]).css("display", "none");
        //   }
        //   $($("#add_yescalendar")[0]).attr("date", targetDate);
        // } else {
        //   if (targetDate >= now) {
        //     $($("#submit_popup_menu")[0]).css("display", "block").css("top", event.pageY).css("left", event.pageX);
        //     $($("#add_yescalendar")[0]).css("display", "none");
        //   }
        // }
        
      },

      onClickSubmitMenu: function() {
        var addNewReportView = new AddNewReportView();
        var targetDate = $($("#submit_item")[0]).attr("date");
        addNewReportView.setTargetDate(targetDate);
        
        Dialog.show({
            title: "결재 상신",
            content: addNewReportView,
            buttons: [{
                label: "상신",
                cssClass: Dialog.CssClass.SUCCESS,
                action: function(dialogRef) { // 버튼 클릭 이벤트
                    addNewReportView.onClickBtnSend(dialogRef).done(function(model) {
                        window.location.href = "#reportmanager";
                        Util.destoryDateTimePicker(true); dialogRef.close();
                    });
                }
            }, {
                label: '닫기',
                action: function(dialogRef) {
                  Util.destoryDateTimePicker(true); dialogRef.close();
                }
            }]
        });
    },

    onClickAddYesCalendarMenu: function () {
      var _this = this;
      var yesCalendarDialog = new YesCalendarDialog(this);

      var targetDate = $($("#add_yescalendar")[0]).attr("date");
      yesCalendarDialog.setTargetDate(targetDate);

      Dialog.show({
        title: "일정 등록",
        content: yesCalendarDialog,
        buttons: [{
          label: "등록",
          cssClass: Dialog.CssClass.SUCCESS,
          action: function (dialogRef) { // 버튼 클릭 이벤트
            yesCalendarDialog.submitAdd().done(function (model) {
              yesCalendarDialog.closeModal();
              Util.destoryDateTimePicker(true); dialogRef.close();
              _this.refreshYesCalendarData();
            });
          }
        }, {
          label: '취소',
          action: function (dialogRef) {
            yesCalendarDialog.closeModal();
            Util.destoryDateTimePicker(true); dialogRef.close();
          }
        }]
      });
    },

    onClickYesCalendarItem: function(event) {
      var _this = this;
      var yesCalendarDialog = new YesCalendarDialog(this);

      var calendar_id = $(event.target).attr("data");
      yesCalendarDialog.setSelectedYesCalendarModel(this.elements.yesCalendarDataAll[calendar_id]);

      var buttonList = [];
      if (this.elements.yesCalendarDataAll[calendar_id].member_id === SessionModel.getUserInfo().id) {
        buttonList.push({
          label: "삭제",
          cssClass: Dialog.CssClass.WARNING + " float-left",
          style: "float:left;",
          action: function (dialogRef) {
            Dialog.confirm({
              msg : "일정을 삭제하시겠습니까?",
              action: function () {
                var dfd = new $.Deferred();
                yesCalendarDialog.submitRemove().done(function (result) {
                  yesCalendarDialog.closeModal();
                  Util.destoryDateTimePicker(true); dialogRef.close();
                  _this.refreshYesCalendarData();
                  dfd.resolve();
                }).fail(function(error) {
                  Dialog.error("일정 삭제 실패 : " + error.responseJSON.message);
                  dfd.resolve();
                });
                return dfd;
              },
              actionCallBack: function (res) {//response schema
                // reload
              },
              // errorCallBack: function () {
              //   Dialog.error("삭제 실패!");
              // },
            });
          }
         });

         buttonList.push({
          label: "수정",
          cssClass: Dialog.CssClass.SUCCESS,
          action: function (dialogRef) { // 버튼 클릭 이벤트
            yesCalendarDialog.submitEdit().done(function (model) {
              yesCalendarDialog.closeModal();
              Util.destoryDateTimePicker(true); dialogRef.close();
              _this.refreshYesCalendarData();
            });
          }
        });
      }

      buttonList.push({
        label: '닫기',
        action: function (dialogRef) {
          yesCalendarDialog.closeModal();
          Util.destoryDateTimePicker(true); dialogRef.close();
        }
      });

      Dialog.show({
        title: "일정 조회/수정",
        content: yesCalendarDialog,
        buttons: buttonList
      });
    }

  });
  return CalendarView;
});