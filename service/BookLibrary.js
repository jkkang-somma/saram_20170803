var _ = require("underscore");
var debug = require('debug')('BookLibrary');
var Promise = require('bluebird');
var BookLibraryDao = require('../dao/bookLibraryDao.js');
var axios = require("axios");
var xml_digester = require("xml-digester");
var digester = xml_digester.XmlDigester({});

//검색어를 <b>로 처리하고 있어 삭제
//제목과 별개로 부제목은 () 안에 들어감 부제목은 삭제
var replaceAll = function(value) {
    return value.replace(/<b>/gi, "").replace(/<\/b>/gi, "").replace(/\(.*\)/gi, "");
};

//저자가 여러명인 책들 첫번재 제외 다 자름.
var authorCut = function(value) {
    var authors = value.split("|");
    if (authors.length > 0)
        return authors[0];
    else
        return value;
}

var BookLibrary = function() {
    var _getBookLibrary = function() {
        return BookLibraryDao.selectBookLibrary();
    };

    var _deleteBookLibrary = function(data) {
        return BookLibraryDao.deleteBookLibrary(data);
    }

    var _insertBookLibrary = function(data) {
        return BookLibraryDao.insertBookLibrary(data);
    }

    var _insertRentBook = function(data) {
        return BookLibraryDao.insertRentBook(data);
    }

    var _deleteRentBook = function(data) {
        return BookLibraryDao.deleteRentBook(data);
    }

    var _insertRentHistory = function(data) {
        return BookLibraryDao.insertRentHistory(data);
    }

    var _selectRentHistory = function(data) {
        return BookLibraryDao.selectRentHistory(data);
    }

    var _getRegistSearch = function(data) {
        return new Promise(function(resolve, reject) {

            if (data.searchOpt == undefined || data.searchTxt == undefined)
                reject();

            var url = "https://openapi.naver.com/v1/search/book_adv.xml?" + data.searchOpt + "=" + data.searchTxt + "&display=50";
            url = encodeURI(url);

            axios.create({
                method: 'get',
                url: url,
                headers: {
                    'User-Agent': 'curl/7.43.0',
                    'X-Naver-Client-Id': 'gzDvG8ypz8FoBa27OGHP',
                    'X-Naver-Client-Secret': 'indsAW7t2X'
                }
            }).get(url).then(function(response) {

                digester.digest(response.data, function(err, result) {
                    if (err) {
                        console.log(err);
                        reject();
                    }
                    else {
                        var items = result.rss.channel.item;
                        var newItems = [];

                        _.each(items, function(item) {
                            var obj = {
                                'book_name': replaceAll(item.title),
                                'img_src': item.image,
                                'author': authorCut(replaceAll(item.author)),
                                'publisher': replaceAll(item.publisher),
                                'publishing_date': item.pubdate,
                                'isbn': item.isbn,
                                'price': item.price,
                                'manage_no': ''
                            };
                            newItems.push(obj);
                        });
                        resolve(newItems);
                    }
                })
            });
        });
    }

    var _getManageNo = function(data) {
        return new Promise(function(resolve, reject) {

            BookLibraryDao.selectManageNo(data).then(function(result) {

                var arr = [];
                _.each(result, function(item) {
                   arr.push(parseInt(item.manage_no.replace(data.manageno, '')));
                });

                console.log(arr);

                if (arr.length == 0)
                    resolve({manage_no: 1});

                if (arr.length == 1 && arr[0] != 1)
                    resolve({manage_no: 2});

                var currentNo = 0;
                for (var i = 1; i < arr.length; i++) {
                    var previousNo = arr[i - 1];
                    currentNo = arr[i];

                    if (previousNo == currentNo)
                        continue;

                    if (previousNo + 1 != currentNo) {
                        resolve({manage_no: previousNo + 1});
                    }
                }
                resolve({manage_no: currentNo + 1});
            });
        });
    }

    return {
        getBookLibrary: _getBookLibrary,
        deleteBookLibrary: _deleteBookLibrary,
        insertBookLibrary: _insertBookLibrary,
        insertRentBook: _insertRentBook,
        deleteRentBook: _deleteRentBook,
        insertRentHistory: _insertRentHistory,
        selectRentHistory: _selectRentHistory,
        getRegistSearch: _getRegistSearch,
        getManageNo: _getManageNo
    };
}
module.exports = new BookLibrary();
