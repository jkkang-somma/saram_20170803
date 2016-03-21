/**
 * 변경 이력 팝업창 
 */

define([
	'jquery',
	'underscore',
	'backbone',
	'util',
	'schemas',
	'grid',
	'dialog',
	'datatables',
	'cmoment',
	'core/BaseView',
	'text!templates/default/content.html',
	'models/cm/ChangeHistoryModel',
	'collection/cm/ChangeHistoryCollection',
	'views/component/ProgressbarView',
], function(
	$,
	_,
	Backbone,
	Util,
	Schemas,
	Grid,
	Dialog,
	Datatables,
	Moment,
	BaseView,
	ContentHTML,
	ChangeHistoryModel, ChangeHistoryCollection,
	ProgressbarView) {

	var ChangeHistoryPopupView = Backbone.View.extend({
		initialize: function(data) {
			this.searchData = data;
			this.changeHistoryCollection = new ChangeHistoryCollection();
			this.gridOption = {
				el: "changeHistoryDataTable_content",
				id: "changeHistoryDataTable",
				column: [{
					data: "change_date",
					"title": "수정 날짜"
				}, {
					data: "change_memo",
					"title": "변경 사유",
					render: function(data, type, full, meta) {
						var changeBr = full.change_memo + "<br>";
						var changehi = " - " + full.change_name;
						return changeBr + changehi;
					}
				}],
				collection: this.changeHistoryCollection,
				detail: true,
				buttons: ["search"],
				fetch: false,
				order: [
					[1, "desc"]
				]
			};

			if (this.searchData.change_column !== "normal") {
				this.gridOption.column.unshift({
					data: "change_before",
					"title": "변경 전",
					render: function(data, type, full, meta) {
						var nullvalue = "기록 없음";
						var changeBefore = full.change_before;
						if (changeBefore == null) {
							changeBefore = nullvalue;
						}
						return changeBefore;
					}
				}, {
					data: "change_after",
					"title": "변경 후"
				});
				
				this.gridOption.order = [3, "desc"];
			}
		},
		events: {
			'view:rendered': "renderGrid"
		},
		render: function(el) {
			var dfd = new $.Deferred();

			if (!_.isUndefined(el)) this.el = el;

			var _content = $(ContentHTML).attr("id", this.gridOption.el);
			// console.log(_content);
			$(this.el).html(_content);

			var _gridSchema = Schemas.getSchema('grid');
			this.grid = new Grid(_gridSchema.getDefault(this.gridOption));
			dfd.resolve(this);

			this.progressbar = new ProgressbarView();
			$(this.el).append(this.progressbar.render());
			this.progressbar.disabledProgressbar(false);
			return dfd.promise();
		},

		afterRender: function() {
			var _this = this;
			this.changeHistoryCollection.fetch({
				data: _this.searchData,
				success: function(result) {
					_this.grid.render();
					_this.progressbar.disabledProgressbar(true);
				},
				error: function(result) {
					alert("데이터 조회가 실패했습니다.");
				}
			});
		}
	});

	return ChangeHistoryPopupView;
});