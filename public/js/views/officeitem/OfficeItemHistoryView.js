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
    'text!templates/officeitem/HistorySearchFormTemplate.html',
    'models/officeitem/OfficeItemHistoryModel',
    'collection/officeitem/OfficeItemHistoryCollection',
    'views/officeitem/popup/UsageOfficeItemHistoryPopupView',
    'cmoment',
    'code'
  ], function(
    $, _, Backbone, Util, BaseView, Grid, LodingButton, Schemas, i18nCommon, Dialog, SessionModel, 
    HeadHTML, ContentHTML, LayoutHTML, 
    SearchFormHTML,
    OfficeItemHistoryModel, OfficeItemHistoryCollection, 
    UsageOfficeItemHistoryPopupView,
    Moment, Code
  ){
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
                    { data : "serial_yes",     title : i18nCommon.OFFICEITEM.HISTORY.CODE.SERIAL_YES },
                    { title : i18nCommon.OFFICEITEM.HISTORY.CODE.CATEGORY_NAME,
                        "render": function(data, type, row){
                            var serial = row.serial_yes;
                            var codeList = _view.officeItemCodes;

                            var code, name;
                            for(var index in codeList){
                                code = codeList[index].code;
                                if( serial.indexOf(code) == 0){
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
                    { data : "title",          title : i18nCommon.OFFICEITEM.HISTORY.CODE.TITLE },
                    { data : "repair_price",   title : i18nCommon.OFFICEITEM.HISTORY.CODE.REPAIR_PRICE },
                    { title : i18nCommon.OFFICEITEM.HISTORY.CODE.OWNER,
                        "render": function(data, type, row){
                            console.log(row);
                            var user = row.use_user;
                            return ((user!==null&&user!=="")?row.use_user:row.use_dept);
                        }
                    }, //use_user or use_dept
                    { data : "memo",           "title" : i18nCommon.OFFICEITEM.HISTORY.CODE.MEMO }
                ],
                dataschema:["seq", "serial_yes", "category_type", "history_date", "type", "title", "repair_price", "use_user", "use_dept", "name", "change_user_id", "memo"],
                collection:this.officeItemHistoryCollection,
                detail:true,
                view:this,
                fetch: false,
                order:[1, "asc"]
                //order:[[5, "desc"], [1, "asc"]]
            };
            this.gridExcel = {
                el:"ExportHistory_content",
                id:"ExportHistoryGrid",
                column:[
                    { data : "serial_yes",     title : i18nCommon.OFFICEITEM.HISTORY.CODE.SERIAL_YES },
                    { data : "category_type",  title : i18nCommon.OFFICEITEM.HISTORY.CODE.CATEGORY_TYPE },
                    { title : i18nCommon.OFFICEITEM.HISTORY.CODE.CATEGORY_NAME,
                        "render": function(data, type, row){
                            var serial = row.serial_yes;
                            var codeList = _view.officeItemCodes;

                            var code, name;
                            for(var index in codeList){
                                code = codeList[index].code;
                                if( serial.indexOf(code) == 0){
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
                    { data : "type",           title : i18nCommon.OFFICEITEM.HISTORY.CODE.TYPE },
                    { data : "title",          title : i18nCommon.OFFICEITEM.HISTORY.CODE.TITLE },
                    { data : "repair_price",   title : i18nCommon.OFFICEITEM.HISTORY.CODE.REPAIR_PRICE },
                    //{ data : "use_user",       title : i18nCommon.OFFICEITEM.HISTORY.CODE.USER_ID },
                    //{ data : "use_dept",       title : i18nCommon.OFFICEITEM.HISTORY.CODE.USE_DEPT },
                    { title : i18nCommon.OFFICEITEM.HISTORY.CODE.OWNER,
                        "render": function(data, type, row){
                            console.log(row);
                            var user = row.use_user;
                            return ((user!==null&&user!=="")?row.use_user:row.use_dept);
                        }
                    }, //use_user or use_dept
                    { data : "name",           "title" : i18nCommon.OFFICEITEM.HISTORY.CODE.NAME },
                    { data : "change_user_id", "title" : i18nCommon.OFFICEITEM.HISTORY.CODE.CHANGE_USER_ID },
                    { data : "memo",           "title" : i18nCommon.OFFICEITEM.HISTORY.CODE.MEMO }
                ],
                detail: true,
                dataschema:["seq", "serial_yes", "category_type", "history_date", "type", "title", "repair_price", "use_user", "use_dept", "name", "change_user_id", "memo"],
                collection:this.officeItemHistoryCollection,
                detail: true,
                fetch: false,
                order: [[1, "name"]]
            };
        },
        events : {
            "change #ccmCombo" : "setOfficeItemNameData",
            "click #ccmSearchBtn" : "onClickSearchBtn"
        },
        onClickSearchBtn: function(evt) {
            this.selectOfficeItemHistoryData();
        },
        onClickSave: function(grid) {
            grid.saveExcel();
        },
        getSearchForm: function() {	// 검색 조건
            var startDate = Moment($(this.el).find("#ccmFromDatePicker").data("DateTimePicker").getDate().toDate());
            var endDate = Moment($(this.el).find("#ccmToDatePicker").data("DateTimePicker").getDate().toDate());

            if(startDate.isAfter(endDate)){
                Dialog.warning("시작일자가 종료일자보다 큽니다.");
                return;
            }

            var data = {
                start : startDate.format("YYYY-MM-DD"),
                end : endDate.format("YYYY-MM-DD"),
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
                    _this.gridExcel.render();  //Excel 출력용
               },
               errorCallBack:function(response){
                   Dialog.error( i18nCommon.OFFICEITEM.MSG.LOADING_FAIL );
               },
           });
        },
        setOfficeItemNameData : function(){
            var officeItemNameList = [{key:"전체",value:"전체"}];
            var type = $(this.el).find("#ccmCombo").val();
            
            if (type != "전체") {
                var codes = this.officeItemCodes;
                for(var index in codes){
                    if(codes[index].type == type)
                        officeItemNameList.push({key:codes[index].code, value:codes[index].name});
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
                subTitle:i18nCommon.OFFICEITEM.SUB_TITLE.OFFICEITEM_HISTORY
            }
            )));
            _head.addClass("no-margin");
            _head.addClass("relative-layout");

            // 검색 조건 Row
            var _row=$(_.template(SearchFormHTML)({
                    obj : {
                        fromId : "ccmFromDatePicker",
                        toId : "ccmToDatePicker",
                        typeLabel : i18nCommon.OFFICEITEM.HISTORY.CODE.CATEGORY_TYPE,
                        typeId : "ccmCombo",
                        nameLabel : i18nCommon.OFFICEITEM.HISTORY.CODE.CATEGORY_NAME,
                        nameId : "ccmSubCombo",
                        btnLabel: i18nCommon.OFFICEITEM.LIST.SEARCH_BTN,
                        btnId: "ccmSearchBtn"
                    }
                })
            );

    	    //grid button add;
            var _buttons=["search"];
            this.option.buttons=_buttons;
            
            //if (this.actionAuth.save) {
                _buttons.push({ // detail
                    type: "custom",
                    name: "save",
                    tooltip: "저장하기",
                    click: function(_grid) {
                        _view.onClickSave(_view.gridExcel);
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

            //Excel 출력
            var _gridExcelSchema = Schemas.getSchema('grid');
            this.gridExcel = new Grid(_gridExcelSchema.getDefault(this.gridExcel));
            this.gridExcel.render();

            //기기이름 Set
            this.setOfficeItemNameData();
            //이력 가져오기
            this.selectOfficeItemHistoryData();

            return this;
        },
      });
      
      return OfficeItemHistoryView;
  });