/**
 * 도서 대여, 반납, 등록 팝업
 */

define([
	'jquery',
	'underscore',
	'backbone',
	'util',
	'cmoment',
	'dialog',
	'i18n!nls/common',
	'lib/component/form',
	'models/sm/SessionModel',
	'models/book/BookModel',
	'models/book/BookRentModel',
	'collection/book/BookCategoryCollection',

], function(
	$,
	_,
	Backbone,
	Util,
	Moment,
	Dialog,
	i18nCommon,
	Form,
	SessionModel,
	BookModel,
	BookRentModel,
	BookCategoryCollection,
) {
	var BookDetailPopupView = Backbone.View.extend({
		initialize: function(data) {

			this.mode = data.mode;
			if (this.mode == 'rent' || this.mode == 'return')
				this.selectData = data.selectItem;
		},
		render: function(el) {
			var _view = this;
			var dfd = new $.Deferred();

			if (!_.isUndefined(el))
				this.el = el;

			_view.categoryCollection = new BookCategoryCollection();
			$.when(_view.categoryCollection.fetch()).done(function() {

				//대분류 선택에 따른 소분류 Array
				var subCol;
				_view.categoryCollection.each(function(list) {
					if (list.attributes.separator == _view.selectData.category_1) {
						subCol = list.attributes.child;
					}
				});
				
				//대여시 현재 시간
				var dueDateValue;
				if (_view.mode == 'rent') {
					var today = new Date();
					dueDateValue = 	Moment(today).format("YYYY-MM-DD");
				} else {
					dueDateValue = _view.selectData.due_date;
				}
						

				var _form = new Form({
					el: _view.el,
					form: undefined,
					group: [{
						name: "detailInfo",
						label: i18nCommon.BOOK_LIST.DETAIL_DIALOG.SUB_TITLE,
						initOpen: true
					}],
					childs: [{
							type: "input",
							name: "book_name",
							label: i18nCommon.BOOK_LIST.DETAIL_DIALOG.BOOK_NAME,
							value: _view.selectData.book_name,
							disabled: true,
							group: "detailInfo"
						},
						{
							type: "input",
							name: "manage_no",
							label: i18nCommon.BOOK_LIST.DETAIL_DIALOG.BOOK_MANAGE_NO,
							value: _view.selectData.manage_no,
							disabled: true,
							group: "detailInfo"
						},
						{
							type: "input",
							name: "author",
							label: i18nCommon.BOOK_LIST.DETAIL_DIALOG.BOOK_AUTHOR,
							value: _view.selectData.author,
							disabled: true,
							group: "detailInfo"
						},
						{
							type: "input",
							name: "publisher",
							label: i18nCommon.BOOK_LIST.DETAIL_DIALOG.BOOK_PUBLISHER,
							value: _view.selectData.publisher,
							disabled: true,
							group: "detailInfo"
						},
						{
							type: "combo",
							name: "category_1",
							label: i18nCommon.BOOK_LIST.DETAIL_DIALOG.BOOK_MAIN_CATEGORY,
							value: _view.selectData.category_1,
							codeKey: "separator",
							textKey: "name",
							collection: _view.categoryCollection,
							disabled: true,
							group: "detailInfo"
						},
						{
							type: "combo",
							name: "category_2",
							label: i18nCommon.BOOK_LIST.DETAIL_DIALOG.BOOK_SUB_CATEGORY,
							value: _view.selectData.category_2,
							collection: subCol,
							disabled: true,
							group: "detailInfo"
						},
						{
							type: "date",
							name: "due_date",
							label: i18nCommon.BOOK_LIST.DETAIL_DIALOG.BOOK_DUE_DATE,
							value: dueDateValue,
							format: "YYYY-MM-DD",
							disabled: (_view.selectData.state > 0) ? true : false,
							group: "detailInfo"
						}
					]
				});

				_form.render().done(function() {
					_view.form = _form;
					dfd.resolve();
				}).fail(function() {
					dfd.reject();
				});
			}).fail(function(e) {
				Dialog.error(i18nCommon.ERROR.USER_EDIT_VIEW.FAIL_RENDER);
				dfd.reject();
			});

			return dfd.promise();
		},
		rentBook: function(opt) {
			
			var passData = {
				book_id: this.selectData.book_id,
				state: 1,		//1 rent, 0 return
				due_date: $(this.form.getElement("due_date").find("input")).val()
			};

			var bookRentModel = new BookRentModel();
			bookRentModel.save(passData, opt);
		},
		returnBook: function(opt) {
			var passData = {
				_id: this.selectData.book_id,
				book_id: this.selectData.book_id,
				state : 0,
			};
			
			var bookRentModel = new BookRentModel();
			bookRentModel.save(passData, opt);
		},
		deleteBook: function(opt) {
			var passData = {
				_id: this.selectData.book_id,
				book_id: this.selectData.book_id
			};
			
			console.log(passData);
			
			var bookModel = new BookModel();
			bookModel.save(passData, opt);
		}
		
	});

	return BookDetailPopupView;
});
