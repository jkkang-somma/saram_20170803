define([
    'jquery',
    'underscore',
    'backbone',
    'core/BaseView',
    'cmoment',
    'grid',
    'lodingButton',
    'schemas',
    'code',
    'i18n!nls/common',
    'dialog',
    'text!templates/default/head.html',
    'text!templates/default/row.html',
    'text!templates/default/rowdatepicker.html',
    'text!templates/default/rowbuttoncontainer.html',
    'text!templates/default/rowbutton.html',
    'text!templates/default/rowcombo.html',
    'text!templates/default/content.html',
    'text!templates/layout/default.html',
    'models/sm/SessionModel',
    'models/officeitem/OfficeItemUsageModel',
    'collection/common/HolidayCollection',
    'collection/officeitem/OfficeItemUsageCollection',
    'collection/officeitem/OfficeItemDetailCollection',
    'text!templates/default/button.html',
    'text!templates/officeitem/usageHistoryTemplate.html',
    'views/officeitem/popup/UsageOfficeItemHistoryPopupView',
    'views/officeitem/popup/UsageDetailListPopup'
], function($, _, Backbone, BaseView, Moment, Grid, LodingButton, Schemas, Code, i18nCommon, Dialog, HeadHTML, RowHTML,
            DatePickerHTML, RowButtonContainerHTML, RowButtonHTML, RowComboHTML, ContentHTML, LayoutHTML,
            SessionModel, OfficeItemUsageModel, HolidayCollection, OfficeItemUsageCollection, OfficeItemDetailCollection, ButtonHTML, usageHistoryTemplate,
            UsageHistoryListPopup, UsageDetailListPopup){

    // 비품 컬럼 생성
    function _changeWordBreak(cellData) {
        let text = "";
        text = _getWordBreak(cellData);
        if(_.isNull(text)){
            text = "-";
        }
        return text;
    }

    // 비품 컬럼 줄바꿈 처리
    function _getWordBreak(word) {
        if(word != undefined) {
            let wordArr = word.split(",");
            if (wordArr.length > 1) {
                let bwords = "";
                for (let i=0; i < wordArr.length; i++) {
                    if(i==0) {
                        bwords = wordArr[i];
                    } else {
                        bwords = bwords + "</br>" + wordArr[i];
                    }
                }
                return bwords;
            }else{
                return word;
            }
        }
        return null;
    }

    // 비품 컬럼 줄바꿈 처리 및 비품 이력 팝업 처리
    function _getTemplate(items) {
        if(items != undefined) {
            let wordArr = items.split(",");
            let itemList;
            let wordObj = {id:"", name:""};
            if (wordArr.length > 1) {
                for (let i=0; i < wordArr.length; i++) {
                    wordObj.id = wordArr[i];
                    wordObj.item = wordArr[i];
                    if(i==0) {
                        itemList = (SessionModel.get("user").admin == 9) ? _.template(usageHistoryTemplate)(wordObj) : wordObj.item;
                    } else {
                        itemList = itemList + "</br>" + (SessionModel.get("user").admin == 9) ? _.template(usageHistoryTemplate)(wordObj) : wordObj.item;
                    }
                }
                wordObj = {id:"", name:""};
                return itemList;
            }else{
                wordObj.id = items;
                wordObj.item = items;
                itemList = (SessionModel.get("user").admin == 9) ? _.template(usageHistoryTemplate)(wordObj) : wordObj.item;
                wordObj = {id:"", name:""};
                return itemList;
            }
        }
        return "-";
    }
    //부서코드로부터 부서이름 가져오기.
    function _getDeptName(data) {
        if(data != undefined) {
            let deptName = "";
            let default_dept = Code.getCodes(Code.DEPARTMENT);
            for (let i = 0; i < default_dept.length; i++) {
                if (default_dept[i].code == data) {
                    deptName = default_dept[i].name;
                }
            }
            return deptName;
        }
        return "-";
    }

    var officeItemUsageView = BaseView.extend({
        el:$(".main-container"),

        initialize:function(){

            this.officeItemUsageCollection = new OfficeItemUsageCollection();
            this.gridOption = {
                el:"usage_content",
                id:"usageDataTable",
                column:[
                    { data : "name", 		"title" : i18nCommon.USAGE_LIST.GRID_COL_NAME.NAME},
                    { data : "dept",        "title" : i18nCommon.USAGE_LIST.GRID_COL_NAME.DEPARTMENT,  className: "dt-body-right",
                        render: function(data) {
                            return _getDeptName(data);
                        }},
                    { data : "desctop",     "title" : i18nCommon.USAGE_LIST.GRID_COL_NAME.DESCTOP,
                        render: function(data) {
                            return _getTemplate(data);
                        }},
                    { data : "monitor", 	"title" : i18nCommon.USAGE_LIST.GRID_COL_NAME.MONITOR,
                        render: function(data) {
                            return _getTemplate(data);
                        }},
                    { data : "notebook", 	"title" : i18nCommon.USAGE_LIST.GRID_COL_NAME.NOTEBOOK,
                        render: function(data) {
                            return _getTemplate(data);
                        }},
                    { data : "ip", 		    "title" : i18nCommon.USAGE_LIST.GRID_COL_NAME.IP,
                        render: function(data) {
                            return _changeWordBreak(data);
                        }},
                    { data : "leave_company", "title" : i18nCommon.USER.LEAVE_COMPANY, visible: false, subVisible: false},
                    { data : "id", "title" : i18nCommon.USAGE_LIST.GRID_COL_NAME.DETAIL, "render": function(data, type, row){
                            let dataVal = "<div style='text-align: center;'>";
                            dataVal +=  "<button class='btn list-detailUsage-btn btn-default btn-sm' id='btnDetail01'><span class='glyphicon glyphicon-list-alt' aria-hidden='true'></span></button>";
                            dataVal +=  "</div>";
                            return dataVal;
                        }}


                ],

                collection:this.officeItemUsageCollection,
                dataschema:["id", "name", "dept", "desctop", "monitor", "ip", "notebook", "leave_company"],
                detail: true,
                fetch: false,
                order : [[1, "asc"]]
            };

            this.gridOption.buttons = this.buttonInit();

            //make Excel Export
            this.excelExportCollection = new OfficeItemDetailCollection();
            this.gridExcel = {
                el:"ExportDetailList_content",
                id:"ExportDetailListGrid",
                column:[
                    {data : "name", "title" : i18nCommon.USAGE_LIST.GRID_COL_NAME.NAME},
                    {data : "dept", "title" : i18nCommon.USAGE_LIST.GRID_COL_NAME.DEPARTMENT,
                        render: function(data) {
                            return _getDeptName(data);
                        }},
                    {data : "category_name", "title" : i18nCommon.USAGE_LIST.GRID_COL_NAME.CATEGORY_NAME},
                    {data : "serial_yes", "title" : i18nCommon.USAGE_LIST.GRID_COL_NAME.SERIAL},
                    {data : "model_no", "title" : i18nCommon.USAGE_LIST.GRID_COL_NAME.MODEL},
                    {data : "buy_date", "title" : i18nCommon.USAGE_LIST.GRID_COL_NAME.BUYDATE},
                ],
                detail: true,
                dataschema:["name", "dept", "category_name", "serial_yes", "model_no", "buy_date"],
                collection:this.excelExportCollection,
                detail: true,
                fetch: false,
                order: [[1, "name"]]
            };
        },
        events: {
            'click #oiuSearchBtn' : 'onClickSearchBtn',
            'click #usageDataTable .td-used-history' : 'onClickUsageHistoryPopup',
            'click .list-detailUsage-btn' : 'onClickListDetailUsageBtn'
        },

        buttonInit: function(){
            let _this = this;
            let adminUserfilterButton = ["search",{//관리자용 사용자별 상태 확인 버튼
                type:"EmployStatus",
                name: "EmployStatus",
                filterColumn:["leave_company"],
                tooltip: ""
            }];

            let normalUserfilterButton = ["search",{//일반 사용자용 버튼. "나" 만 표시함.
                type:"OnlyMy",
                name: "OnlyMy",
                filterColumn:["name"],
                tooltip: ""
            }];

            let _buttonSetting = [];
            if (SessionModel.get("user").admin == 9) { //부서 선택 필터에 전체 부서가 들어감.
                _buttonSetting = adminUserfilterButton;
            } else {
                //_buttonSetting = normalUserfilterButton;
            }
            //excel 출력 버튼 추가 - 관리자에게만 제공
            if (SessionModel.get("user").admin == 9) {
                _buttonSetting.push({
                    type: "custom",
                    name: "save",
                    tooltip: "저장하기",
                    click: function(_grid) {
                        _this.onClickSave(_this.gridExcel);
                    }
                });
            };

            return _buttonSetting;
        },

        render:function(){
            var _headSchema=Schemas.getSchema('headTemp');
            var _headTemp=_.template(HeadHTML);
            var _layOut=$(LayoutHTML);
            var _head=$(_headTemp(_headSchema.getDefault(
                {
                    title:i18nCommon.USAGE_LIST.TITLE,
                    subTitle:i18nCommon.USAGE_LIST.SUB_TITLE
                }
            )));

            _head.addClass("no-margin");
            _head.addClass("relative-layout");

            var _row=$(RowHTML);
            var _btnContainer = $(_.template(RowButtonContainerHTML)({
                    obj: {
                        id: "oiuBtnContainer"
                    }
                })
            );

            var _searchBtn = $(_.template(RowButtonHTML)({
                    obj: {
                        id: "oiuSearchBtn",
                        label: i18nCommon.USAGE_LIST.SEARCH_BTN,
                    }
                })
            );

            var _combo = $(_.template(RowComboHTML)({
                    obj : {
                        id : "rdCombo",
                        label : "부서"
                    }
                })
            );

            _btnContainer.append(_searchBtn);

            _row.append(_combo);
            _row.append(_btnContainer);
            var _content=$(ContentHTML).attr("id", this.gridOption.el);


            _layOut.append(_head);
            _layOut.append(_row);
            _layOut.append(_content);


            $(this.el).html(_layOut);

            //부서 필터 리스트 목록 생성
            var dept = Code.getCodes(Code.DEPARTMENT);

            //일반 사용자에게는 부서 선택필터에 자신의 부서만 들어가도록 처리함.
            if (SessionModel.get("user").admin == 9) { //부서 선택 필터에 전체 부서가 들어감.
                $(this.el).find("#rdCombo").append("<option>"+"전체"+"</option>");
                for(var i=0; i < dept.length; i++){
                    if(dept[i].name != "임원" && dept[i].name != "무소속")
                        $(this.el).find("#rdCombo").append("<option>"+dept[i].name+"</option>");
                }
                // 관리자로 로그인 하면 전체 부서를 볼수 있도록 보완.
                $(this.el).find("#rdCombo").val("전체");

            } else {
                $(this.el).find("#rdCombo").append("<option>"+SessionModel.getUserInfo().dept_name+"</option>");
                $(this.el).find("#rdCombo").val(SessionModel.getUserInfo().dept_name);
            }

            var _gridSchema=Schemas.getSchema('grid');
            this.grid= new Grid(_gridSchema.getDefault(this.gridOption));
            this.grid.render();
            this.selectUsageList();

            //Excel 출력 - 관리자에게만 제공
            if (SessionModel.get("user").admin == 9) {
                var _gridSchema = Schemas.getSchema('grid');
                this.gridExcel = new Grid(_gridSchema.getDefault(this.gridExcel));
                this.gridExcel.render();
                this.makeExportData();
            }

            return this;
        },
        onClickSearchBtn: function(evt) {
            this.selectUsageList();
        },

        makeExportData: function() {//Excel 출력
            let that = this;

            Dialog.loading({
                action:function(){
                    let dfd = new $.Deferred();
                    that.excelExportCollection.fetch({
                        data : {user : 'Excel'},
                        success: function(){
                            dfd.resolve();
                        }, error: function(){
                            dfd.reject();
                        }
                    });
                    return dfd.promise();
                },

                actionCallBack:function(res){
                    that.gridExcel.render();
                },
                errorCallBack:function(response){
                    Dialog.error( i18nCommon.USAGE_LIST.MSG.LOADING_FAIL );
                },
            });
        },

        selectUsageList: function() {
            var _this = this;
            let deptName = $(this.el).find("#rdCombo").val();
            let default_dept = Code.getCodes(Code.DEPARTMENT);
            let deptCode = "전체";
            if (deptName != "전체") {
                for (let i=0; i < default_dept.length; i++) {
                    if(default_dept[i].name == deptName) {
                        deptCode = default_dept[i].code;
                    }
                };
            }

            Dialog.loading({
                action:function(){
                    let dfd = new $.Deferred();
                    let privilege = SessionModel.get("user").admin;
                    let user = SessionModel.get("user").id;

                    _this.officeItemUsageCollection.fetch({
                        data: {dept : deptCode, admin : privilege, user : user},
                        success: function(){
                            dfd.resolve();
                        }, error: function(){
                            dfd.reject();
                        }
                    });
                    return dfd.promise();
                },

                actionCallBack:function(res){
                    _this.grid.render();
                },
                errorCallBack:function(response){
                    Dialog.error(i18nCommon.USAGE_LIST.MSG.GET_DATA_FAIL);
                },
            });
        },
        onClickUsageHistoryPopup: function(evt) {
            evt.stopPropagation();
            let data = JSON.parse( $(evt.currentTarget).attr('data') );

            let usageHistoryPopupView = new UsageHistoryListPopup(data.id);
            Dialog.show({
                title: "("+data.id+") 이력",
                content: usageHistoryPopupView,
                size: 'size-wide',
                buttons: [{
                    label : "닫기",
                    action : function(dialog){
                        dialog.close();
                    }
                }]
            });
        },

        onClickListDetailUsageBtn : function(evt){
            evt.stopPropagation();
            let $currentTarget = $(evt.currentTarget.parentElement.parentElement.parentElement);
            $('.selected').removeClass('selected');
            $currentTarget.addClass('selected');
            let data=this.grid.getSelectItem();

            let usageDetailPopupView = new UsageDetailListPopup(data);
            //부서에게 제품이 할당된 경우
            let titleName = (data.name == "") ? _getDeptName(data.dept) : data.name;

            Dialog.show({
                title: "상세정보 ("+titleName+")",
                content: usageDetailPopupView,
                size: 'size-wide',
                buttons: [{
                    label : "닫기",
                    action : function(dialog){
                        dialog.close();
                    }
                }]
            });

        },

        onClickSave: function(grid) {
            grid.saveExcel("비품할당현황");
        }
    });
    return officeItemUsageView;
});
