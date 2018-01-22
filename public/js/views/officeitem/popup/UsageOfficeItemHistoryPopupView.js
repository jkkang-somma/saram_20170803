/**
 * 변경 이력 팝업창 
 */

define([
	'jquery',
	'underscore',
	'backbone',
	'util',
	'schemas',
	'i18n!nls/common',
	'grid',
	'dialog',
	'datatables',
	'cmoment',
	'core/BaseView',
	'text!templates/default/content.html',
	'models/officeitem/OfficeItemHistoryModel',
	'collection/officeitem/OfficeItemHistoryCollection',
	'views/component/ProgressbarView',
	'code'
], function(
	$,
	_,
	Backbone,
	Util,
	Schemas,
	i18nCommon,
	Grid,
	Dialog,
	Datatables,
	Moment,
	BaseView,
	ContentHTML,
	OfficeItemHistoryModel, 
	OfficeItemHistoryCollection, 
	ProgressbarView,
	Code
) {

	var UsageOfficeItemHistoryPopupView = Backbone.View.extend({
		initialize: function(data) {
			var _view = this;
			this.searchData = data;
			this.officeItemCodes = Code.getCodes(Code.OFFICEITEM);
			this.officeItemHistoryCollection = new OfficeItemHistoryCollection();
			this.gridOption = {
				el: "officeItemHistoryPopupTable_content",
				id: "officeItemHistoryPopupTable",
				column: [
                    //{ data : "seq",            title : i18nCommon.OFFICEITEM.HISTORY.CODE.SEQ, visible:false, subVisible:false },
                    //{ data : "serial_yes",     title : i18nCommon.OFFICEITEM.HISTORY.CODE.SERIAL_YES },
                    //{ data : "category_type",  title : i18nCommon.OFFICEITEM.HISTORY.CODE.CATEGORY_TYPE, visible:false, subVisible:false },
                    /*{ title : i18nCommon.OFFICEITEM.HISTORY.CODE.CATEGORY_NAME,
                        "render": function(data, type, row){
                            var serial = row.serial_yes;
                            //serial = serial.substring(0, serial.lastIndexOf("-"));
                            var codeList = _view.officeItemCodes;

                            var code, name;
                            for(var index in codeList){
                                code = codeList[index].category_code;
                                if( serial.indexOf(code) == 0){
                                    name = codeList[index].category_name;
                                    break;
                                }
                            }
                            return name;
                        }
                    },*/
                    { data : "history_date",   title : i18nCommon.OFFICEITEM.HISTORY.CODE.HISTORY_DATE,
                        "render": function(data, type, row){
                            var data = Moment(row.history_date).format("YYYY-MM-DD");
                            return data;
                        }
                    },
                    { data : "type",           title : i18nCommon.OFFICEITEM.HISTORY.CODE.TYPE },
                    { data : "title",          title : i18nCommon.OFFICEITEM.HISTORY.CODE.TITLE },
                    { data : "repair_price",   title : i18nCommon.OFFICEITEM.HISTORY.CODE.REPAIR_PRICE },
                    //{ data : "use_user",       title : i18nCommon.OFFICEITEM.HISTORY.CODE.USER_ID, visible:false, subVisible:false },
                    //{ data : "use_dept",       title : i18nCommon.OFFICEITEM.HISTORY.CODE.USE_DEPT, visible:false, subVisible:false },
                    { data : "name",           title : i18nCommon.OFFICEITEM.HISTORY.CODE.OWNER },
                    //{ data : "change_user_id", "title" : i18nCommon.OFFICEITEM.HISTORY.CODE.CHANGE_USER_ID, visible:false, subVisible:false },
                    { data : "memo",           "title" : i18nCommon.OFFICEITEM.HISTORY.CODE.MEMO }
				],
				dataschema:["seq", "serial_yes", "category_type", "history_date", "type", "title", "repair_price", "use_user", "use_dept", "name", "change_user_id", "memo"],
				collection: this.officeItemHistoryCollection,
				detail: true,
				buttons: ["search"],
				fetch: false,
				order: [
					[1, "desc"]
				]
			};
		},/*
		events: {
			'view:rendered': "renderGrid"
		},*/
		render: function(el) {
			var dfd = new $.Deferred();

			if (!_.isUndefined(el)) this.el = el;

			var _content = $(ContentHTML).attr("id", this.gridOption.el);

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
			$(_this.el[0].parentElement.parentElement.parentElement.parentElement.parentElement).css('width', 1000);
			$(_this.el[0].parentElement.parentElement.parentElement.parentElement.parentElement).css('height', 670);
			this.officeItemHistoryCollection.fetch({
				data: {"serial_yes" : _this.searchData},
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

	return UsageOfficeItemHistoryPopupView;
});