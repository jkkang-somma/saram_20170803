define([
	'jquery',
	'jquery.draggable',
	'underscore',
	'backbone',
	'core/BaseView',
	'grid',
	'schemas',
	'i18n!nls/common',
	'models/sm/SessionModel',
	'dialog',
	'text!templates/default/head.html',
	'text!templates/default/content.html',
	'text!templates/layout/default.html',
	'text!templates/gis/gispicbtn.html',
], function ($, jui, _, Backbone, BaseView, Grid, Schemas, i18Common, SessionModel, Dialog, HeadHTML, ContentHTML, LayoutHTML, DeleteBtnHTML) {
		var GisHistoryView = BaseView.extend({
			el: ".main-container",
			initialize: function () {
				var _view = this;
				this.option = {
					el: "gis_history_content",
					column: [
						// {
						// 	"title": "자리배치도",
						// 	"render": function (data, type, row) {
						// 		return "<div class='imgbox gis-history-pic'><img src='/gis/GisHistoryImg?file=" + row.id + "&timestamp=" + new Date().getTime() + "'/></div>";
						// 	}
						// },
						{
							"title": "일자", "data": "id",
							"render": function (data, type, row, meta) {
								var date = data.replace(".png", "");
								var tpl = "<sapn class='history-img-link' style='cursor:pointer' data-id='"+data+"'>" + date + "</sapn>";
								return tpl;
							}
						},
						{
							"title": "삭제", "data": "icon",
							"render": function (data, type, row, meta) {
								var tpl = _.template(DeleteBtnHTML)({ id: row.id, index: meta.row });
								return tpl;
							}
						},
					],
					rowCallback: function (row, data) {
						var index = row._DT_RowIndex;
						_view.option.data[data.id] = index;
					},
					dataschema: ["id", "name"],
					collection: null,
					fetch: false,
					detail: true,
					view: this,
					order: [[1, "desc"]],
					data: {},
				};
			},

			events: {
				'click .remove-pic' : 'onClickRemove',
				'click .history-img-link' : 'onClickPicLink'
			},

			onClickRemove : function(event) {
				var _view = this;

				var target = $(event.currentTarget);
				var index = target.data("index");
				var id = target.data("id");

				Dialog.confirm({
					msg : "해당 이력을 삭제하시겠습니까?",
					action:function(){
						var dfd = new $.Deferred();
						var url = "/gis/GisHistory";
						var ajaxSetting = {
							method : "DELETE",
							data : {id:id},
							success : function(result){
								dfd.resolve({msg:index});
							},
							error : function(){
								dfd.resolve();
							}
						};
						
						$.ajax( url, ajaxSetting );
						return dfd.promise();
					},
					actionCallBack:function(res){//response schema
						_view.grid.removeRow();
					},
				});
			},

			onClickPicLink:function(event) {
				// popup
				var target = $(event.currentTarget);
				// var index = target.data("index");
				var id = target.data("id");

				var url = "http://" + window.location.host + "/gis/GisHistoryImg?file=" + id + "&timestamp=" + new Date().getTime();
				window.open(url, id.replace(".png",""));
				//newWin.location.reload();
				// var newWin = window.open("about:blank");
				// newWin.location.href=url;
			},

			render: function () {
				var _view = this;
				var _headSchema = Schemas.getSchema('headTemp');
				var _headTemp = _.template(HeadHTML);
				var _layOut = $(LayoutHTML);
				//Head 
				var _head = $(_headTemp(_headSchema.getDefault({ title: i18Common.GIS.TITLE, subTitle: "이력조회" })));
				_head.addClass("no-margin");
				_head.addClass("relative-layout");

				//grid button add;
				var _buttons = ["search"];

				//Refresh
				//_buttons.push("refresh");

				this.option.buttons = _buttons;

				//grid
				var _content = $(ContentHTML).attr("id", this.option.el);

				_layOut.append(_head);
				_layOut.append(_content);
				$(this.el).html(_layOut);
				this.initGrid();
			},

			initGrid: function () {
				var _view = this;
				
				this.ajaxCall().then(function(result){
					var gridData = [];
					_.each(result, function(pic) {
						gridData.push({
							id: pic
							//name: model.attributes.name
						});
					})

					_view.option.collection = {
						data:gridData,
						toJSON : function(){
							return gridData;
						}
					};

					var _gridSchema = Schemas.getSchema('grid');
					_view.grid = new Grid(_gridSchema.getDefault(_view.option));
				});
			},

			ajaxCall:function() {
				var dfd = new $.Deferred();
				var url = "/gis/GisHistory";
				var ajaxSetting = {
					method : "GET",
					success : function(result){
						dfd.resolve(result);
					},
					error : function(){
						dfd.resolve();
					}
				};
				
				$.ajax( url, ajaxSetting );
				 return dfd.promise();
			},
		});
		return GisHistoryView;
	});
