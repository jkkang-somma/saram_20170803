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
	'text!templates/default/rowcombo.html',
	'text!templates/default/rowbuttoncontainer.html',
	'text!templates/default/rowbutton.html',
	'models/sm/SessionModel',
	'text!templates/default/content.html',
	'text!templates/layout/default.html',
	'models/officeitem/IpAssignedManagerModel',
	'collection/officeitem/IpAssignedManagerCollection',
	'views/officeitem/popup/AddIpView',
	'views/officeitem/popup/EditIpView',
	'text!templates/default/button.html',
	], function($, _, Backbone, BaseView, Moment, Grid, LodingButton, Schemas, Code, i18nCommon, Dialog, HeadHTML, RowHTML, 
		RowComboHTML, RowButtonContainerHTML, RowButtonHTML, SessionModel, ContentHTML, LayoutHTML, 
		IpAssignedManagerModel, IpAssignedManagerCollection, AddIpView, EditIpView, ButtonHTML){

		var IpAssignedManagerView = BaseView.extend({
		//el:$(".main-container"),
		el:".main-container",
		initialize:function(){
			this.IpAssignedManagerCollection = new IpAssignedManagerCollection();
			this.gridOption = {
					el:"IpSearch_content",
					//id:"IpSearchDataTable",
					column:[
							{ data : "ip",			"title" : i18nCommon.IPASSIGNED_MANAGER_LIST.GRID_COL_NAME.IP},
							//{ data : "use_dept",	"title" : i18nCommon.IPASSIGNED_MANAGER_LIST.GRID_COL_NAME.USE_DEPT },
							{ data : "use_user",	"title" : i18nCommon.IPASSIGNED_MANAGER_LIST.GRID_COL_NAME.USE_USER },
							{ data : "memo", 		"title" : i18nCommon.IPASSIGNED_MANAGER_LIST.GRID_COL_NAME.MEMO},
					],
					// rowCallback: function(row, data){
					// 	if(data.approval_ok == '상신' || data.approval_ok == '취소요청'){ // 미결
					// 		$(row).addClass("absentce");
					// 	}else{
					// 		$(row).removeClass("absentce");
					// 	}
					// },
					collection:this.IpAssignedManagerCollection,
					//dataschema:["ip", "use_dept", "use_user", "memo"],
					dataschema:["ip", "use_user", "memo"],
					detail: true,
					view:this,
					fetch: false,
					order : [[1, "asc"]]
			};
			//this.buttonInit();
		},
		events: {
			'click #ccmSearchBtn' : 'onClickSearchBtn',
		},
		buttonInit: function(){
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
										$("#loginbtn").button("loading");
										//$(_btn).button('loading');
									};
									affterEvent=function(){
										$("#loginbtn").button("reset");
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
						//this.onClickSave(this.gridOption);
						//this.onClickSave();
						_grid.saveExcel();
					}
				});
			};
			_buttons.push("refresh");
			this.gridOption.buttons=_buttons;
			// this.gridOption.fetchParam = {
			// 	success : function(){
			// 		grid._draw();
			// 		var filterBtn = $("#"+grid.getButton("filter"));
			// 		while(filterBtn.text() != "근무자"){
			// 				filterBtn.trigger("click");
			// 		}
			// 	}
			// };
			
			//grid 
			var _gridSchema=Schemas.getSchema('grid');
			this.grid= new Grid(_gridSchema.getDefault(this.gridOption));
			var _content=$(ContentHTML).attr("id", this.gridOption.el);

			_layOut.append(_head);
			_layOut.append(_content);
			$(this.el).html(_layOut);

			this.grid.render();
			this.selectIPSearch();

			return this;
		},
		onClickSearchBtn: function(evt) {
			this.selectIPSearch();
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
		onClickSave: function(grid) {
            grid.saveExcel();
        }
	});
	return IpAssignedManagerView;
});
