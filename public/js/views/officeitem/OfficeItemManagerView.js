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
    'code',
    'models/sm/SessionModel',
    'text!templates/default/head.html',
    'text!templates/default/content.html',
    'text!templates/layout/default.html',
    'text!templates/default/row.html',
    'text!templates/default/rowbuttoncontainer.html',
    'text!templates/default/rowbutton.html',
    'text!templates/default/rowcombo.html',
    'collection/officeitem/OfficeItemCollection',
    'views/officeitem/popup/AddOfficeItemView',
    'views/officeitem/popup/EditOfficeItemView',
    'views/officeitem/popup/DetailOfficeItemView',
    'views/officeitem/popup/AddOfficeItemHistoryView',
    'models/officeitem/OfficeItemModel',
    'collection/common/CodeCollection',
    'text!templates/officeitem/searchFormTemplate.html',
    'views/officeitem/popup/UsageOfficeItemHistoryPopupView',
  ], function($, _, Backbone,Util, BaseView, Grid, LodingButton, Schemas, i18Common, Dialog, Code, SessionModel,
              HeadHTML, ContentHTML, LayoutHTML, 
              RowHTML, RowButtonContainerHTML,RowButtonHTML, RowComboHTML, 
              OfficeItemCollection, AddOfficeItemView, EditOfficeItemView, DetailOfficeItemView,
              AddOfficeItemHistoryView,
              OfficeItemModel,CodeCollection,searchFormTemplate,UsageHistoryListPopup){

        var officeitemListCount=0;
        var _currentUseFilter=0;
        var _currentFilter=0;

        function _clickOfficeItemDetailBtn(view, selectItem ){
            if ( Util.isNull(selectItem) ) {
                Dialog.warning("비품을 선택 하여 주시기 바랍니다.");
                return;
            }
            
            var detailOfficeItemView= new DetailOfficeItemView(selectItem);
            Dialog.show({
                title:i18Common.OFFICEITEM.SUB_TITLE.DETAIL_INFO +" ["+selectItem.serial_yes+"]",  
                content:detailOfficeItemView, 
                buttons:[{
                    label: i18Common.DIALOG.BUTTON.CLOSE,
                    action: function(dialogRef){
                        dialogRef.close();
                    }
                }]
                
            });
        } 

        function _clickOfficeItemHistoryAddBtn(view, selectItem ){
            if ( Util.isNull(selectItem) ) {
                Dialog.warning("비품을 선택 하여 주시기 바랍니다.");
                return;
            }
            
            var addOfficeItemHistoryView= new AddOfficeItemHistoryView(selectItem);
            Dialog.show({
                title:i18Common.OFFICEITEM.HISTORY.TITLE.ADD, 
                content:addOfficeItemHistoryView, 
                //size: 'size-wide',
                buttons:[{
                    label: i18Common.OFFICEITEM.HISTORY.TITLE.ADD,
                    cssClass: Dialog.CssClass.SUCCESS,
                    action: function(dialogRef){// 버튼 클릭 이벤트
                        var _btn=this;
                        var beforEvent,affterEvent;
                        
                        beforEvent=function(){
                            $(_btn).data('loading-text',"<div class='spinIcon'>"+i18Common.OFFICEITEM.HISTORY.TITLE.ADD+"</div>");
                            //$(_btn).button('loading');
                        };
                        affterEvent=function(){
                            //$(_btn).button('reset');
                        };
                        LodingButton.createSpin($(_btn).find(".spinIcon")[0]);
                        addOfficeItemHistoryView.submitAdd(beforEvent, affterEvent).done(function(data){
                            dialogRef.close();
                            Dialog.show(i18Common.OFFICEITEM.HISTORY.SUCCESS.ADD);
                        });//실패 따로 처리안함 add화면에서 처리.
                    }
                }, {
                    label: i18Common.DIALOG.BUTTON.CLOSE,
                    action: function(dialogRef){
                        dialogRef.close();
                    }
                }]                
            });
        } 

      var OfficeItemListView = BaseView.extend({
        el:".main-container",
        initialize:function(){
            this.officeitemCollection= new OfficeItemCollection();
            this.officeItemCodes = Code.getCodes(Code.OFFICEITEM);
            var _id="officeItemList_"+(officeitemListCount++);
            this.option = {
                el:_id+"_content",
                column:[
                    { "title" : i18Common.OFFICEITEM.CODE.SERIAL_YES, data:"serial_yes"},
                    { "title" : i18Common.OFFICEITEM.CODE.MODEL_NO, data:"model_no"},
                    { "title" : i18Common.OFFICEITEM.CODE.SERIAL_FACTORY, data:"serial_factory"},
                    { "title" : i18Common.OFFICEITEM.CODE.VENDOR, data:"vendor",visible:false, subVisible:false},   
                    { "title" : i18Common.OFFICEITEM.CODE.CATEGORY_CODE, data:"category_code",visible:false, subVisible:false},
                    { "title" : i18Common.OFFICEITEM.CODE.CATEGORY_TYPE, data:"category_type",visible:false, subVisible:false},
                    { "title" : i18Common.OFFICEITEM.CODE.CATEGORY_NAME, data:"category_name",visible:false, subVisible:false},
                    { "title" : i18Common.OFFICEITEM.CODE.CATEGORY_INDEX, data:"category_index", visible:false, subVisible:false},
                    { "title" : i18Common.OFFICEITEM.CODE.PRICE, data:"price", visible:false, subVisible:false},
                    { "title" : i18Common.OFFICEITEM.CODE.SURTAX, data:"surtax", visible:false, subVisible:false},
                    { "title" : i18Common.OFFICEITEM.CODE.PRICE_BUY, data:"price_buy", visible:false, subVisible:false},
                    /*{ "title" : i18Common.OFFICEITEM.CODE.PRICE_BUY, data:"price_buy", class:"dt-body-right" ,"render":function(data, type, row)
                    {
                        if(row.price_buy != null && row.price_buy != ""){
                            var _price = row.price_buy;
                            return Util.numberWithComma(_price);
                        }
                        return "";
                    }},*/
                    { "title" : i18Common.OFFICEITEM.CODE.BUY_DATE, data:"buy_date"},
                    { "title" : i18Common.OFFICEITEM.CODE.DISPOSAL_ACCOUNT, data:"disposal_account", visible:false, subVisible:false},    
                    { "title" : i18Common.OFFICEITEM.CODE.DISPOSAL_DATE, data:"disposal_date"},   
                    { "title" : i18Common.OFFICEITEM.CODE.EXPIRATION_DATE, data:"expiration_date"},    
                    { "title" : i18Common.OFFICEITEM.CODE.USE_DEPT, data:"use_dept", visible:false, subVisible:false},
                    { "title" : i18Common.OFFICEITEM.CODE.USE_USER, data:"use_user", visible:false, subVisible:false},
                    { "title" : i18Common.OFFICEITEM.CODE.USE_DEPT_NAME, data:"use_dept_name"},
                    { "title" : i18Common.OFFICEITEM.CODE.USE_USER_NAME, data:"use_user_name"},
                    { "title" : i18Common.OFFICEITEM.CODE.LOCATION, data:"location"},
                    { "title" : i18Common.OFFICEITEM.CODE.STATE, data:"state"},
                    { "title" : i18Common.OFFICEITEM.CODE.MEMO, data:"memo", visible:false, subVisible:false},
                    { "title" : "이력", data : "history", "render": function(data, type, row){
                        var btnState = ((row.state == "폐기")?'btn-defalut-ex':'btn-default');
                        var dataVal = "<div style='text-align: center;'>";
                        dataVal +=  "<button class='btn list-historyList-btn "+btnState+" btn-sm' id='btnHistoryList"+row.doc_num+"' data-toggle='tooltip' title='이력 조회' ><span class='glyphicon glyphicon-th-list' aria-hidden='true'></span></button>";
                        dataVal +=  "<button class='btn list-HistoryAdd-btn "+btnState+" btn-sm' id='btnHistoryAdd"+row.doc_num+"' data-toggle='tooltip' title='이력 등록'><span class='glyphicon glyphicon-edit' aria-hidden='true'></span></button>";
                        dataVal +=  "<button class='btn list-detailComm-btn "+btnState+" btn-sm' id='btnDetail"+row.doc_num+"' data-toggle='tooltip' title='상세 조회'><span class='glyphicon glyphicon-list-alt' aria-hidden='true'></span></button>";
                        dataVal +=  "</div>";
                       return dataVal;
                      }}
                  ],
                dataschema:["serial_yes","serial_factory","vendor","model_no","category_code","category_index","price","surtax","price_buy","buy_date",
                  "disposal_date","disposal_account","expiration_date","use_dept","use_user","location","state","memo"],
                collection:this.officeitemCollection,
                detail:true,
                view:this,
                fetch: false,
                order:[[1, "asc"]],
                rowCallback:function(row, data){

                    if(data.expiration_date != "" && !_.isNull(data.expiration_date))
                    {
                        var e_date = new Date(data.expiration_date).getTime();
                        var now_date = new Date().getTime();

                        if (e_date <= now_date){   
                            $(row).addClass('expiration');  
                        } 
                    }  

                    $(row).find('[data-toggle="tooltip"]').tooltip({
                        placement : 'top',
                        container: 'body',
                    });
                }
              };
              this.gridExcel = {
                el:"ExportDetailList_content",
                id:"ExportDetailListGrid",
                column:[
                    { "title" : i18Common.OFFICEITEM.CODE.SERIAL_YES, data:"serial_yes"},
                    { "title" : i18Common.OFFICEITEM.CODE.MODEL_NO, data:"model_no"},
                    { "title" : i18Common.OFFICEITEM.CODE.SERIAL_FACTORY, data:"serial_factory"},
                    { "title" : i18Common.OFFICEITEM.CODE.VENDOR, data:"vendor"},
                    { "title" : i18Common.OFFICEITEM.CODE.CATEGORY_CODE, data:"category_code"},
                    { "title" : i18Common.OFFICEITEM.CODE.CATEGORY_TYPE, data:"category_type"},
                    { "title" : i18Common.OFFICEITEM.CODE.CATEGORY_NAME, data:"category_name"},
                    { "title" : i18Common.OFFICEITEM.CODE.CATEGORY_INDEX, data:"category_index"},
                    { "title" : i18Common.OFFICEITEM.CODE.PRICE, data:"price", class:"dt-body-right" ,"render":function(data, type, row)
                    {
                        if(row.price != null && row.price != ""){
                            var _price = row.price;
                            return Util.numberWithComma(_price);
                        }
                        return "";
                    }},
                    { "title" : i18Common.OFFICEITEM.CODE.SURTAX, data:"surtax", class:"dt-body-right" ,"render":function(data, type, row)
                    {
                        if(row.surtax != null && row.surtax != ""){
                            var _price = row.surtax;
                            return Util.numberWithComma(_price);
                        }
                        return "";
                    }},
                    { "title" : i18Common.OFFICEITEM.CODE.PRICE_BUY, data:"price_buy", class:"dt-body-right" ,"render":function(data, type, row)
                    {
                        if(row.price_buy != null && row.price_buy != ""){
                            var _price = row.price_buy;
                            return Util.numberWithComma(_price);
                        }
                        return "";
                    }},
                    { "title" : i18Common.OFFICEITEM.CODE.BUY_DATE, data:"buy_date"},
                    { "title" : i18Common.OFFICEITEM.CODE.DISPOSAL_ACCOUNT, data:"disposal_account"},
                    { "title" : i18Common.OFFICEITEM.CODE.DISPOSAL_DATE, data:"disposal_date"},
                    { "title" : i18Common.OFFICEITEM.CODE.EXPIRATION_DATE, data:"expiration_date"},    
                    { "title" : i18Common.OFFICEITEM.CODE.USE_DEPT, data:"use_dept"},
                    { "title" : i18Common.OFFICEITEM.CODE.USE_USER, data:"use_user"},
                    { "title" : i18Common.OFFICEITEM.CODE.USE_DEPT_NAME, data:"use_dept_name"},
                    { "title" : i18Common.OFFICEITEM.CODE.USE_USER_NAME, data:"use_user_name"},
                    { "title" : i18Common.OFFICEITEM.CODE.LOCATION, data:"location"},
                    { "title" : i18Common.OFFICEITEM.CODE.STATE, data:"state"},
                    { "title" : i18Common.OFFICEITEM.CODE.MEMO, data:"memo"},
                  ],
                detail: true,
                dataschema:["serial_yes","serial_factory","vendor","model_no","category_code","category_index","price","surtax","price_buy","buy_date",
                  "disposal_date","disposal_account","expiration_date","use_dept","use_user","location","state","memo"],
                collection:this.officeitemCollection,
                detail: true,
                fetch: false,
                order: [[1, "asc"]]
            };

            },
            events : {
                'click .list-historyList-btn' : 'onClickOfficeItemHistoryBtn',
                'click .list-HistoryAdd-btn' : 'onClickOfficeItemHistoryAddBtn',
                'click .list-detailComm-btn' : 'onClickOfficeItemDetailBtn',
                'click #officeItemSearchBtn' : 'onClickSearchBtn',
                "change #officeCodeComboType" : "setOfficeItemNameData",
            },
            over:function(event){                
            },
            leave:function(){
            },
            onClickSave: function(grid) {
                grid.saveExcel(i18Common.OFFICEITEM.SUB_TITLE.OFFICEITEM_LIST);
            },
            onClickOfficeItemDetailBtn : function(evt){            
                evt.stopPropagation();
                var $currentTarget = $(evt.currentTarget.parentElement.parentElement.parentElement);
                $('.selected').removeClass('selected');
                $currentTarget.addClass('selected');
                
                var selectData=this.grid.getSelectItem();
                _clickOfficeItemDetailBtn(this, selectData);
            },
            onClickOfficeItemHistoryBtn : function(evt){            
                evt.stopPropagation();

                var selectData=this.grid.getSelectItem();    
                var usageHistoryPopupView = new UsageHistoryListPopup(selectData.serial_yes);
                Dialog.show({
                    title: "("+selectData.serial_yes+") 이력",
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
            onClickOfficeItemHistoryAddBtn : function(evt){            
                evt.stopPropagation();
                var $currentTarget = $(evt.currentTarget.parentElement.parentElement.parentElement);
                $('.selected').removeClass('selected');
                $currentTarget.addClass('selected');
                
                var selectData=this.grid.getSelectItem();
                _clickOfficeItemHistoryAddBtn(this, selectData);
    
            },
            onClickSearchBtn: function(evt) {
                this.selectOfficeItem();
            },
            setOfficeItemNameData : function(){
                var officeItemNameList = [{key:"",value:"전체"}];
                var type = $(this.el).find("#officeCodeComboType").val();
                
                if (type != "전체") {
                    var codes = this.officeItemCodes;
                    for(var index in codes){
                        if(codes[index].type == type)
                            officeItemNameList.push({key:codes[index].code, value:codes[index].name});
                    }
                }
                //기기분류 Set
                $(this.el).find("#officeCodeCombo").empty();
                for(var index in officeItemNameList){
                    $(this.el).find("#officeCodeCombo").append("<option value="+officeItemNameList[index].key+">" + officeItemNameList[index].value +"</option>");
                }
            },

            afterRender: function() {
                var _this = this;                
            },
            render:function(){
                var _this = this; 
                var _headSchema=Schemas.getSchema('headTemp');
                var _headTemp=_.template(HeadHTML);
                var _layOut=$(LayoutHTML);
                //Head 
                var _head=$(_headTemp(_headSchema.getDefault({title:i18Common.OFFICEITEM.TITLE.OFFICEITEM_MANAGER, subTitle:i18Common.OFFICEITEM.SUB_TITLE.OFFICEITEM_LIST})));
                 _head.addClass("no-margin");
                 _head.addClass("relative-layout");
                            
                var _buttons=["search"];    
                var _usefilterText=[i18Common.CODE.ALL
                                    ,i18Common.OFFICEITEM.USE_STATE.USE
                                    ,i18Common.OFFICEITEM.USE_STATE.NOT_USER];
                _buttons.push({
                    type:"custom",
                    name:"filter",
                    tooltip:i18Common.CODE.ALL
                            +"/"+i18Common.OFFICEITEM.USE_STATE.USE
                            +"/"+i18Common.OFFICEITEM.USE_STATE.NOT_USER,
                    filterBtnText:_usefilterText,
                    click:function(_grid, _button){
                    var filters=[
                            function(){
                                return true;
                            },
                            function(data){
                                var _useDept=data[16];
                                var _useUser=data[17];                               
                                return (_useDept == "" && _useUser == "" )?false:true;                               
                    
                            },
                            function(data){
                                var _useDept=data[16];
                                var _useUser=data[17];
                                var _levDate=data[21];
                                return (_useDept == "" && _useUser == "" && _levDate != i18Common.OFFICEITEM.STATE.DISUSE )?true:false;
                            },    
                    ];
                    
                    if (_currentUseFilter==2){
                        _currentUseFilter=0;
                    } else {
                         _currentUseFilter++;
                    }
                    
                    _button.html(_usefilterText[_currentUseFilter]);
                    _grid.setBtnText(_button, _usefilterText[_currentUseFilter]);
                    _grid.filtering(function(data){
                        var fn=filters[_currentUseFilter];
                        return fn(data);
                    }, "useStateType");
                    }
                });            
                /*var _filterText=[i18Common.CODE.ALL
                                ,i18Common.OFFICEITEM.STATE.NORMAL
                                ,i18Common.OFFICEITEM.STATE.BREAK
                                ,i18Common.OFFICEITEM.STATE.DISUSE
                                ,i18Common.OFFICEITEM.STATE.STANDBY];
                _buttons.push({
                    type:"custom",
                    name:"filter",
                    tooltip:i18Common.OFFICEITEM.CODE.STATE,
                    filterBtnText:_filterText,
                    click:function(_grid, _button){
                       var filters=[
                            function(){
                                return true;
                            },
                            function(data){
                                var _levDate=data[21];
                                return (_levDate==i18Common.OFFICEITEM.STATE.NORMAL)
                            },
                            function(data){
                                var _levDate=data[21];                                
                                return (_levDate==i18Common.OFFICEITEM.STATE.BREAK)
                            },                            
                            function(data){
                                var _levDate=data[21];
                                return (_levDate==i18Common.OFFICEITEM.STATE.DISUSE)
                            },
                            function(data){
                                var _levDate=data[21];
                                return (_levDate==i18Common.OFFICEITEM.STATE.STANDBY)
                            }
                       ];
                       
                       if (_currentFilter==4){
                            _currentFilter=0;
                       } else {
                            _currentFilter++;
                       }
                       
                       _button.html(_filterText[_currentFilter]);
                       _grid.setBtnText(_button, _filterText[_currentFilter]);
                       _grid.filtering(function(data){
                           var fn=filters[_currentFilter];
                           return fn(data);
                       }, "stateType");
                    }
                });*/
                
                if (this.actionAuth.add){
                    _buttons.push({//User Add
                        type:"custom",
                        name:"add",
                        tooltip:i18Common.OFFICEITEM.TITLE.ADD,
                       click:function(){
                        var addOfficeItemView= new AddOfficeItemView();
                        Dialog.show({
                            title:i18Common.OFFICEITEM.TITLE.ADD, 
                            content:addOfficeItemView, 
                            buttons:[{
                                label: i18Common.OFFICEITEM.TITLE.ADD,
                                cssClass: Dialog.CssClass.SUCCESS,
                                action: function(dialogRef){// 버튼 클릭 이벤트
                                    var _btn=this;
                                    var beforEvent,affterEvent;
                                    
                                    beforEvent=function(){
                                        $(_btn).data('loading-text',"<div class='spinIcon'>"+i18Common.OFFICEITEM.TITLE.ADD +"</div>");
                                        //$(_btn).button('loading');
                                    };
                                    affterEvent=function(){
                                       // $(_btn).button('reset');
                                    };
                                    LodingButton.createSpin($(_btn).find(".spinIcon")[0]);
                            
                                    addOfficeItemView.submitAdd(beforEvent, affterEvent).done(function(data){
                                        grid.addRow(data);
                                        dialogRef.close();
                                        Dialog.show(i18Common.OFFICEITEM.SUCCESS.ADD);
                                    });//실패 따로 처리안함 add화면에서 처리.
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
                }
                
               if (this.actionAuth.edit){
                    _buttons.push({  //Edit
                        type:"custom",
                        name:"edit",
                        tooltip:i18Common.OFFICEITEM.TITLE.EDIT, 
                        click:function(_grid){
                            var selectItem=_grid.getSelectItem();
                            if (_.isUndefined(selectItem)){
                                Dialog.warning(i18Common.GRID.MSG.NOT_SELECT_ROW);
                            } else {
                                var editOfficeItemView= new EditOfficeItemView(selectItem);
                                Dialog.show({
                                    title:i18Common.OFFICEITEM.TITLE.EDIT+" ["+selectItem.serial_yes+"]", 
                                    content:editOfficeItemView, 
                                    buttons:[{
                                        label: i18Common.OFFICEITEM.TITLE.EDIT,
                                        cssClass: Dialog.CssClass.SUCCESS,
                                        action: function(dialogRef){// 버튼 클릭 이벤트
                                            editOfficeItemView.submitSave().done(function(data){
                                                grid.updateRow(data);
                                                dialogRef.close();
                                                Dialog.show(i18Common.OFFICEITEM.SUCCESS.SAVE);
                                            });//실패 따로 처리안함 add화면에서 처리.
                                        }
                                    }, {
                                        label: i18Common.DIALOG.BUTTON.CLOSE,
                                        action: function(dialogRef){
                                            dialogRef.close();
                                        }
                                    }]
                                    
                                });
                            }
                        }
                    });
               }    
                
               if (this.actionAuth.remove){
                    _buttons.push({//User Remove
                        type:"custom",
                        name:"remove",
                        tooltip:i18Common.OFFICEITEM.TITLE.REMOVE, //" 삭제",
                        click:function(_grid){
                            var selectItem=_grid.getSelectItem();
                            if (_.isUndefined(selectItem)){
                                Dialog.warning(i18Common.GRID.MSG.NOT_SELECT_ROW);
                            } else {
                                selectItem._id="-1";
                                Dialog.confirm({
                                    msg:i18Common.OFFICEITEM.CONFIRM.REMOVE, 
                                    action:function(){
                                    var officeitemModel=new OfficeItemModel(selectItem);
                                    return officeitemModel.remove();
                                    },
                                    actionCallBack:function(res){//response schema
                                        if (res.status){
                                            _grid.removeRow(selectItem);
                                            Dialog.show(i18Common.OFFICEITEM.SUCCESS.REMOVE);
                                        }
                                    },
                                    errorCallBack:function(){
                                        //dd.close();
                                    }
                                });
                            }
                        
                        }
                    });
                }
                if (this.actionAuth.edit){
                    _buttons.push({
                        type: "custom",
                        name: "save",
                        tooltip: "저장하기",
                        click: function(_grid) {
                             var ___grid = _grid;
                            _this.onClickSave(_this.gridExcel);                            
                        }
                    });
                }
                //
                //Refresh
                //_buttons.push("refresh");
                this.option.buttons=_buttons;
                this.option.fetchParam = {
                    success : function(){
                        grid._draw();    
                    }
                };

                var _content=$(ContentHTML).attr("id", this.option.el);      
               
                //combo
                var _row=$(RowHTML); 
                
                var _combo = $(_.template(searchFormTemplate)({                    
                        obj : { 
                            typeid : "officeCodeComboType",
                            typelabel : i18Common.OFFICEITEM.HISTORY.CODE.CATEGORY_TYPE,
                            id : "officeCodeCombo", 
                            label : i18Common.OFFICEITEM.HISTORY.CODE.CATEGORY_NAME,
                            btnid :"officeItemSearchBtn",
                            btnlabel : i18Common.OFFICEITEM.LIST.SEARCH_BTN,
                        }
                    })
                );   

                _row.append(_combo);  
                       
                _layOut.append(_head);   
                _layOut.append(_row);            
                _layOut.append(_content);
                $(this.el).html(_layOut);


                //기기분류 Set             
                this.categoryType = [
                    {key:i18Common.OFFICEITEM.CATEGORY.TYPE.CS,value:i18Common.OFFICEITEM.CATEGORY.TYPE.CS},
                    {key:i18Common.OFFICEITEM.CATEGORY.TYPE.OS,value:i18Common.OFFICEITEM.CATEGORY.TYPE.OS}
                ];
                
                var category = this.categoryType;
                for(var index in category){
                    $(this.el).find("#officeCodeComboType").append("<option>" + category[index].value +"</option>");
                }
    
                //grid 
                var _gridSchema=Schemas.getSchema('grid');
                var grid= new Grid(_gridSchema.getDefault(this.option));
                this.grid = grid;
                this.grid.render();

                //Excel 출력
                var _gridSchemaExcel=Schemas.getSchema('grid');
                this.gridExcel = new Grid(_gridSchemaExcel.getDefault(this.gridExcel));
                this.gridExcel.render();
                
                //기기이름 Set
                this.setOfficeItemNameData();
                this.selectOfficeItem();
                return this;
            },

            selectOfficeItem: function() {
                var category_type = $(this.el).find("#officeCodeComboType").val();
                var data = {
                    category_type : ((category_type == "전체")?"":category_type),
                    category_code : $(this.el).find("#officeCodeCombo").val()
                 };     
                 
                var _this = this;
                Dialog.loading({
                    action:function(){
                        var dfd = new $.Deferred();
                        _this.officeitemCollection.fetch({ 
                             data: data,
                             success: function(){
                                dfd.resolve();
                            }, error: function(){
                                dfd.reject();
                            }
                         });
                         return dfd.promise();
                    },
                    
                    actionCallBack:function(res){//response schema
                        if ( category_type == i18Common.OFFICEITEM.CATEGORY.TYPE.CS ) {
                            // 전산

                            // 일련번호
                            _this.grid.columns[3].visible = true;
                            // 사용만료일
                            _this.grid.columns[15].visible = true;
                            // 비품종류
                            _this.grid.columns[7].visible = false;
                        }else{
                            // 사무

                            // 일련번호
                            _this.grid.columns[3].visible = false;
                            // 사용만료일
                            _this.grid.columns[15].visible = false;
                            // 비품종류
                            _this.grid.columns[7].visible = true;
                        }
                        
                        _this.grid.render();
                        _this.gridExcel.render();
                    },
                    errorCallBack:function(response){
                        Dialog.error(i18Common.OFFICEITEM.LIST.GET_DATA_FAIL);
                    },
                });
            }
      });
      return OfficeItemListView;
  });