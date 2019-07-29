define([
  'jquery',
  'underscore',
  'backbone',
  'cmoment',
  'util',
  'core/BaseView',
  'schemas',
  'i18n!nls/common',
  'dialog',
  'tool/d3_460/d3.min',
  'models/sm/SessionModel',
  'text!templates/default/head.html',
  'text!templates/room/roomReserve.html',
  'text!templates/room/roomReserveContent.html',
  'views/room/popup/EditRoomRegPopupView',
  'models/room/RoomModel',
  'collection/room/RoomCollection',
  'collection/room/RoomRegCollection',
  'collection/common/HolidayCollection',
], function (
  $, _, Backbone, Moment, Util,
  BaseView,
  Schemas,
  i18Common,
  Dialog,
  d3,
  SessionModel,
  HeadHTML,
  contentHTML,
  RoomContentHTML,
  EditRoomRegPopupView,
  RoomModel,
  RoomCollection,
  RoomRegCollection,
  HolidayCollection
  ) {

    // main-container
    //  - room-container
    //    - menu title
    //    - date 
    //    - svg
    //    - button
    var RoomReserveView = BaseView.extend({
      el: ".main-container",
      elements: {
        _roomData: [],
        _regDataOrigin: [],
        _regDataByDate: [],
        _printDayList: [],
        _hourXList: [],
        _rowHeight: 30,
        _isShowPopup: 0, // 0: none , 1: ignore, 2: display
        _bindEvent1: undefined,
        _bindEvnet2: undefined,
        _holidayCollection: null
      },
      initialize: function () {
        this.elements._bindEvent1 = _.bind(this.drawSVG, this);
        this.elements._bindEvent2 = _.bind(this.resetPopupMenu, this);
        $(window).on("resize", this.elements._bindEvent1);
        $(window).on("click", this.elements._bindEvent2);

        this.elements._holidayCollection = new HolidayCollection();
      },

      destroy: function () {
        $(window).off("resize", this.elements._bindEvent1);
        $(window).off("click", this.elements._bindEvent2);
      },

      events: {
        'click #roomRegBtn': 'onClickRoomRegBtn',
        'click .reg_group': 'onClickSearchReg',
        'click #room_date_next': "onClickNextWeek",
        'click #room_date_prev': "onClickPrevWeek",
        'click #room_data_refresh': "onClickRefresh",
        'click .dayRows': "onClickShwoPopup",
        'click #room_reg_item': "onClickRoomRegPopup",
      },

      render: function () {
        var _headSchema = Schemas.getSchema('headTemp');
        var _headTemp = _.template(HeadHTML);
        var _contentHTML = $(contentHTML);
        var _head = $(_headTemp(_headSchema.getDefault({ title: "회의실", subTitle: "조회 / 예약" })));

        _head.addClass("no-margin");
        _head.addClass("relative-layout");

        var _contentBody = _.template(RoomContentHTML);

        _contentHTML.append(_head);
        _contentHTML.append(_contentBody);
        $(this.el).append(_contentHTML);

        // 예약 데이터 출력
        var period = this.setPeriod();
        this.loadData(period.fromDate, period.toDate);
      },

      onClickRefresh: function () {
        this.loadData();
      },

      setPeriod: function (fromDate, toDate) {
        if (_.isUndefined(fromDate)) {
          fromDate = Moment(Util.getMonday(Moment(new Date()).format("YYYY-MM-DD"))).format("YYYY-MM-DD");
          toDate = Moment(fromDate, "YYYY-MM-DD").add(4, "days").format("YYYY-MM-DD");
        }
        var date_period_el = $(this.el).find("#date_period");
        date_period_el.text(fromDate + " ~ " + toDate);
        date_period_el.attr("start_date", fromDate);
        date_period_el.attr("end_date", toDate);
        return {fromDate: fromDate, toDate: toDate}
      },

      loadData: function (fromDate, toDate) {
        var _this = this;
        var roomRegCol = new RoomRegCollection();

        if (fromDate === undefined) {
          var date_period_el = $(_this.el).find("#date_period");
          fromDate = date_period_el.attr("start_date");
          toDate = date_period_el.attr("end_date");
        }
        var reqData = {
          start_date: fromDate,
          end_date: toDate
        };
        
        this.elements._holidayCollection.fetch({
          url : '/holiday/period',
          data : {
              start : fromDate,
              end: toDate
          },
          success : function(){
            roomRegCol.fetch({
              data: reqData,
              success: function (result) {
                // 타이틀 수정
                _this.setPeriod(fromDate, toDate);
    
                _this.elements._regDataOrigin = result;
                _this.setData();
              },
              error: function(e) {
                Dialog.error("통신 실패 - 예약 정보");
              }
            });
          },
          error: function(){
            Dialog.error("통신 실패 - 휴일정보");
          }
        });

        // 로딩창 사용 시 코드... 불필요하게 시간이 오래 걸려 사용하지 않음.
        // Dialog.loading({
        //   action: function () {
        //     var dfd = new $.Deferred();
        //     roomRegCol.fetch({
        //       data: reqData,
        //       success: function (result) {
        //         // 타이틀 수정
        //         _this.setPeriod(fromDate, toDate);
    
        //         _this.elements._regData = result;
        //         _this.setData();
        //         dfd.resolve();
        //       },
        //       error: function(e) {
        //         Dialog.error("통신 실패 1");
        //         dfd.reject();
        //       }
        //     });
        //     return dfd.promise();
        //   },
        //   actionCallBack: function (res) {},
        //   errorCallBack: function (response) {Dialog.error("통신 실패 3");}
        // });
      },

      setData: function () {
        var _this = this;

        this.getRoomInfo().done(function (result) {
          // 출력할 모든 회의 데이터
          var regData = [];

          var date_period_el = $(_this.el).find("#date_period");
          var start_date = date_period_el.attr("start_date");
          var end_date = date_period_el.attr("end_date");

          // 출력할 일 수를 확인할 수 있는 다른 방법 - 현재 사용하지 않음.
          //var dayCount = (new Date(start_date)) - (new Date(end_date)) / 1000 / 60 / 60 / 24;

          // 출력할 날짜/회의실 셋팅
          _this.elements._printDayList = [];
          var PRINT_DAY_LIST = _this.elements._printDayList;
          var PRINT_ROOM_LIST = _this.elements._roomData;
          var tmpDay = Moment(start_date);
          // var dayCount = 0; // 출력할 일수 
          for (var dayIndex = 0; tmpDay.format("YYYY-MM-DD") <= end_date; dayIndex++) {
            PRINT_DAY_LIST.push(tmpDay.format("YYYY-MM-DD"));
            regData[PRINT_DAY_LIST[dayIndex]] = [];
            regData.length++;
            for (var roomIndex = 0; roomIndex < PRINT_ROOM_LIST.length; roomIndex++) {
              regData[PRINT_DAY_LIST[dayIndex]][PRINT_ROOM_LIST[roomIndex].index] = [];
            }

            tmpDay.add(1, "days");
            // dayCount++;
          }

          for (var regIndex = 0; regIndex < _this.elements._regDataOrigin.length; regIndex++) {
            // TODO 에러 발생 예약 정보 모두 가져오고 난 후 아래 실행하는지 확인 필요
            // PRINT_REG_LIST.models === undefined
            var regModel = _this.elements._regDataOrigin.models[regIndex];
            if (regData[regModel.attributes.date][regModel.attributes.room_index]) {
              regData[regModel.attributes.date][regModel.attributes.room_index].push(regModel);
            }
          }

          _this.elements._regDataByDate = regData;

          _this.drawSVG();

        }).fail(function () {
          Dialog.error("회의실 데이터 조회를 실패했습니다.");
        });
      },

      drawSVG: function (event) {
        var _this = this;

        var svgMain = d3.select("#room_svg");
        var svg = svgMain.select("#top_g");

        svg.remove();
        var colorList = d3.schemeCategory20;

        var svg = svgMain.append("g")
          .attr("id", "top_g");

        var roomData = _this.elements._roomData;
        var regData = _this.elements._regDataByDate;

        var room_cnt = roomData.length;
        var day_cnt = regData.length;

        if (room_cnt === 0) {
          Dialog.info("회의실을 먼저 등록하세요.");
          return;
        }

        var ROW_HEIGHT = 30;  // 한줄의 높이 고정값
        if (room_cnt <= 2) {
          ROW_HEIGHT = 50
        }
        _this.elements._rowHeight = ROW_HEIGHT;

        $(this.el).find("#room_svg").css("min-height", (room_cnt * day_cnt * ROW_HEIGHT) + (ROW_HEIGHT * 3));

        var width = $(_this.el).find("#room_svg").width();
        // var height = $(_this.el).find("#room_svg").height();

        var startPosX = 20;
        var startPosY = 30;

        var posX = startPosX;
        var posY = startPosY;

        // 기본 시간 축 출력
        // 08:00 ~ 19:00 ( 12개 구간 )
        // 
        var hourPosX1 = startPosX + 170;
        var hourPosX2 = width - startPosX;
        var hourLen = (hourPosX2 - hourPosX1) / 11;
        var hour_g = svg.append("g").attr("class", "hour_line");
        for (var i = 0; i < 12; i++) {
          var hour = i + 8;
          if (hour < 10) {
            hour = '0' + hour;
          }

          var hourX = hourPosX1 + hourLen * i;
          _this.elements._hourXList[i + 8] = hourX;

          hour_g.append("text")
            .attr("x", hourX - 10)
            .attr("y", posY)
            .text(hour);

          // 시간축 세로선
          hour_g.append("line")
            .attr("x1", hourX)
            .attr("y1", posY + ROW_HEIGHT * 0.25 - 5)
            .attr("x2", hourX)
            .attr("y2", posY + (room_cnt * day_cnt * ROW_HEIGHT) + ROW_HEIGHT * 0.25)
            .attr("stroke-width", 0.4)
            .attr("stroke", colorList[0])
            .attr("stroke-opacity", "0.4");
        }

        // posY += ROW_HEIGHT * 1.2; // .2 는 상단에 ticker 표현을 위한것임.
        posY += ROW_HEIGHT;

        var day_g = svg.append("g").attr("class", "day_group");
        var room_g = svg.append("g").attr("class", "room_group");
        var reg_g = svg.append("g").attr("class", "reg_group");
        var WEEK_STR = ["월", "화", "수", "목", "금"];

        for (var dayIndex = 0; dayIndex < day_cnt; dayIndex++) {
          var oneDay = _this.elements._printDayList[dayIndex];

          //<rect x="50" y="20" width="150" height="10" style="fill:blue;stroke-width:5;fill-opacity:0.1;stroke-opacity:0.9"></rect>
          
          var posY_075 = parseInt(posY - ROW_HEIGHT * 0.75);
          
          // 날짜별 구분선
          day_g.append("line")
            .attr("x1", startPosX)
            .attr("y1", posY_075)
            .attr("x2", hourPosX2)
            .attr("y2", posY_075)
            // .attr("sshape-rendering", "crispEdges")
            .attr("stroke-width", 2)
            .attr("stroke", "rgb(28,28,28)");

          // 오늘 날짜 부분 음영 표기
          var isToday = "normal";
          if (Moment(new Date()).format("YYYY-MM-DD") == oneDay) {
            isToday = "bold";
            day_g.append("rect")
              .attr("x", startPosX)
              .attr("width", hourPosX2 - startPosX)
              .attr("y", posY_075)
              .attr("height", ROW_HEIGHT * room_cnt)
              .attr("fill", "#98df8a")
              .attr("fill-opacity", "0.2");
          }

          // 휴일인 경우 표기
          if (this.elements._holidayCollection.get(oneDay)) {
            day_g.append("rect")
              .attr("x", startPosX)
              .attr("width", hourPosX2 - startPosX)
              .attr("y", posY_075)
              .attr("height", ROW_HEIGHT * room_cnt)
              // .attr("fill", "#ce5958")
              .attr("fill", "#ffaaaa")
              .attr("fill-opacity", "0.2");
          } else {
            // 휴일이 아닌 경우 이벤트 받기 위한 rect
            day_g.append("rect")
            .attr("x", startPosX)
            .attr("y", posY_075)
            .attr("width", hourPosX2 - startPosX)
            .attr("height", ROW_HEIGHT * room_cnt)
            .attr("fill-opacity", "0")
            .attr("class", "dayRows")
            .attr("date", oneDay); // 날짜
          }

          // 날짜 출력
          var datePosY = posY - ROW_HEIGHT * 0.15;
          day_g.append("text")
            .attr("x", posX)
            .attr("y", posY - ROW_HEIGHT * 0.15)
            .style("font-weight", isToday)
            .text(oneDay);

          // 요일 출력
          day_g.append("text")
            .attr("x", posX + 35)
            .attr("y", datePosY + 20)
            .style("font-weight", isToday)
            .text(WEEK_STR[dayIndex]);

          for (var rIdx = 0; rIdx < room_cnt; rIdx++) {
            var roomIndex = roomData[rIdx].index;
            var roomPosX = posX + 100;

            // 회의실 이름
            room_g.append("text")
              .attr("x", roomPosX + 10)
              .attr("y", posY - ROW_HEIGHT * 0.15)
              .text(roomData[rIdx].name);

            // 회의실간 구분선 ( 가로 )
            if (rIdx + 1 != room_cnt) {
              room_g.append("line")
                .attr("x1", roomPosX)
                .attr("y1", posY + ROW_HEIGHT * 0.25)
                .attr("x2", hourPosX2)
                .attr("y2", posY + ROW_HEIGHT * 0.25)
                .attr("stroke-width", 0.5)
                .attr("stroke", colorList[0])
                .attr("stroke-opacity", "0.4");
            }

            // 회의 셋팅
            for (var regIndex = 0; regIndex < regData[oneDay][roomIndex].length; regIndex++) {
              var roomRegModel = regData[oneDay][roomIndex][regIndex];
              var posRegX1 = hourPosX1 + _this.getPositionX(roomRegModel.attributes.start_time, hourLen);
              var posRegX2 = hourPosX1 + _this.getPositionX(roomRegModel.attributes.end_time, hourLen);
              var rectWidth = posRegX2 - posRegX1;

              var reg1_g = reg_g.append("g")
                .attr("id", "reg_index_" + roomRegModel.attributes.index)
                .attr("class", "roomRegRect")
                .attr("date", roomRegModel.attributes.date)
                .attr("room_index", roomRegModel.attributes.room_index)
                .attr("transform", "translate(" + posRegX1 + "," + posY + ")");

              var colorIndex = (rIdx*2)+1;
              var boxY = -(ROW_HEIGHT * 0.6);
              reg1_g.append("rect")
                .attr("width", rectWidth)
                .attr("y", boxY)
                .attr("height", ROW_HEIGHT * 0.7)
                .attr("fill", colorList[colorIndex])
                .attr("fill-opacity", "0.9");
              // colorListIndex++;

              // 회의 시작 시간에 세로 줄
              reg1_g.append("rect")
              .attr("width", 5)
              .attr("y", boxY)
              .attr("height", ROW_HEIGHT * 0.7)
              .attr("fill", colorList[colorIndex-1])
              .attr("fill-opacity", "1");

              var titleText = roomRegModel.get('title');
              var charNum = Math.floor(rectWidth / 13);
              if (charNum < titleText.length) {
                titleText = titleText.substring(0, charNum) + "..";
              }

              reg1_g.append("text")
                .attr("x", 7)
                .attr("y", boxY + 15)
                .html(titleText);

              reg1_g.append("title").html(Util.makeRoomRegTooltip(roomRegModel));
            }

            posY += ROW_HEIGHT;
          }
        }

        // 날짜별 구분선
        var posY_075 = parseInt(posY - ROW_HEIGHT * 0.75); // 소수점이 생기면 선이 희미해지는 현상 방지를 위함.
        day_g.append("line")
          .attr("x1", startPosX)
          .attr("y1", posY_075)
          .attr("x2", hourPosX2)
          .attr("y2", posY_075)
          .attr("stroke-width", 2)
          .attr("stroke", "rgb(40,40,40)");
      },

      getPositionX: function (time, hourLen) {
        var timePos = Moment(time, "HH:mm");
        var standardPos = Moment("08:00", "HH:mm");  // 기준점

        var hourCnt = timePos.hours() - standardPos.hours();
        var minCnt = timePos.minutes() - standardPos.minutes();

        if (hourCnt < 0)
          return 0;

        return (hourCnt * hourLen) + ((minCnt * 100 / 60) / 100 * hourLen);
      },

      getRoomInfo: function () {
        var dfd = new $.Deferred();
        var _this = this;
        var _roomColl = new RoomCollection();
        _roomColl.url = '/room';
        _roomColl.fetch({
          data: {},
          error: function (result) {
            dfd.reject();
          }
        }).done(function (result) {
          _this.elements._roomData = [];
          if (result.length > 0) {
            for (var i = 0; i < result.length; i++) {
              if (result[i].use !== '1') {
                continue;
              }
              var roomModel = new RoomModel();
              roomModel.index = result[i].index;
              roomModel.name = result[i].name;
              _this.elements._roomData.push(roomModel);
            }
          }
          dfd.resolve(result);
        });
        return dfd.promise();
      },

      // 등록된 예약 정보 클릭
      onClickSearchReg: function (event) {
        var _this = this;
        var regIndex = $(event.target).parent().attr("id");
        regIndex = regIndex.replace("reg_index_", "");
        var roomIndex = $(event.target).parent().attr("room_index");
        var date = $(event.target).parent().attr("date");

        if (date === undefined) {
          return;
        }
        var roomList = this.elements._regDataByDate[date][roomIndex];
        for (var i = 0; i < roomList.length; i++) {
          if (roomList[i].attributes.index == regIndex) {
            // Dialog Setting
            var _this = this;
            var editRoomRegPopupView = new EditRoomRegPopupView();
            editRoomRegPopupView.setData(roomList[i]);

            var buttonList = [];
            if (roomList[i].attributes.member_id == SessionModel.getUserInfo().id) {
              buttonList =
                [{
                  label: "회의 취소",
                  cssClass: Dialog.CssClass.SUCCESS,
                  action: function (dialogRef) {// 버튼 클릭 이벤트
                    editRoomRegPopupView.onClickBtnDel().done(function () {
                      Util.destoryDateTimePicker(true); dialogRef.close();
                      _this.loadData();
                    });
                  }
                }, {
                  label: i18Common.DIALOG.BUTTON.SAVE,
                  cssClass: Dialog.CssClass.SUCCESS,
                  action: function (dialogRef) {// 버튼 클릭 이벤트
                    editRoomRegPopupView.onClickBtnReg().done(function () {
                      Util.destoryDateTimePicker(true); dialogRef.close();
                      _this.loadData();
                    });
                  }
                }, {
                  label: i18Common.DIALOG.BUTTON.CLOSE,
                  action: function (dialogRef) {
                    Util.destoryDateTimePicker(true); dialogRef.close();
                  }
                }];
            } else {
              buttonList =
                [{
                  label: i18Common.DIALOG.BUTTON.CLOSE,
                  action: function (dialogRef) {
                    Util.destoryDateTimePicker(true); dialogRef.close();
                  }
                }];
            }

            Dialog.show({
              title: '회의실 조회/수정',
              content: editRoomRegPopupView,
              buttons: buttonList
            });

          }
        }
      },

      onClickNextWeek: function () {
        var date_period_el = $(this.el).find("#date_period");

        var start_date = date_period_el.attr("start_date");
        var fromDate = Moment(start_date, "YYYY-MM-DD").add(7, "days").format("YYYY-MM-DD");
        var toDate = Moment(fromDate, "YYYY-MM-DD").add(4, "days").format("YYYY-MM-DD");

        this.loadData(fromDate, toDate);
      },

      onClickPrevWeek: function () {
        var date_period_el = $(this.el).find("#date_period");

        var start_date = date_period_el.attr("start_date");
        var fromDate = Moment(start_date, "YYYY-MM-DD").add(-7, "days").format("YYYY-MM-DD");
        var toDate = Moment(fromDate, "YYYY-MM-DD").add(4, "days").format("YYYY-MM-DD");

        this.loadData(fromDate, toDate);
      },

      // 마우스로 클릭하여 예약
      onClickShwoPopup: function (event) {
        var _this = this;

        var date = $(event.target).attr("date");

        // 오늘 이전 날짜는 예약할 수 없음.
        if (Moment(new Date()).format("YYYY-MM-DD") > date) {
          return;
        }

        // hour_line group 의 기준축을 사용하여 시간대를 구하도록 한다.
        var regHour = 8;
        for (var h = 8; h < 20; h++) {
          if (_this.elements._hourXList[h] > event.offsetX) {
            regHour = h - 1;
            break;
          }
        }

        if (regHour < 8) {
          // 08시 앞쪽에서 클릭된 이벤트 무시
          return;
        }

        var wantedY = event.offsetY - $(event.target).attr("y");
        var regRoomIndex = 0;
        for (var r = 0; r < _this.elements._roomData.length; r++) {
          if (wantedY < _this.elements._rowHeight * (r + 1)) {
            regRoomIndex = r;
            break;
          }
        }

        // console.log("Find!!! Hour : " + regHour);
        // console.info("RoomInfo : " + _this.elements._roomData[regRoomIndex].name);
        $($("#room_reg_popup_menu")[0]).css("display", "block").css("top", event.pageY).css("left", event.pageX);
        $($("#room_reg_item")[0]).attr("date", date).attr("hour", regHour).attr("room", _this.elements._roomData[regRoomIndex].index);
        this.elements._isShowPopup = 1;
      },

      resetPopupMenu: function () {
        // 0: none , 1: ignore, 2: display
        if (this.elements._isShowPopup === 0) {
          return;
        }
        if (this.elements._isShowPopup === 1) {
          this.elements._isShowPopup = 2;
          return;
        }
        $($("#room_reg_popup_menu")[0]).css("display", "none");
        this.elements._isShowPopup = 0;
      },

      onClickRoomRegPopup: function (event) {
        $($("#room_reg_popup_menu")[0]).css("display", "none");

        var target = $(event.target);

        // 오늘 이전 날짜는 예약할 수 없음.
        if (Moment(new Date()).format("YYYY-MM-DD") > target.attr('date')) {
          Dialog.error("오늘 이전 날짜의 회의는 예약이 불가합니다.");
          return;
        }

        this.onClickRoomRegBtn(null, target.attr('date'), target.attr('room'), target.attr('hour'))
      },

      onClickRoomRegBtn: function (event, date, room, hour) {
        var _this = this;

        var editRoomRegPopupView = new EditRoomRegPopupView(date, room, hour);
        Dialog.show({
          title: '회의실 예약',
          content: editRoomRegPopupView,
          buttons:
            [{
              label: i18Common.DIALOG.BUTTON.ADD,
              cssClass: Dialog.CssClass.SUCCESS,
              action: function (dialogRef) {// 버튼 클릭 이벤트
                editRoomRegPopupView.onClickBtnReg().done(function () {
                  Util.destoryDateTimePicker(true); dialogRef.close();
                  _this.loadData();

                  editRoomRegPopupView.closeModal();
                });
              }
            }, {
              label: i18Common.DIALOG.BUTTON.CLOSE,
              action: function (dialogRef) {
                editRoomRegPopupView.closeModal();
                Util.destoryDateTimePicker(true); dialogRef.close();
              }
            }]

        });
      }

    });
    return RoomReserveView;
  });