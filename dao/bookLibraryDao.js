// Author: jsnam
// Create Date: 2017.12.20
// 도서관리 dao
var db = require('../lib/dbmanager.js');
var group = 'bookLibrary';
var debug = require('debug')('bookLibraryDao');

var BookLibraryDao = function() {};

//목록조회
BookLibraryDao.prototype.selectBookLibrary = function() {
    return db.query(group, "selectBookLibrary");
};

//도서삭제
BookLibraryDao.prototype.deleteBookLibrary = function(data) {
    return db.query(group, "deleteBookLibrary", [
        data.book_id    
    ]);
};

//도서추가
BookLibraryDao.prototype.insertBookLibrary = function(data) {
    return db.query(group, "insertBookLibrary", [
        data.category_1, data.category_2, data.manage_no, data.book_name, data.author, data.publisher, data.publishing_date, data.img_src, data.isbn
    ]);
}

//도서대출
BookLibraryDao.prototype.insertRentBook = function(data) {
    return db.query(group, "insertRentBook", [
        data.book_id, data.user_id, data.due_date
    ]);
};

//도서반납
BookLibraryDao.prototype.deleteRentBook = function(data) {
    return db.query(group, "deleteRentBook", [
        data.book_id, data.user_id
    ]);
};

//이력추가
BookLibraryDao.prototype.insertRentHistory = function(data) {
    return db.query(group, "insertRentHistory", [
        data.user_id, data.book_id, data.book_id, data.book_id, data.book_id, data.book_id, data.state
    ]);
};

//이력조회
BookLibraryDao.prototype.selectRentHistory = function(data) {
    return db.query(group, "selectRentHistory", [
        data.start, data.end
    ]);
}

//관리번호 조회
BookLibraryDao.prototype.selectManageNo = function(data) {
    return db.query(group, "selectManageNo", [
        data.manageno
    ]);
}

module.exports = new BookLibraryDao();
