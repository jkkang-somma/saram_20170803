define([
  'jquery',
  'underscore',
  'backbone',
  'cmoment',
  'util',
  'core/BaseView',
  'grid',
  'lodingButton',
  'schemas',
  'i18n!nls/common',
  'dialog',
  'tool/d3_460/d3.min',
  'models/sm/SessionModel',
  'text!templates/default/head.html',
  'text!templates/room/roomReserve.html',
  'text!templates/room/roomReserveContent.html',
  'views/room/popup/EditRoomRegPopupView',
  'views/Holiday/popup/AddHolidayPopup',
  'models/room/RoomModel',
  'collection/room/RoomCollection',
  'collection/room/RoomRegCollection',
  'code',
], function(
    $, _, Backbone, Moment, Util,
    BaseView, 
    Grid, 
    LodingButton, 
    Schemas, 
    i18Common, 
    Dialog, 
    d3,
    SessionModel, 
    HeadHTML, 
    contentHTML,
    RoomContentHTML,
    EditRoomRegPopupView,
    AddHolidayPopup,
    RoomModel,
    RoomCollection,
    RoomRegCollection,
    Code){
	
	// main-container
	//  - room-container
	//    - menu title
	//    - date 
	//    - svg
	//    - button
	
    var RoomReserveView = BaseView.extend({
    	el:".main-container",
      elements:{
            _roomData : [],
            _regData  : [],
            _printDayList : [],
        },
    	initialize:function(){
          $(window).on("resize", _.bind(this.drawSVG, this));
    	},

      remove:function() {
        $(window).off("resize", this.drawSVG);
        Backbone.View.prototype.remove.call(this)
      },

      events: {
        'click #roomRegBtn' : 'onClickRoomRegBtn',
        'click .reg_group' : 'onClickSearchReg',
        'click #room_date_next' : "onClickNextWeek",
        'click #room_date_prev' : "onClickPrevWeek",
        'click #room_data_refresh' : "onClickRefresh",
      },
  	
    	render:function(){
    	  var _headSchema=Schemas.getSchema('headTemp');
    	  var _headTemp=_.template(HeadHTML);
    	  var _contentHTML=$(contentHTML);
    	  var _head=$(_headTemp(_headSchema.getDefault({title:"회의실", subTitle:"조회 / 예약"})));
    	    
    	  _head.addClass("no-margin");
    	  _head.addClass("relative-layout");
    	    
    	  var _contentBody=_.template(RoomContentHTML);
    	    
    	  _contentHTML.append(_head);
    	  _contentHTML.append(_contentBody);
    	  $(this.el).append(_contentHTML);

        // 예약 데이터 출력
        this.loadData();

        // $(this.el).find("#roomRegBtn").click(this.onClickRoomRegBtn);  
     	},

      onClickRefresh() {
        var date_period_el = $(this.el).find("#date_period");
        var start_date = date_period_el.attr("start_date");
        var end_date = date_period_el.attr("end_date");
        this.loadData(start_date, end_date);
      },

      setPeriod: function(fromDate, toDate) {
          if ( _.isUndefined(fromDate) ) {
              fromDate = Moment(Util.getMonday(Moment(new Date()).format("YYYY-MM-DD"))).format("YYYY-MM-DD");
              toDate = Moment(fromDate,"YYYY-MM-DD").add(4,"days").format("YYYY-MM-DD");
          }
          var date_period_el = $(this.el).find("#date_period");
          date_period_el.text(fromDate + " ~ " + toDate);
          date_period_el.attr("start_date", fromDate);
          date_period_el.attr("end_date", toDate);
      },

      loadData: function(fromDate, toDate) {
        var that=this;

        // 타이틀 수정
        this.setPeriod(fromDate, toDate);

        var roomRegCol = new RoomRegCollection();
        var _this = this;

        var date_period_el = $(this.el).find("#date_period");

        var reqData = {
          start_date : date_period_el.attr("start_date"),
          end_date : date_period_el.attr("end_date")
        };
        roomRegCol.fetch({
            data : reqData,
            success : function(result){
                _this.elements._regData = result;
                _this.setData();
            }
        });
      },

      setData: function() {
        var _this = this;
        console.log("setData ..");

        // regDay["2017-01-01"]["1"]["17:00"].RoomModel

        this.getRoomInfo().done(function(result) 
        {
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
          var dayCount = 0; // 출력할 일수 
          for ( var dayIndex = 0 ; tmpDay.format("YYYY-MM-DD") <= end_date ; dayIndex++ ) {
            PRINT_DAY_LIST.push(tmpDay.format("YYYY-MM-DD"));
            regData[PRINT_DAY_LIST[dayIndex]] = [];
            regData.length++;
            for ( var roomIndex = 0 ; roomIndex < PRINT_ROOM_LIST.length ; roomIndex++ ) {
              regData[PRINT_DAY_LIST[dayIndex]][PRINT_ROOM_LIST[roomIndex].index] = [];
            }

            tmpDay.add(1, "days");
            dayCount++;
          }
          
          var PRINT_REG_LIST = _this.elements._regData;
          for ( var regIndex = 0 ; regIndex < PRINT_REG_LIST.length ; regIndex++ ) {
            var regModel = PRINT_REG_LIST.models[regIndex];
            regData[regModel.attributes.date][regModel.attributes.room_index].push(regModel);
          }

          _this.elements._regData = regData;
          
          _this.drawSVG();
          
        }).fail(function() {
          Dialog.error("회의실 데이터 조회를 실패했습니다.");
        });
      },

      drawSVG: function(event) {
        var _this = this;

        console.log("drawSVG : " + JSON.stringify(_this.elements._regData));

        var svgMain = d3.select("#room_svg");
        var svg = svgMain.select("#top_g");

        svg.remove();
        var colorList = d3.schemeCategory20;
        var colorListIndex = 1;

        var svg = svgMain.append("g")
          .attr("id", "top_g");

        var roomData = _this.elements._roomData;
        var regData = _this.elements._regData;

        var room_cnt = roomData.length;
        var day_cnt = regData.length;

        var ROW_HEIGHT = 30;  // 한줄의 높이 고정값
        $(this.el).find("#room_svg").css("min-height", (room_cnt * day_cnt * ROW_HEIGHT) + (ROW_HEIGHT*3));

        var width = $(_this.el).find("#room_svg").width();
        var height = $(_this.el).find("#room_svg").height();

        var startPosX = 20;
        var startPosY = 20;

        var posX = startPosX;
        var posY = startPosY;

        // 기본 시간 축 출력
        // 08:00 ~ 19:00 ( 12개 구간 )
        // 
        var hourPosX1 = startPosX + 170;
        var hourPosX2 = width - startPosX;
        var hourLen = ( hourPosX2 - hourPosX1 ) / 11;
        var hour_g = svg.append("g").attr("class", "hour_line");
        for ( var i = 0 ; i < 12 ; i++ ) {
          hour_g.append("text")
            .attr("x", (hourPosX1 + hourLen*i) - 10 )
            .attr("y", posY)
            .text(8+i);

          hour_g.append("line")
            .attr("x1", hourPosX1 + hourLen*i )
            .attr("y1", posY+15)
            .attr("x2", hourPosX1 + hourLen*i )
            .attr("y2", posY+5+(room_cnt*day_cnt*ROW_HEIGHT)+ROW_HEIGHT)
            .attr("stroke-width", 0.4)
            .attr("stroke",colorList[0])
            .attr("stroke-opacity", "0.4");
        }
        
        posY += ROW_HEIGHT;
        posY += ROW_HEIGHT;

        var day_g = svg.append("g").attr("class", "day_group");
        var room_g = svg.append("g").attr("class", "room_group");
        var reg_g = svg.append("g").attr("class", "reg_group");

        for ( var dayIndex = 0 ; dayIndex < day_cnt ; dayIndex++ ) 
        {
          var oneDay = _this.elements._printDayList[dayIndex];

          //<rect x="50" y="20" width="150" height="10" style="fill:blue;stroke-width:5;fill-opacity:0.1;stroke-opacity:0.9"></rect>
          // 날짜별 구분선
          day_g.append("line")
            .attr("x1", startPosX)
            .attr("y1", posY - ROW_HEIGHT * 0.75)
            .attr("x2", hourPosX2)
            .attr("y2", posY - ROW_HEIGHT * 0.75)
            .attr("stroke-width", 2)
            .attr("stroke","rgb(40,40,40)");

          // 날짜 출력
          day_g.append("text")
            .attr("x", posX)
            .attr("y", posY)
            .text(oneDay);

          // 오늘 날짜 부분 음영 표기
          if ( Moment(new Date()).format("YYYY-MM-DD") == oneDay ) {
            day_g.append("rect")
              .attr("x", startPosX)
              .attr("width", hourPosX2 - startPosX)
              .attr("y", posY - ROW_HEIGHT + 5)
              .attr("height", ROW_HEIGHT * room_cnt)
              .attr("fill", "#98df8a")
              .attr("fill-opacity", "0.2");
            //
          }

          for ( var roomIndex = 0 ; roomIndex < room_cnt ; roomIndex++ ) 
          {
            var roomPosX = posX + 100;

            // 회의실 이름
            room_g.append("text")
              .attr("x", roomPosX + 10)
              .attr("y", posY - 3)
              .text(roomData[roomIndex].name);

            // 회의실간 구분선
            if ( roomIndex+1 != room_cnt ) {
              room_g.append("line")
                .attr("x1", roomPosX)
                .attr("y1", posY + ROW_HEIGHT * 0.2)
                .attr("x2", hourPosX2)
                .attr("y2", posY + ROW_HEIGHT * 0.2)
                .attr("stroke-width", 0.5)
                .attr("stroke",colorList[0])
                .attr("stroke-opacity", "0.4");
            }

            // 회의 셋팅
            for ( var regIndex = 0 ; regIndex < regData[oneDay][roomIndex+1].length ; regIndex++ ) 
            {
              var roomRegModel = regData[oneDay][roomIndex+1][regIndex];
              var posRegX1 = hourPosX1 + _this.getPositionX( roomRegModel.attributes.start_time, hourLen );
              var posRegX2 = hourPosX1 + _this.getPositionX( roomRegModel.attributes.end_time, hourLen );
              var rectWidth = posRegX2 - posRegX1;

              var reg1_g = reg_g.append("g")
                .attr("id", "reg_index_"+roomRegModel.attributes.index)
                .attr("class", "roomRegRect")
                .attr("date", roomRegModel.attributes.date)
                .attr("room_index", roomRegModel.attributes.room_index)
                .attr("transform", "translate("+posRegX1+","+posY+")");

              reg1_g.append("rect")
                .attr("width", rectWidth)
                .attr("y", -(ROW_HEIGHT * 0.6) )
                .attr("height", ROW_HEIGHT* 0.7)
                .attr("fill", colorList[colorListIndex])
                .attr("fill-opacity", "0.9");
              colorListIndex++;

              var titleText = roomRegModel.attributes.title;
              var charNum = Math.floor(rectWidth / 12);
              if ( charNum < titleText.length ) {
                titleText = titleText.substring(0,charNum) + "..";
              }

              reg1_g.append("text")
                .attr("x", 5)
                .attr("y", -3)
                .html(titleText);

              var tooltip 
                = roomRegModel.attributes.title + " - " 
                  + roomRegModel.attributes.user_name + "<br>" 
                  + roomRegModel.attributes.start_time.substring(0,5) + "~" + roomRegModel.attributes.end_time.substring(0,5);
              
              reg1_g.append("title").html(tooltip);

              // $(this.el).find("#reg_index_"+roomRegModel.attributes.index).append(tooltip);
            }

              posY += ROW_HEIGHT;
          }
        }
        // 날짜별 구분선
        day_g.append("line")
          .attr("x1", startPosX)
          .attr("y1", posY - ROW_HEIGHT * 0.75)
          .attr("x2", hourPosX2)
          .attr("y2", posY - ROW_HEIGHT * 0.75)
          .attr("stroke-width", 2)
          .attr("stroke","rgb(40,40,40)");

      },

      getPositionX: function(time, hourLen) {
        var timePos = Moment(time,"HH:mm");
        var standardPos = Moment("08:00","HH:mm");  // 기준점

        var hourCnt = timePos.hours() - standardPos.hours();
        var minCnt = timePos.minutes() - standardPos.minutes();

        if ( hourCnt < 0 )
          return 0;

        return (hourCnt*hourLen) + ((minCnt*100/60)/100*hourLen);
      },

      getRoomInfo: function() {
        var dfd = new $.Deferred();
        var _this = this;
        var _roomColl = new RoomCollection();
        _roomColl.url = '/room';
        _roomColl.fetch({
            data: {},
            error: function(result) {
                dfd.reject();
            }
        }).done(function(result) {
            _this.elements._roomData = [];
            if (result.length > 0) {
                for(var i = 0; i < result.length; i++){
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

      onClickSearchReg:function(event){
        var regIndex = $(event.target).parent().attr("id");
        regIndex = regIndex.replace("reg_index_","");
        var roomIndex = $(event.target).parent().attr("room_index");
        var date = $(event.target).parent().attr("date");

        var roomList = this.elements._regData[date][roomIndex];
        for ( var i = 0 ; i < roomList.length ; i++ ) {
          if ( roomList[i].attributes.index == regIndex )
          {
            // Dialog Setting
            console.log("regInfo : " + regIndex +", "+ roomIndex+", "+date);
            var _this = this;
        
            var editRoomRegPopupView= new EditRoomRegPopupView(this);
            editRoomRegPopupView.setData(roomList[i]);


            var buttonList = [];
            if ( roomList[i].attributes.member_id == SessionModel.getUserInfo().id ) {
              buttonList = 
              [{
                label: "회의 취소",
                cssClass: Dialog.CssClass.SUCCESS,
                action: function(dialogRef){// 버튼 클릭 이벤트
                  editRoomRegPopupView.onClickBtnDel().done(function() {
                    dialogRef.close();
                    var date_period_el = $(this.el).find("#date_period");
                    var start_date = date_period_el.attr("start_date");
                    var end_date = date_period_el.attr("end_date");
                    _this.loadData(start_date, end_date);
                  });
                }
              },{
                label: i18Common.DIALOG.BUTTON.SAVE,
                cssClass: Dialog.CssClass.SUCCESS,
                action: function(dialogRef){// 버튼 클릭 이벤트
                  editRoomRegPopupView.onClickBtnReg().done(function() {
                    dialogRef.close();
                    var date_period_el = $(this.el).find("#date_period");
                    var start_date = date_period_el.attr("start_date");
                    var end_date = date_period_el.attr("end_date");
                    _this.loadData(start_date, end_date);
                  });
                }
              }, {
                label: i18Common.DIALOG.BUTTON.CLOSE,
                action: function(dialogRef){
                    dialogRef.close();
                }
              }];
            }else{
              buttonList = 
              [{
                label: i18Common.DIALOG.BUTTON.CLOSE,
                action: function(dialogRef){
                    dialogRef.close();
                }
              }];
            }

            Dialog.show({
                title:'회의실 조회/수정', 
                content:editRoomRegPopupView,
                buttons: buttonList   
            });

          }
        }
      },

      onClickNextWeek: function() {
        var date_period_el = $(this.el).find("#date_period");

        var start_date = date_period_el.attr("start_date");
        var fromDate = Moment(start_date,"YYYY-MM-DD").add(7,"days").format("YYYY-MM-DD");
        var toDate = Moment(fromDate,"YYYY-MM-DD").add(4,"days").format("YYYY-MM-DD");

        this.loadData(fromDate, toDate);
      },

      onClickPrevWeek: function() {
        var date_period_el = $(this.el).find("#date_period");

        var start_date = date_period_el.attr("start_date");
        var fromDate = Moment(start_date,"YYYY-MM-DD").add(-7,"days").format("YYYY-MM-DD");
        var toDate = Moment(fromDate,"YYYY-MM-DD").add(4,"days").format("YYYY-MM-DD");

        this.loadData(fromDate, toDate);
      },

      onClickRoomRegBtn:function(){
        var _this = this;
        
        var editRoomRegPopupView= new EditRoomRegPopupView(this);
        Dialog.show({
            title:'회의실 예약', 
            content:editRoomRegPopupView,
            buttons:
            [{
                label: i18Common.DIALOG.BUTTON.ADD,
                cssClass: Dialog.CssClass.SUCCESS,
                action: function(dialogRef){// 버튼 클릭 이벤트
                  editRoomRegPopupView.onClickBtnReg().done(function() {
                    dialogRef.close();
                    var date_period_el = $(this.el).find("#date_period");
                    var start_date = date_period_el.attr("start_date");
                    var end_date = date_period_el.attr("end_date");
                    _this.loadData(start_date, end_date);
                  });
                }
            }, {
                label: i18Common.DIALOG.BUTTON.CLOSE,
                action: function(dialogRef){
                    dialogRef.close();
                }
            }]
            
        });
      }
    });    
    return RoomReserveView;
});