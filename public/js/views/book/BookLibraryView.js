define([
    'jquery',
    'underscore',
    'backbone',
    'util',
    'core/BaseView',
    'grid',
    'schemas',
    'i18n!nls/common',
    'dialog',
    'text!templates/layout/default.html',
    'text!templates/default/head.html',
    'text!templates/default/row.html',
    'text!templates/default/content.html',
    'text!templates/default/rowbutton.html',
    'text!templates/default/rowcombo.html',
    'text!templates/book/bookRow.html',
    'text!templates/book/btnRentReturn.html',
    'models/sm/SessionModel',
    'models/book/BookModel',
    'collection/book/BookLibCollection',
    'collection/book/BookCategoryCollection',
    'views/book/popup/BookDetailPopupView',
    'views/book/popup/BookRegistPopupView'
], function(
    $,
    _,
    Backbone,
    Util,
    BaseView,
    Grid,
    Schemas,
    i18Common,
    Dialog,
    LayoutHTML,
    HeadHTML,
    RowHTML,
    ContentHTML,
    RowButtonHTML,
    RowComboHTML,
    BookRowHTML,
    BtnRentRerturnHTML,
    SessionModel,
    BookModel,
    BookLibCollection,
    BookCategoryCollection,
    BookDetailPopupView,
    BookRegistPopupView
) {
    var _currentFilter = 0;
    var BookLibraryView = BaseView.extend({
        el: ".main-container",
        initialize: function() {
            this.bookLibCollection = new BookLibCollection();
            this.option = {
                el: "bookLibrary_content",
                id: "bookLibraryTable",
                column: [{
                        "title": i18Common.BOOK_LIST.NAME,
                        "render": function(data, type, row) {
                            return _.template(BookRowHTML)(row);
                        }
                    },
                    {
                        "title": i18Common.BOOK_LIST.RENT_STATE,
                        "render": function(data, type, row) {
                            var opt = {
                                book_id: row.book_id,
                                isShowReturnBtn: (Number(row.state) > 0) ? true : false
                            };
                            return _.template(BtnRentRerturnHTML)(opt);
                        }
                    },
                    {
                        "title": i18Common.BOOK_LIST.MANAGE_NO,
                        "render": function(data, type, row) {
                            return row.manage_no;
                        }
                    },
                    {
                        "title": i18Common.BOOK_LIST.RENT_USER,
                        "render": function(data, type, row) {
                            return row.rent_user;
                        }
                    },
                    {
                        "title": i18Common.BOOK_LIST.DUE_DATE,
                        "render": function(data, type, row) {
                            return row.due_date;
                        }
                    }
                ],
                initLength: 25,
                dataschema: ["book_name", "manage_no", "state", "due_date"],
                collection: this.bookLibCollection,
                detail: true,
                view: this,
                fetch: false,
                order: [
                    [0, "asc"]
                ]
            };
            this.listenTo(this.bookLibCollection, 'reset', this.refresh);
        },
        render: function() {
            var _view = this;
            var _headSchema = Schemas.getSchema('headTemp');
            var _headTemp = _.template(HeadHTML);
            var _layOut = $(LayoutHTML);
            //Head 
            var _head = $(_headTemp(_headSchema.getDefault({ title: i18Common.PAGE.TITLE.BOOK_MANAGER, subTitle: i18Common.PAGE.SUB_TITLE.BOOK_LIBRARY })));
            _head.addClass("no-margin");
            _head.addClass("relative-layout");

            var _row = $(RowHTML);
            var _content = $(ContentHTML).attr("id", this.option.el);

            var _categoryMainCombo = $(_.template(RowComboHTML)({
                obj: {
                    id: "categoryMainCombo",
                    label: "대분류"
                }
            }));
            var _categorySubCombo = $(_.template(RowComboHTML)({
                obj: {
                    id: "categorySubCombo",
                    label: "소분류"
                }
            }));

            _row.append(_categoryMainCombo);
            _row.append(_categorySubCombo);

            _layOut.append(_head);
            _layOut.append(_row);
            _layOut.append(_content);
            $(this.el).html(_layOut);


            //grid button add;

            //필터링
            var _filterText = ['전체', '대출중', '대출가능'];
            var _buttons = ["search"];
            _buttons.push({
                type: "custom",
                name: "filter",
                tooltip: "대출현황",
                filterBtnText: _filterText,
                click: function(_grid, _button) {
                    var filters = [
                        function() {
                            return true;
                        },
                        function(data) {
                            return (data[2].indexOf("대출중") != -1) ? true : false;
                        },
                        function(data) {
                            return (data[2].indexOf("대출가능") != -1) ? true : false;
                        }
                    ];

                    if (_currentFilter == 2) {
                        _currentFilter = 0;
                    }
                    else {
                        _currentFilter++;
                    }
                    _button.html(_filterText[_currentFilter]);
                    _grid.setBtnText(_button, _filterText[_currentFilter]);
                    _grid.filtering(function(data) {
                        var fn = filters[_currentFilter];
                        return fn(data);
                    }, "state");
                }
            });

            //도서등록
            if (SessionModel.getUserInfo().admin > 0 || SessionModel.getUserInfo().id == '111102') {
                _buttons.push({
                    type: "custom",
                    name: "add",
                    tooltip: i18Common.BOOK_LIST.ADD_BOOK,
                    click: function() {
                        var bookRegistPopupView = new BookRegistPopupView();
                        Dialog.show({
                            title: i18Common.BOOK_LIST.ADD_BOOK,
                            content: bookRegistPopupView,
                            buttons: [{
                                label: i18Common.DIALOG.BUTTON.ADD,
                                cssClass: Dialog.CssClass.SUCCESS,
                                action: function(dialog) {

                                    if (SessionModel.getUserInfo().id != '130702' && SessionModel.getUserInfo().id != '111102') {
                                        Dialog.warning(i18Common.BOOK_LIST.MSG.FAIL_REGIST_AUTH);
                                        return;
                                    }
                                    bookRegistPopupView.registBook({
                                        success: function(model, response) {
                                            Dialog.show(i18Common.BOOK_LIST.MSG.SUCCESS_REGIST, function() {
                                                dialog.close();
                                                _view.loadingView();
                                            });
                                        },
                                        error: function(model, response) {
                                            Dialog.show(i18Common.BOOK_LIST.MSG.FAIL_REGIST);
                                        }
                                    });
                                }
                            }, {
                                label: i18Common.DIALOG.BUTTON.CLOSE,
                                action: function(dialogRef) {
                                    dialogRef.close();
                                }
                            }]
                        });
                    }
                });
            }

            this.option.buttons = _buttons;

            //grid 
            var _gridSchema = Schemas.getSchema('grid');
            this.grid = new Grid(_gridSchema.getDefault(this.option));
            this.loadingView();

            _view.categoryCollection = new BookCategoryCollection();
            _view.categoryCollection.fetch({
                success: function() {
                    var allOpt = $("<option>" + "전체" + "</option>").attr("val", "all");
                    $(_view.el).find("#categoryMainCombo").append(allOpt);

                    var subOpt = $("<option>" + "-" + "</option>").attr("val", "none");
                    $(_view.el).find("#categorySubCombo").append(subOpt);

                    _view.categoryCollection.each(function(list) {
                        var opt = $("<option>" + list.attributes.name + "</option>").attr("val", list.attributes.separator);
                        $(_view.el).find("#categoryMainCombo").append(opt);
                    });
                },
                error: function() {
                    alert("카테고리 불러 올수 없음");
                }
            });
        },
        events: {
            'change select#categoryMainCombo': 'mainCategoryClick',
            'change select#categorySubCombo': 'subCategoryClick',
            'click #bookLibraryTable .btn-rent': 'onClickOpenRentPopup',
            'click #bookLibraryTable .btn-return': 'onClickOpenRentPopup'
        },
        loadingView: function() {
            var _view = this;
            Dialog.loading({
                action: function() {
                    var dfd = new $.Deferred();
                    _view.bookLibCollection.fetch({
                        success: function() {
                            dfd.resolve();
                        },
                        error: function() {
                            dfd.reject();
                        }
                    });
                    return dfd.promise();
                },
                actionCallBack: function(res) { //response schema
                    _view.grid.render();
                    _view.subCategoryClick(true);
                },
                errorCallBack: function(response) {
                    Dialog.error(i18Common.COMMUTE_RESULT_LIST.MSG.GET_DATA_FAIL);
                },
            });


        },
        mainCategoryClick: function() { //대분류 선택시 소분류 변경
            var _view = this;
            var selectedVal = $(this.el).find("#categoryMainCombo option:selected").attr("val");
            var subOpt;

            $(_view.el).find("#categorySubCombo").empty();

            if (selectedVal == "all") {
                subOpt = $("<option>" + "-" + "</option>").attr("val", "none");
                $(_view.el).find("#categorySubCombo").append(subOpt);
            }
            else {
                _view.categoryCollection.each(function(list) {
                    if (list.attributes.separator == selectedVal) {
                        if (list.attributes.child) {
                            var child = list.attributes.child;
                            _.each(child, function(list) {
                                var subOpt = $("<option>" + list.name + "</option>").attr("val", list.separator);
                                $(_view.el).find("#categorySubCombo").append(subOpt);
                            });
                        }
                    }
                });
            }
            this.subCategoryClick();
        },
        subCategoryClick: function(first){
            var data = {
                category_1: $(this.el).find("#categoryMainCombo option:selected").attr("val"),
                category_2: $(this.el).find("#categorySubCombo option:selected").attr("val")
            }

            if (Util.isNull(data)) {
                return;
            }
            if (first == true)
                this.bookLibCollection.filterByCategory(data, true);
            else
                    this.bookLibCollection.filterByCategory(data);
        },
        refresh: function() { //filter를 통한 목록 갱신
            this.grid._draw();
        },
        onClickOpenRentPopup: function(evt) {
            var _view = this;

            var popupOpt = {};
            if (this.grid.getSelectItem().state > 0) {
                popupOpt = { mode: 'return' };
            }
            else {
                popupOpt = { mode: 'rent' };
            }
            _.extend(popupOpt, { selectItem: this.grid.getSelectItem() });

            var bookDetailPopupView = new BookDetailPopupView(popupOpt);

            var rentBtn = {
                id: 'rentBookBtn',
                cssClass: Dialog.CssClass.SUCCESS,
                label: i18Common.BOOK_LIST.DETAIL_DIALOG.BUTTON.RENT,
                action: function(dialog) {
                    bookDetailPopupView.rentBook({
                        wait: true,
                        success: function(model, response) {
                            Dialog.show(i18Common.BOOK_LIST.MSG.SUCCESS_RENT, function() {
                                dialog.close();
                                _view.loadingView();
                            });
                        },
                        error: function(model, response) {
                            Dialog.show(i18Common.BOOK_LIST.MSG.FAIL_RENT);
                        }
                    });
                }
            };

            var returnBtn = {
                id: 'returnBookBtn',
                cssClass: Dialog.CssClass.SUCCESS,
                label: i18Common.BOOK_LIST.DETAIL_DIALOG.BUTTON.RETURN,
                action: function(dialog) {
                    bookDetailPopupView.returnBook({
                        wait: true,
                        success: function(model, response) {
                            Dialog.show(i18Common.BOOK_LIST.MSG.SUCCESS_RETURN, function() {
                                dialog.close();
                                _view.loadingView();
                            });
                        },
                        error: function(model, response) {
                            Dialog.show(i18Common.BOOK_LIST.MSG.FAIL_RETURN);
                        }
                    });
                }
            }

            var deleteBtn = {
                id: 'deleteBookBtn',
                cssClass: Dialog.CssClass.WARNING,
                label: i18Common.BOOK_LIST.DETAIL_DIALOG.BUTTON.DEL,
                action: function(dialog) {

                    if (_view.grid.getSelectItem().state > 0) {
                        Dialog.warning(i18Common.BOOK_LIST.MSG.FAIL_DELETE.USE_RENT);
                        return;
                    }

                    if (SessionModel.getUserInfo().id != '130702' && SessionModel.getUserInfo().id != '111102') {
                        Dialog.warning(i18Common.BOOK_LIST.MSG.FAIL_DELETE.AUTH);
                        return;
                    }

                    bookDetailPopupView.deleteBook({
                        success: function(model, response) {
                            Dialog.show(i18Common.BOOK_LIST.MSG.SUCCESS_DELETE, function() {
                                dialog.close();
                                _view.loadingView();
                            });
                        },
                        error: function(model, response) {
                            Dialog.show(i18Common.BOOK_LIST.MSG.FAIL_DELETE.FAIL);
                        }
                    });
                }
            }

            var cancelBtn = {
                label: i18Common.COMMUTE_RESULT_LIST.COMMENT_DIALOG.BUTTON.CANCEL,
                action: function(dialog) {
                    dialog.close();
                }
            };

            var btns;
            if (SessionModel.getUserInfo().admin > 0) {

                if (this.grid.getSelectItem().state == 0) {
                    if (SessionModel.getUserInfo().id == '111102')
                        btns = [deleteBtn, rentBtn, cancelBtn];
                    else
                        btns = [deleteBtn, cancelBtn];
                }
                else {
                    if (this.grid.getSelectItem().rent_user == SessionModel.getUserInfo().name) {
                        if (SessionModel.getUserInfo().id == '111102')
                            btns = [deleteBtn, returnBtn, cancelBtn];
                    }
                    else
                        btns = [deleteBtn, cancelBtn];
                }
            }
            else {
                if (this.grid.getSelectItem().state == 0) {
                    if (SessionModel.getUserInfo().id == '111102')
                        btns = [deleteBtn, rentBtn, cancelBtn];
                    else
                        btns = [rentBtn, cancelBtn];
                }
                else {
                    if (this.grid.getSelectItem().rent_user == SessionModel.getUserInfo().name) {
                        if (SessionModel.getUserInfo().id == '111102')
                            btns = [deleteBtn, returnBtn, cancelBtn];
                        else
                            btns = [returnBtn, cancelBtn];
                    }
                    else
                        btns = [cancelBtn];
                }
            }

            Dialog.show({
                title: i18Common.BOOK_LIST.DETAIL_DIALOG.TITLE,
                content: bookDetailPopupView,
                buttons: btns
            });
        }
    });
    return BookLibraryView;
});
