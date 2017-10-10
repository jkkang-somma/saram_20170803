/**
 * 2017.08.03. ~ 2017.08.25.. 
 */
define([
    'jquery',
    'underscore',
    'backbone',
    'code',
    'cmoment',
    'collection/dashboard/AttendanceCollection',
    'collection/dashboard/CommuteSummaryCollection',
    'text!templates/calendarTemplateBase.html'
], function ($, _, Backbone, Code, Moment, AttendanceCollection, CommuteSummaryCollection, calendarHTML) {

    var CalendarView = Backbone.View.extend({

        initialize: function (opt) {
            this.$el = $(opt.el);
            this.commuteSummaryCollection = new CommuteSummaryCollection();
            this.attendanceCollection = new AttendanceCollection();
            this._today = new Moment().format("YYYY-M-D");
        },
        _draw: function (params) {
            var _view = this;
            _view.getAttendance(params).done(function (result) {
                _view.attendance = result;

                _view.getCommuteSummary(params).done(function (result) {
                    _view.commuteSummary = result;
                    _view.drawCalendar(params);
                }).fail(function () {

                });
            }).fail(function () {

            });

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

            for (var i = 0; i < lastDay; i++) {
                tmpDay = i + 1;
                workType = "";
                overTime = "";
                outOffice = "";
                vacation = "";
                openTag = "";
                exist = true;

                commuteData = _view.getCommuteByDay(year, month, i);

                if (commuteData.length == 0) {
                    attenData = _view.checkAtten(year, month, i);
                    if (_.isUndefined(attenData)) {
                        exist = false;
                    }else{
                        tmpTime = attenData.char_date.split(" ")[1].split(":");
                        workType = "<div class='attenTime'>" + tmpTime[0] + ":" + tmpTime[1] + closeTag;
                    }

                } else if (commuteData.length !== 0) {
                    workType = Code.getCodeName(Code.WORKTYPE, commuteData[0].work_type);
                    if (workType !== "휴일") {
                        if (workType === "조퇴" || workType === "지각"  || workType === "지각,조퇴") {
                            openTag = "<div class='work-late-leave'>";
                        } else if (workType === "결근" || workType === "결근_미결") {
                            openTag = "<div class='work-cri'>";
                            workType = "결근";
                        } else if (workType === "휴일근무_미결" ) {
                            // no display
                        } else if (workType === "휴일근무" ) {
                            openTag = "<div class='work-normal holiday'>";
                        } else if (workType === "출근기록_없음" ) {
                            openTag = "<div class='work-cri'>";
                            workType = "출근없음";
                        } else if (workType === "퇴근기록_없음" ) {
                            openTag = "<div class='work-cri'>";
                            workType = "퇴근없음";
                        }else{
                            openTag = "<div class='work-normal'>";
                        }

                        if (workType === "정상" ) {
                            // 정상인 경우 출력하지 않음.
                            workType="";
                        }else{
                            workType = openTag + workType + closeTag;   
                        }
                        
                    } else {
                        workType = "<div class='holiday'></div>";
                    }
                    if (commuteData[0].overtime_code != null) {
                        overTime = Code.getCodeName(Code.OVERTIME, commuteData[0].overtime_code);
                        if (overTime.indexOf("A형")>=0) {
                            openTag = "<div class='overA'>";
                        } else if (overTime.indexOf("B형")>=0) {
                            openTag = "<div class='overB'>";
                        } else {
                            openTag = "<div class='overC'>";
                        }
                        overTime = openTag + overTime.split("_")[1] + closeTag;
                    }
                    if (commuteData[0].out_office_code != null) {
                        outOffice = Code.getCodeName(Code.OFFICE, commuteData[0].out_office_code);
                        openTag = "<div class='outOffice'>";
                        outOffice = openTag + outOffice + closeTag;
                    }
                    if (commuteData[0].vacation_code != null) {
                        vacation = Code.getCodeName(Code.OFFICE, commuteData[0].vacation_code);
                        openTag = "<div class='vacation'>";
                        if (vacation.indexOf(",")>=0 && vacation.indexOf("(")>=0) {
                            vacation = vacation.replace(/반차/g, "").replace(/휴가/g, "").replace(/ /g, "").replace("(오전)", "").replace("(오후)", "");
                        } else if (vacation.indexOf(",")>=0) {
                            vacation = vacation.replace(/ /g, "").replace(/반차/g, "").replace(/휴가/g, "");
                        } else if (vacation.indexOf("(")>=0) {
                            vacation = vacation.replace("휴가", "").replace("(", "").replace(")", "");
                        }
                        vacation = openTag + vacation + closeTag;
                    }
                }
                var pushData = {
                    "days": tmpDay,
                    "workType": workType,
                    "overTime": overTime,
                    "outOffice": outOffice,
                    "vacation": vacation,
                    "exist" : exist
                };
                data.push(pushData);
            }

            //var calendarData = { "row": row, "startDayOfWeek": startDayOfWeek, "lastDay": lastDay, "year": year, "month": month, "data": data };
            //this.$el.html(_.template(calendarHTML)(calendarData));

            this.$el.html(calendarHTML);
            var calBody = $(this.el).find("#calendar_body");
            var resultHtml = this.makeOneWeekHtml(row, startDayOfWeek, lastDay, year, month, data);
            calBody.append(resultHtml);

            var todayBox = $(this.el).find("#"+this._today);
            if (todayBox.length > 0) {
                todayBox.css('border', '2px solid #34495e');
            }
            var holiday = $('.holiday');
            var bgColor1 = $('.cc-header').eq(0).css("background-color");
            var bgColor2 = $('.cc-header').eq(6).css("background-color");
            var textColor = $('.cc-header').eq(0).css("color")
            var target;
            for (var k = 0, len = holiday.length; k < len; k++) {
                target = $('.holiday').parent().parent().parent().find('.cc-header').eq(k);
                if (bgColor1 !== target.css("background-color") && bgColor2 !== target.css("background-color")) {
                    target.css("background-color", bgColor1);
                    target.css("color", textColor);
                }
            }
        },

        makeOneWeekHtml: function(row, startDayOfWeek, lastDay, year, month, data) {
            var resultHtml = '';
            
            var tdTemplate = '<td id="" class="">';
            var calendar_content = '<div class="calendar-content">';
            var cc_header = '<div class="cc-header"><DAY></div>';
            var cc_content = '<div class="c-content"> <div class="text"><A></div><div class="text"><B></div> </div>';

            var day = 0;
            var text = "text";
            for (var i=1; i<=row ; i++) {
                resultHtml += "<tr>";

                for ( var j=1 ; j<=7 ; j++ ) {
                    if ( i == 1 && j <= startDayOfWeek ) {
                        // 1일 시작 전
                        if ( data[0].exist ) {
                            resultHtml += tdTemplate;
                        }else{
                            resultHtml += tdTemplate.replace('class=""', 'class="disabled"');
                        }
                        resultHtml = resultHtml.replace('id=""', '');
                        continue;
                    }else if ( _.isUndefined(data[day]) ) {
                        // 말일 종료 후
                        if ( data[lastDay-1].exist ) {
                            resultHtml += tdTemplate;
                        }else{
                            resultHtml += tdTemplate.replace('class=""', 'class="disabled"');
                        }
                        resultHtml = resultHtml.replace('id=""', '');
                    }else{
                        // 1일 ~ 말일까지
                        if ( data[day].exist ) {
                            if ( j == 7 ) {
                                // 토요일
                                resultHtml += tdTemplate.replace('class=""', 'class="saturday"');
                            }else if ( j == 1 || data[day].workType.indexOf("holiday")>=0 ) {
                                // 쉬는 날
                                resultHtml += tdTemplate.replace('class=""', 'class="holiday"');
                            }else{
                                resultHtml += tdTemplate;
                            }
                        }else{
                            resultHtml += tdTemplate.replace('class=""', 'class="disabled"');
                        }
                        resultHtml = resultHtml.replace('id=""', 'id="'+year+'-'+(month+1)+'-'+data[day].days+'"');

                        resultHtml += calendar_content;
                        resultHtml += cc_header.replace("<DAY>", data[day].days);

                        resultHtml += cc_content.replace("<A>", data[day].workType).replace("<B>", data[day].overTime);
                        resultHtml += cc_content.replace("<A>", data[day].outOffice).replace("<B>", data[day].vacation);    
                    }
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

                if (atten.char_date.split(" ")[0] == dateStr && atten.type == "출근(지문)" && Number(atten.char_date.split(" ")[1].split(":")[0]) > 5) {
                    return atten.char_date;
                }
            });
            if (result.length != 0) {
                return result[0];
            } else {
                result = _.select(_view.attendance, function (atten) {
                    if (atten.char_date.split(" ")[0] == dateStr && atten.type == "출입(지문)" && Number(atten.char_date.split(" ")[1].split(":")[0]) > 5) {
                        return atten.char_date;
                    }
                });
                return result[0];
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
        }

    });
    return CalendarView;
});