define([
    'jquery',
    'underscore',
    'backbone',
    'util',
    'core/BaseView',
    'grid',
    'lodingButton',
    'schemas',
    'i18n!nls/common',
    'dialog',
    'models/sm/SessionModel',
    'text!templates/default/head.html',
    'text!templates/default/content.html',
    'text!templates/layout/default.html',
    'text!templates/default/row.html',
    'text!templates/default/rowdatepickerRange.html',
    'text!templates/default/rowbuttoncontainer.html',
    'text!templates/default/rowbutton.html',
    'text!templates/default/rowcombo.html',
    'models/officeitem/OfficeItemHistoryModel',
    'collection/officeitem/OfficeItemHistoryCollection',
    //'views/officeitem/popup/AddOfficeItemCodeView',
    //'views/officeitem/popup/EditOfficeItemCodeView',
    'views/officeitem/popup/UsageOfficeItemHistoryPopupView',
    'cmoment',
    'code'
  ], function(
    $, _, Backbone, Util, BaseView, Grid, LodingButton, Schemas, i18nCommon, Dialog, SessionModel, 
    HeadHTML, ContentHTML, LayoutHTML, 
    RowHTML, DatePickerHTML, RowButtonContainerHTML, RowButtonHTML, RowComboHTML, 
    OfficeItemHistoryModel, OfficeItemHistoryCollection, 
    //AddOfficeItemCodeView, EditOfficeItemCodeView,
    UsageOfficeItemHistoryPopupView,
    Moment, Code
  ){
      //var userListCount=0;
      //var _currentFilter=0;
      var OfficeItemHistoryView = BaseView.extend({
        el:".main-container",
        initialize:function(){
            var _view = this;
            this.categoryType = [
                {key:"all", value:"전체"},
                {key:i18nCommon.OFFICEITEM.CATEGORY.TYPE.OS,value:i18nCommon.OFFICEITEM.CATEGORY.TYPE.OS},
                {key:i18nCommon.OFFICEITEM.CATEGORY.TYPE.CS,value:i18nCommon.OFFICEITEM.CATEGORY.TYPE.CS}
            ];
            this.officeItemCodes = Code.getCodes(Code.OFFICEITEM);
            this.officeItemHistoryCollection = new OfficeItemHistoryCollection();
            this.option = {
                el:"officeitemhistory_content",
                id:"officeItemHistoryTable",
                column:[
                    //{ data : "seq",            title : i18nCommon.OFFICEITEM.HISTORY.CODE.SEQ, visible:false, subVisible:false },
                    { data : "serial_yes",     title : i18nCommon.OFFICEITEM.HISTORY.CODE.SERIAL_YES },
                    //{ data : "category_type",  title : i18nCommon.OFFICEITEM.HISTORY.CODE.CATEGORY_TYPE, visible:false, subVisible:false },
                    { title : i18nCommon.OFFICEITEM.HISTORY.CODE.CATEGORY_NAME,
                        "render": function(data, type, row){
                            var serial = row.serial_yes;
                            //serial = serial.substring(0, serial.lastIndexOf("-"));
                            var codeList = _view.officeItemCodes;

                            var code, name;
                            for(var index in codeList){
                                //code = codeList[index].category_code;
                                code = codeList[index].code;
                                if( serial.indexOf(code) == 0){
                                    //name = codeList[index].category_name;
                                    name = codeList[index].name;
                                    break;
                                }
                            }
                            return name;
                        }
                    },
                    { data : "history_date",   title : i18nCommon.OFFICEITEM.HISTORY.CODE.HISTORY_DATE,
                        "render": function(data, type, row){
                            var data = Moment(row.history_date).format("YYYY-MM-DD");
                            return data;
                        }
                    },
                    //{ data : "type",           title : i18nCommon.OFFICEITEM.HISTORY.CODE.TYPE, visible:false, subVisible:false },
                    { data : "title",          title : i18nCommon.OFFICEITEM.HISTORY.CODE.TITLE },
                    { data : "repair_price",   title : i18nCommon.OFFICEITEM.HISTORY.CODE.REPAIR_PRICE },
                    //{ data : "use_user",       title : i18nCommon.OFFICEITEM.HISTORY.CODE.USER_ID, visible:false, subVisible:false },
                    //{ data : "use_dept",       title : i18nCommon.OFFICEITEM.HISTORY.CODE.USE_DEPT, visible:false, subVisible:false },
                    { title : i18nCommon.OFFICEITEM.HISTORY.CODE.OWNER,
                        "render": function(data, type, row){
                            console.log(row);
                            var user = row.use_user;
                            return ((user!==null&&user!=="")?row.use_user:row.use_dept);
                        }
                    }, //use_user or use_dept
                    //{ data : "name",           "title" : i18nCommon.OFFICEITEM.HISTORY.CODE.NAME, visible:false, subVisible:false },
                    //{ data : "change_user_id", "title" : i18nCommon.OFFICEITEM.HISTORY.CODE.CHANGE_USER_ID, visible:false, subVisible:false },
                    { data : "memo",           "title" : i18nCommon.OFFICEITEM.HISTORY.CODE.MEMO }
                ],
                dataschema:["seq", "serial_yes", "category_type", "history_date", "type", "title", "repair_price", "use_user", "use_dept", "name", "change_user_id", "memo"],
                collection:this.officeItemHistoryCollection,
                detail:true,
                view:this,
                fetch: false,/*
                buttons:["search",{
                    type:"myRecord",
                    name: "myRecord",
                    filterColumn:["name"], //필터링 할 컬럼을 배열로 정의 하면 자신의 아이디 또는 이름으로 필터링 됨. dataschema 에 존재하는 키값.
                    tooltip: "",
                }],*/
                order:[1, "asc"]
                //order:[[5, "desc"], [1, "asc"]]
            };
        },
        events : {
            "change #ccmCombo" : "setOfficeItemNameData",
            "click #ccmSearchBtn" : "onClickSearchBtn"
              //"mouseover .userpic" : "over",
              //"mouseleave .userpic" : "leave",
        },/*
          over:function(event){
              var id = $(event.currentTarget).data("id");
              var picdiv = $("<div id='picdiv' style='position: absolute; z-index: 1000;border:solid 1px #2ABB9B;padding: 2px; background-color:white'></div>");
              var img = $("<img src='/userpic?file="+id+"' height='140' width='100'>");
              
              var windowHeight = $(window).height();
              var top = event.pageY + 25;
              var left = event.pageX + 5;
              top = windowHeight < top + 180 ? top-190 : top;
              
              picdiv.css("top", top);
              picdiv.css("left", left);
              picdiv.append(img);
              
              $(this.el).append(picdiv);
          },
          leave:function(){
              $(this.el).find("#picdiv").remove();
        },*/
        onClickSearchBtn: function(evt) {
            this.selectOfficeItemHistoryData();
        },
        onClickSave: function(grid) {
            grid.saveExcel();
        },
        getSearchForm: function() {	// 검색 조건
            var startDate = Moment($(this.el).find("#ccmFromDatePicker").data("DateTimePicker").getDate().toDate());
            var endDate = Moment($(this.el).find("#ccmToDatePicker").data("DateTimePicker").getDate().toDate());
            var data = {
                start : Moment($(this.el).find("#ccmFromDatePicker").data("DateTimePicker").getDate().toDate()).format("YYYY-MM-DD"),
                end : Moment($(this.el).find("#ccmToDatePicker").data("DateTimePicker").getDate().toDate()).format("YYYY-MM-DD"),
                type : $(this.el).find("#ccmCombo").val(),
                code : $(this.el).find("#ccmSubCombo").val()
            }
            /*
            if (Util.isNotNull(this.searchParam) ) { // URL로 이동한 경우  셋팅된 검색 조건이 있을 경우
                data.id = this.searchParam.id;
            }

            if ( Util.isNull(data.startDate) ) {
                alert("검색 시작 날짜를 선택해주세요");
                return null;
            } else if ( Util.isNull(data.endDate) ) {
                alert("검색 끝 날짜를 선택해주세요");
                return null;
            }*/

            return data;
        },
        selectOfficeItemHistoryData: function() {	// 데이터 조회
            var data = this.getSearchForm();
            if (Util.isNull (data) ) {
                return;
            }

           var _this = this;
           Dialog.loading({
               action:function(){
                   var dfd = new $.Deferred();
                   _this.officeItemHistoryCollection.fetch({
                       data: data,
                       success: function(result) {
                           dfd.resolve();
                       },
                       error : function(result) {
                           dfd.reject();
                       }
                   });
                   return dfd.promise();
               },

               actionCallBack:function(res){//response schema
                    _this.grid.render();
                /*
                   _this.grid.render().then(function(result){//Search 필터 값 저장 기능: 전체데이터 조회 후 처리상태 필터링
                       var STATE = i18Common.COMMENT.STATE;
                       var _filterText=[STATE.ALL, STATE.ACCEPTING, STATE.PROCESSING, STATE.COMPLETE];
                       if (_currentFilter != 0) {
                           $("#commuteDataTable_custom_filter_Btn").html(_filterText[_currentFilter]);
                       }
                   });
                   
                   if (Util.isNotNull(_this.searchParam) ) { // URL로 이동한 경우  셋팅된 검색 조건이 있을 경우
                       _this.searchParam = null; // url 접속 - 최초 검색 후 초기화

                       // URL 접속시 필터를 전체로 변경하기 위해 강제 크릭
                       var filterBtn =$(_this.el).find("#commuteDataTable_custom_myRecord_Btn");
                       if(filterBtn.text() =="나")
                           $(_this.el).find("#commuteDataTable_custom_myRecord_Btn").trigger("click");
                   }*/
               },
               errorCallBack:function(response){
                   Dialog.error( i18nCommon.RAW_DATA_LIST.MSG.LOADING_FAIL );
               },
           });
        },
        setOfficeItemNameData : function(){
            var officeItemNameList = [{key:"전체",value:"전체"}];
            var type = $(this.el).find("#ccmCombo").val();
            
            if (type != "전체") {
                var codes = this.officeItemCodes;
                for(var index in codes){
                    //if(codes[index].category_type == type)
                    if(codes[index].type == type)
                        officeItemNameList.push({key:codes[index].code, value:codes[index].name});
                        //officeItemNameList.push({key:codes[index].category_code, value:codes[index].category_name});
                }
            }
            //기기분류 Set
            $(this.el).find("#ccmSubCombo").empty();
            for(var index in officeItemNameList){
                $(this.el).find("#ccmSubCombo").append("<option value="+officeItemNameList[index].key+">" + officeItemNameList[index].value +"</option>");
            }
        },
        render:function(){
            var _view = this;
            var _headSchema=Schemas.getSchema('headTemp');
            var _headTemp=_.template(HeadHTML);
            var _layOut=$(LayoutHTML);
            //Head 
            var _head=$(_headTemp(_headSchema.getDefault(
            {
                title:i18nCommon.OFFICEITEM.TITLE.OFFICEITEM_MANAGER, 
                subTitle:i18nCommon.OFFICEITEM.SUB_TITLE.OFFICEITEM_CODE
            }
            )));
            _head.addClass("no-margin");
            _head.addClass("relative-layout");

            var _row=$(RowHTML);
            var _datepickerRange=$(_.template(DatePickerHTML)({
                    obj : {
                        fromId : "ccmFromDatePicker",
                        toId : "ccmToDatePicker"
                    }
                })
            );
            var _combo = $(_.template(RowComboHTML)({
                    obj : {
                        id : "ccmCombo",
                        label : "기기 분류"
                    }
            }));
            var _subCombo = $(_.template(RowComboHTML)({
                obj : {
                    id : "ccmSubCombo",
                    label : "기기 이름"
                }
            }));
            
            var _btnContainer = $(_.template(RowButtonContainerHTML)({
                    obj : {
                        id : "ccmBtnContainer"
                    }
                })
            );
            var _searchBtn = $(_.template(RowButtonHTML)({
                    obj: {
                        id: "ccmSearchBtn",
                        label: "검색"
                    }
                })
            );
            _btnContainer.append(_searchBtn);

            _row.append(_datepickerRange);
            _row.append(_combo);
            _row.append(_subCombo);
            _row.append(_btnContainer);

    	    //grid button add;
            var _buttons=["search"];
            this.option.buttons=_buttons;
            //var _buttons = this.option.buttons;
            
            //if (this.actionAuth.save) {
                _buttons.push({ // detail
                    type: "custom",
                    name: "save",
                    tooltip: "저장하기",
                    click: function(_grid) {
                        _view.onClickSave(_view.grid);
                    }
                });
            //};

            var _content=$(ContentHTML).attr("id", this.option.el);

            _layOut.append(_head);
            _layOut.append(_row);
            _layOut.append(_content);

            $(this.el).html(_layOut);
            
            // From ... To ... Set
            var today = new Date();
            var firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
            firstDay.setMonth(firstDay.getMonth()-1);
            $(this.el).find("#ccmFromDatePicker").datetimepicker({
                picTime: false,
                language: "ko",
                todayHighlight: true,
                format: "YYYY-MM-DD",
                defaultDate: Moment(firstDay).format("YYYY-MM-DD")
            });
            $(this.el).find("#ccmToDatePicker").datetimepicker({
            	pickTime: false,
		        language: "ko",
		        todayHighlight: true,
		        format: "YYYY-MM-DD",
		        defaultDate: Moment(today).format("YYYY-MM-DD")
            });

            //기기분류 Set
            var category = this.categoryType;
            for(var index in category){
                $(this.el).find("#ccmCombo").append("<option>" + category[index].value +"</option>");
            }

            //grid
            var _gridSchema = Schemas.getSchema('grid');
            this.grid = new Grid(_gridSchema.getDefault(this.option));
            //this.grid.render();

            //기기이름 Set
            this.setOfficeItemNameData();
            //이력 가져오기
            this.selectOfficeItemHistoryData();

            return this;
        }
      });
      
      return OfficeItemHistoryView;
  });