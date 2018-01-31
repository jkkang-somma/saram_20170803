define([
	'jquery',
	'underscore',
	'backbone',
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
	'models/officeitem/IpAssignedManagerModel',
	'collection/officeitem/IpAssignedManagerCollection',
	'views/officeitem/popup/AddIpView',
	'views/officeitem/popup/EditIpView',
	'code'
	], function($, _, Backbone, BaseView, Grid, LodingButton, Schemas, i18nCommon, Dialog, SessionModel, 
		HeadHTML, ContentHTML, LayoutHTML, IpAssignedManagerModel, IpAssignedManagerCollection, AddIpView, EditIpView, Code){
		
		var _currentUseFilter=0;
		var IpAssignedManagerView = BaseView.extend({
		el:".main-container",
		initialize:function(){
			this.IpAssignedManagerCollection = new IpAssignedManagerCollection();
			this.Option = {
					el:"IpSearch_content",
					column:[
							{ data : "ip_hidden",		"title" : i18nCommon.IPASSIGNED_MANAGER_LIST.GRID_COL_NAME.IP, 
								render: function(data, type, row){
									var ipaddressData = row.ip;
									var i, item;
									var m = ipaddressData.split("."), x = "";
									// IPV4
									for(i = 0; i < m.length; i++) {
										item = m[i];
										if(item.length == 1) {
											if(i != 0) {
												x += ".  " + item;
											}
											else {
												x += item;
											}
										}
										else if(item.length == 2) {
											if(i != 0) {
												x += ". " + item;
											}
											else {
												x += item;
											}
										}
										else if(item.length == 3) {
											if(i != 0) {
												x += "." + item;
											}
											else {
												x += item;
											}
										}
										else {
											x += item;
										}
									}
									return x;
								}
							},
							{ data : "use_user",	"title" : i18nCommon.IPASSIGNED_MANAGER_LIST.GRID_COL_NAME.USE_USER },
							{ data : "memo", 		"title" : i18nCommon.IPASSIGNED_MANAGER_LIST.GRID_COL_NAME.MEMO},
							{ data : "ip",			"title" : i18nCommon.IPASSIGNED_MANAGER_LIST.GRID_COL_NAME.ip, visible: false, subVisible:false, 
								render: function(data, type, row){
									return row.ip;
								}
							},
					],
					collection:this.IpAssignedManagerCollection,
					//dataschema:["ip", "use_dept", "use_user", "memo"],
					dataschema:["ip", "use_user", "memo"],
					detail: true,
					view:this,
					//fetch: false,
					order : [[1, "asc"]]
			};
		},
		events: {

		},
		render:function(){
			var _headSchema=Schemas.getSchema('headTemp');
			var _headTemp=_.template(HeadHTML);
			var _layOut=$(LayoutHTML);

			//Head 
			var _head=$(_headTemp(_headSchema.getDefault({
									title:i18nCommon.IPASSIGNED_MANAGER_LIST.TITLE, 
									subTitle:i18nCommon.IPASSIGNED_MANAGER_LIST.SUB_TITLE
									})
								)
						);
			_head.addClass("no-margin");
			_head.addClass("relative-layout");

			//grid button add;
			var _buttons=["search"];
			var _usefilterText=[i18nCommon.CODE.ALL
                                    ,i18nCommon.OFFICEITEM.USE_STATE.USE
                                    ,i18nCommon.OFFICEITEM.USE_STATE.NOT_USER];
             _buttons.push({
                type:"custom",
                name:"filter",
                tooltip:i18nCommon.CODE.ALL
                        +"/"+i18nCommon.OFFICEITEM.USE_STATE.USE
                        +"/"+i18nCommon.OFFICEITEM.USE_STATE.NOT_USER,
                filterBtnText:_usefilterText,
                click:function(_grid, _button){
                var filters=[
                        function(){
                            return true;
                        },
                        function(data){
                            var _use_user=data[2];                                           
                            return (_use_user == "")?false:true;                               
                    
                        },
                        function(data){
							var _use_user=data[2];                                           
                            return (_use_user == "")?true:false;  
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
                    return fn(data); }, "useStateType");
                }
			});   
			
			if (this.actionAuth.add){
				_buttons.push({//IP Add
					type:"custom",
					name:"add",
					tooltip:i18nCommon.IPTOOLTIP.IP.ADD,//"IP 등록",
					click:function(_grid){
						var addIpView= new AddIpView();
						Dialog.show({
							title:i18nCommon.IPTOOLTIP.IP.ADD, 
							content:addIpView, 
							buttons:[{
								label: i18nCommon.DIALOG.BUTTON.ADD,
								cssClass: Dialog.CssClass.SUCCESS,
								action: function(dialogRef){// 버튼 클릭 이벤트
									var _btn=this;
									var beforEvent,affterEvent;

									beforEvent=function(){
										$(_btn).data('loading-text',"<div class='spinIcon'>"+i18nCommon.DIALOG.BUTTON.ADD +"</div>");
										//$("#loginbtn").button("loading");
										//$(_btn).button('loading');
									};
									affterEvent=function(){
										//$("#loginbtn").button("reset");
										//$(_btn).button('reset');
									};
									LodingButton.createSpin($(_btn).find(".spinIcon")[0]);
									addIpView.submitAdd(beforEvent, affterEvent).done(function(data){
										_grid.addRow(data);
										dialogRef.close();
										Dialog.show(i18nCommon.IPCONFIRM.IP.SUCCESS_COMPLETE);
									});//실패 따로 처리안함 add화면에서 처리.
								}
							}, {
								label: i18nCommon.DIALOG.BUTTON.CLOSE,
								action: function(dialogRef){
									dialogRef.close();
								}
							}]
						});
					}
				});
			}
			if (this.actionAuth.edit){
				_buttons.push({//User edit
					type:"custom",
					name:"edit",
					tooltip:i18nCommon.IPTOOLTIP.IP.EDIT, //"IP 수정",
					click:function(_grid){
						var selectItem=_grid.getSelectItem();
						if (_.isUndefined(selectItem)){
							Dialog.warning(i18nCommon.GRID.MSG.NOT_SELECT_ROW);
						}
						else {
							var editIpView= new EditIpView(selectItem);
							Dialog.show({
								title:i18nCommon.IPTOOLTIP.IP.EDIT, 
								content:editIpView, 
								buttons:[{
									label: i18nCommon.DIALOG.BUTTON.SAVE,
									cssClass: Dialog.CssClass.SUCCESS,
									action: function(dialogRef){// 버튼 클릭 이벤트
										editIpView.submitSave().done(function(data){
											_grid.updateRow(data);
											dialogRef.close();
											Dialog.show(i18nCommon.IPCONFIRM.IP.UPDATE_COMPLETE);
										});//실패 따로 처리안함 add화면에서 처리.
					 				}
								},{
									label: i18nCommon.DIALOG.BUTTON.CLOSE,
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
					tooltip:i18nCommon.IPTOOLTIP.IP.REMOVE, //"IP 삭제",
					click:function(_grid){
						var selectItem=_grid.getSelectItem();
						if (_.isUndefined(selectItem)){
							Dialog.warning(i18nCommon.GRID.MSG.NOT_SELECT_ROW);
						}
						else {
							selectItem._id="-1";
							Dialog.confirm({
								msg:i18nCommon.IPCONFIRM.IP.REMOVE,
								action:function(){
							 		this.IpAssignedManagerModel = new IpAssignedManagerModel(selectItem);
									return this.IpAssignedManagerModel.remove();
								},
								actionCallBack:function(res){//response schema
									if (res.status){
										_grid.removeRow(selectItem);
										Dialog.show(i18nCommon.IPCONFIRM.IP.REMOVE_COMPLETE);
									}
								},
								errorCallBack:function(){
									//dd.close();
								}
							});
						}
					}
				});
			};
			if (this.actionAuth.save) {
				_buttons.push({ // detail
					type: "custom",
					name: "save",
					tooltip: "저장하기",
					click: function(_grid) {
						var saveGrid = _grid;
						saveGrid.columns = [{"title" : ""},
										{"title" : "IP주소"},
										{"title" : "사용자"},
										{"title" : "비고"},
										];
						saveGrid.saveExcel("IP주소");
					}
				});
			};
			_buttons.push("refresh");
			this.Option.buttons=_buttons;
			this.Option.fetchParam = {
			 	success : function(){
					grid._draw();
			 	}
			};
			//grid 
			var _gridSchema=Schemas.getSchema('grid');
			var grid= new Grid(_gridSchema.getDefault(this.Option));
			var _content=$(ContentHTML).attr("id", this.Option.el);

			_layOut.append(_head);
			_layOut.append(_content);
			$(this.el).html(_layOut);

			grid.render();
			//this.selectIPSearch();
			return this;
		},
		selectIPSearch: function() {
			var _this = this;
			Dialog.loading({
				action:function(){
					var dfd = new $.Deferred();
						_this.IpAssignedManagerCollection.fetch({
					 		success: function(){
					 		for ( var i = 0 ; i < _this.IpAssignedManagerCollection.length ; i++ ) {
					 			var ct = _this.IpAssignedManagerCollection.models[i];
							}
							dfd.resolve();
						}, error: function(){
							dfd.reject();
						}
					});
					return dfd.promise();
				},
				actionCallBack:function(res){//response schema
					_this.grid.render();
				},
				errorCallBack:function(response){
					Dialog.error(i18nCommon.COMMUTE_RESULT_LIST.MSG.GET_DATA_FAIL);
				},
			});
		},
	});
	return IpAssignedManagerView;
});
