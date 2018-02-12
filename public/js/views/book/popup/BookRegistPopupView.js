/**
 * 도서검색 후 등록, 직접 등록
 */

define([
    'jquery',
    'underscore',
    'backbone',
    'util',
    'i18n!nls/common',
    'schemas',
    'grid',
    'dialog',
    'datatables',
    'code',
    'cmoment',
    'core/BaseView',
    'models/sm/SessionModel',
    'views/component/ProgressbarView',
    'text!templates/default/content.html',
    'text!templates/book/bookRow.html',
    'text!templates/default/rowtextinput.html',
    'text!templates/default/rowcombo.html',
    'text!templates/default/row.html',
    'text!templates/default/rowbuttoncontainer.html',
    'text!templates/default/rowbutton.html',
    'text!templates/layout/default.html',
    'models/book/BookRegistModel',
    'models/book/BookModel',
    'collection/book/BookRegistCollection',
    'collection/book/BookCategoryCollection',
    'collection/book/BookManageCollection'
], function(
    $,
    _,
    Backbone,
    Util,
    i18Common,
    Schemas,
    Grid,
    Dialog,
    Datatables,
    Code,
    Moment,
    BaseView,
    SessionModel,
    ProgressbarView,
    ContentHTML,
    BookRowHTML,
    RowTextInputHTML,
    RowComboHTML,
    RowHTML,
    RowButtonContainerHTML,
    RowButtonHTML,
    LayoutHTML,
    BookRegistModel,
    BookModel,
    BookRegistCollection,
    BookCategoryCollection,
    BookManageCollection
) {
    var alignDigit = function(val, len) {

        if (val == undefined || val.length == 0)
            return val;

        val = val + "";

        var temp = "";
        for (var i = 0; i < len; i++) {
            temp += "0";
        }

        var length = val.length;
        if (length > len)
            return val;

        return temp.substr(0, len - length) + val;
    }

    //도서명, 저자, 출판사, 출간일 ISBN, 대분류, 소분류, 관리번호
    var UsageDetailListPopup = Backbone.View.extend({
        el: ".main-container",
        initialize: function(data) {
            this.bookRegistCollection = new BookRegistCollection();
            this.manageCollection = new BookManageCollection();
            this.gridOption = {
                el: "BookRegist_content",
                id: "BookRegistListGrid",
                column: [{
                    "title": i18Common.BOOK_LIST.DETAIL_DIALOG.BOOK_NAME,
                    "render": function(data, type, row) {
                        return _.template(BookRowHTML)(row);
                    }
                }, {
                    "title": i18Common.BOOK_LIST.DETAIL_DIALOG.BOOK_PUBLISHING_DATE,
                    "render": function(data, type, row) {
                        return Moment(row.publishing_date, 'YYYYMMDD').format('YYYY-MM-DD');
                    }
                }, {
                    "title": i18Common.BOOK_LIST.DETAIL_DIALOG.BOOK_ISBN,
                    "render": function(data, type, row) {
                        return row.isbn;
                    }
                }],
                detail: true,
                collection: this.bookRegistCollection,
                buttons: ["search"],
                fetch: false,
            };
        },
        events: {
            'change select#regiCategoryMainCombo': 'mainCategoryClick',
            'change select#regiCategorySubCombo': 'subCategoryClick',
            'view:rendered': 'renderGrid'
        },
        render: function(el) {
            var _view = this;
            var dfd = new $.Deferred();

            if (!_.isUndefined(el)) this.el = el;

            var _layOut = $(LayoutHTML);
            var _content = $(ContentHTML).attr("id", this.gridOption.el);
            var _row = $(RowHTML);

            var _searchOptionCombo = $(_.template(RowComboHTML)({
                obj: {
                    id: "searchOptionCombo",
                    label: "구분"
                }
            }));

            var _searchInput = $(_.template(RowTextInputHTML)({
                obj: {
                    id: "searchInput",
                    label: "검색어"
                }
            }));

            _searchInput.removeClass();
            _searchInput.addClass('col-sm-6');

            var _btnContainer = $(_.template(RowButtonContainerHTML)({
                obj: {
                    id: "rdBtnContainer"
                }
            }));

            var _searchBtn = $(_.template(RowButtonHTML)({
                obj: {
                    id: "rdSearchBtn",
                    label: i18Common.RAW_DATA_LIST.SEARCH_BTN
                }
            }));

            _searchBtn.click(function(e) {
                _view.onSearch();
            });
            _btnContainer.append(_searchBtn);

            _row.append(_searchOptionCombo);
            _row.append(_searchInput);
            _row.append(_btnContainer);

            _layOut.append(_row);
            _layOut.append(_content);

            var _regiCategoryMainCombo = $(_.template(RowComboHTML)({
                obj: {
                    id: "regiCategoryMainCombo",
                    label: "대분류"
                }
            }));
            var _regiCategorySubCombo = $(_.template(RowComboHTML)({
                obj: {
                    id: "regiCategorySubCombo",
                    label: "소분류"
                }
            }));

            var _manageNoInput = $(_.template(RowTextInputHTML)({
                obj: {
                    id: "manageNoInput",
                    label: "관리번호"
                }
            }));

            _regiCategoryMainCombo.removeClass();
            _regiCategoryMainCombo.addClass('col-sm-4');

            _regiCategorySubCombo.removeClass();
            _regiCategorySubCombo.addClass('col-sm-4');

            _manageNoInput.removeClass();
            _manageNoInput.addClass('col-sm-4');
            _manageNoInput.find('#manageNoInput').attr('disabled', 'disabled');

            var _row2 = $(RowHTML);
            _row2.append(_regiCategoryMainCombo);
            _row2.append(_regiCategorySubCombo);
            _row2.append(_manageNoInput);
            _layOut.append(_row2)

            _regiCategorySubCombo.change(function() {
                _view.getManageNo();
            });

            _view.categoryCollection = new BookCategoryCollection();
            _view.categoryCollection.fetch({
                success: function() {
                    _view.categoryCollection.each(function(list) {
                        var opt = $("<option>" + list.attributes.name + "</option>").attr("val", list.attributes.separator);
                        $(_view.el).find("#regiCategoryMainCombo").append(opt);

                        if (list.attributes.separator == 'OS') {
                            if (list.attributes.child) {
                                var child = list.attributes.child;
                                _.each(child, function(list) {
                                    var subOpt = $("<option>" + list.name + "</option>").attr("val", list.separator);
                                    $(_view.el).find("#regiCategorySubCombo").append(subOpt);
                                });
                            }
                        }
                    });
                    _view.getManageNo();
                },
                error: function() {
                    alert("카테고리 불러 올수 없음");
                }
            });

            _regiCategoryMainCombo.change(function() {
                var selectedVal = $(_view.el).find("#regiCategoryMainCombo option:selected").attr("val");
                $(_view.el).find("#regiCategorySubCombo").empty();

                _view.categoryCollection.each(function(list) {
                    if (list.attributes.separator == selectedVal) {
                        if (list.attributes.child) {
                            var child = list.attributes.child;
                            _.each(child, function(list) {
                                var subOpt = $("<option>" + list.name + "</option>").attr("val", list.separator);
                                $(_view.el).find("#regiCategorySubCombo").append(subOpt);
                            });
                        }
                    }
                });
            });

            _searchInput.keypress(function(e) {
                if (e.which == 13) {
                    e.preventDefault();
                    _view.onSearch();
                }
            });

            $(this.el).html(_layOut);

            var _gridSchema = Schemas.getSchema('grid');
            this.grid = new Grid(_gridSchema.getDefault(this.gridOption));
            dfd.resolve(this);

            $(this.el).find("#searchOptionCombo").append($("<option>" + "책이름" + "</option>").attr("val", "d_titl"));
            $(this.el).find("#searchOptionCombo").append($("<option>" + "저자" + "</option>").attr("val", "d_auth"));
            $(this.el).find("#searchOptionCombo").append($("<option>" + "출판사" + "</option>").attr("val", "d_publ"));
            $(this.el).find("#searchOptionCombo").append($("<option>" + "ISBN" + "</option>").attr("val", "d_isbn"));

            return dfd.promise();
        },
        afterRender: function() {
            this.grid.render();
        },
        onSearch: function() {

            var _this = this;
            var data = {
                searchOpt: $(this.el).find("#searchOptionCombo option:selected").attr("val"),
                searchTxt: $(this.el).find("#searchInput").val()
            }

            if (data.searchOpt == undefined || data.searchTxt == undefined || data.searchTxt == "") {
                Dialog.warning(i18Common.BOOK_LIST.MSG.VALIDATE_SERACH);
                return null;
            }

            this.progressbar = new ProgressbarView();
            $(this.el).append(this.progressbar.render());
            this.progressbar.disabledProgressbar(false);

            this.bookRegistCollection.fetch({
                data: data,
                success: function(result) {
                    _this.grid.render();
                    _this.progressbar.disabledProgressbar(true);
                },
                error: function(result) {
                    console.log(result);
                }
            });
        },
        registBook: function(opt) {
            if (this.grid.getSelectItem() == undefined) {
                Dialog.warning(i18Common.BOOK_LIST.MSG.FAIL_REGIST_NOT_SELECT);
                return null;
            }

            this.manageCollection = new BookManageCollection();

            var mainCate = $(this.el).find("#regiCategoryMainCombo option:selected").attr("val");
            var subCate = $(this.el).find("#regiCategorySubCombo option:selected").attr("val");
            var manageNo = $(this.el).find("#manageNoInput").val();

            var param = {
                category_1: mainCate,
                category_2: subCate,
                manage_no: manageNo,
                book_name: this.grid.getSelectItem().book_name,
                author: this.grid.getSelectItem().author,
                publisher: this.grid.getSelectItem().publisher,
                publishing_date: this.grid.getSelectItem().publishing_date,
                img_src: this.grid.getSelectItem().img_src,
                isbn: this.grid.getSelectItem().isbn
            };

            var bookModel = new BookModel();
            bookModel.save(param, opt);
        },
        getManageNo: function() {
            var _view = this;
            var mainCate = $(_view.el).find("#regiCategoryMainCombo option:selected").attr("val");
            var subCate = $(_view.el).find("#regiCategorySubCombo option:selected").attr("val");
            var cate = "YES-" + mainCate + "-" + subCate;
            var managetInput = $(_view.el).find("#manageNoInput");

            managetInput.attr('disabled', 'disabled');
            _view.manageCollection.fetch({
                data: { manageno: cate },
                success: function(result) {
                    var numb = result.models[0].attributes.manage_no;
                    var manage_no = cate + alignDigit(numb, 3);

                    $(_view.el).find("#manageNoInput").val(manage_no);
                    managetInput.removeAttr('disabled');
                },
                error: function(result) {
                    Dialog.error("관리번호 불러 올수 없음");
                }
            });
        }
    });

    return UsageDetailListPopup;
});
