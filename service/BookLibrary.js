var _ = require("underscore");
var debug = require('debug')('BookLibrary');
var Promise = require('bluebird');
var BookLibraryDao = require('../dao/bookLibraryDao.js');
var xml_digester = require("xml-digester");
var digester = xml_digester.XmlDigester({});
var https = require('https');
var util = require('../lib/util.js');
var fs = require('fs');
var path = require("path");

//검색어를 <b>로 처리하고 있어 삭제
//제목과 별개로 부제목은 () 안에 들어감 부제목은 삭제
var replaceAll = function (value) {
  //값이 없을때 {}로 넘어옴.
  if (typeof value == 'object')
    return "";

  return value.replace(/<b>/gi, "").replace(/<\/b>/gi, "").replace(/\(.*\)/gi, "");
};

//저자가 여러명인 책들 첫번재 제외 다 자름.
var authorCut = function (value) {
  var authors = value.split("|");
  if (authors.length > 0)
    return authors[0];
  else
    return value;
}

var imgCut = function (value) {
  if (typeof value == 'object')
    return "";

  var imgStr = value.split("?");
  if (imgStr.length > 0)
    return imgStr[0];
  else
    return value;
}

var BookLibrary = function () {
  var _getBookLibrary = function () {
    return BookLibraryDao.selectBookLibrary();
  };

  var _deleteBookLibrary = function (data) {
    return BookLibraryDao.deleteBookLibrary(data);
  }

  var _insertBookLibrary = function (data) {
    return BookLibraryDao.insertBookLibrary(data);
  }

  var _insertRentBook = function (data) {
    return BookLibraryDao.insertRentBook(data);
  }

  var _deleteRentBook = function (data) {
    return BookLibraryDao.deleteRentBook(data);
  }

  var _insertRentHistory = function (data) {
    return BookLibraryDao.insertRentHistory(data);
  }

  var _selectRentHistory = function (data) {
    return BookLibraryDao.selectRentHistory(data);
  }

    // 도서 미반납자에게 메일 전달
  var _sendEmailRentOverDueDate = function() {
    debug("START Send Email Rent Over Due Date....");
    BookLibraryDao.selectBookLibraryOverDueDate().then(function(result) {
      var transport = util.getEmailTransport();

      fs.readFileAsync(path.dirname(module.parent.parent.filename) + "/views/bookOverDueDateFormat.html","utf8").then(function (html) {
        for (var book of result) {
          debug("ready for send mail : " + book.manage_no + " : " + book.book_name);

          // 이메일 HTML 셋팅
          var template=_.template(html);
          var sendHTML=template(book);

          var mailOptions= {
            from: 'webmaster@yescnc.co.kr', // sender address 
            to: [{ name :book.rent_user_name, address: book.rent_user_email }],
            subject:"[도서반납] " + book.book_name,
            html:sendHTML,
            text:"",
            cc: [] // 참조 보내지 말아달라는... { name :"김은영", address: "eykim@yescnc.co.kr" }
          };

          transport.sendMail(mailOptions, function(error, info){
            if(error){//메일 보내기 실패시 
              console.log(error);
            }else{
              debug("END Send Email Rent Over Due Date....");
            }
          });    
        }
      });
    });
  }

  var _getRegistSearch = function (data) {
    return new Promise(function (resolve, reject) {

      if (data.searchOpt == undefined || data.searchTxt == undefined)
        reject();

      var url = "/v1/search/book_adv.xml?" + data.searchOpt + "=" + data.searchTxt + "&display=50";
      url = encodeURI(url);

      var options = {
        hostname: 'openapi.naver.com',
        path: url,
        method: 'GET',
        headers: {
          'User-Agent': 'curl/7.49.1',
          'Accept': '*/*',
          'X-Naver-Client-Id': 'gzDvG8ypz8FoBa27OGHP',
          'X-Naver-Client-Secret': 'indsAW7t2X'
        }
      };

      var req = https.request(options, function (res) {
        var bd = [];

        res.on('data', function (d) {
          bd.push(d);
        });

        res.on('end', function () {
          digester.digest(Buffer.concat(bd).toString(), function (err, result) {
            if (err) {
              console.log(err);
              reject();
            }
            else {
              var total = result.rss.channel.total;
              var items = result.rss.channel.item;
              var newItems = [];

              if (total == 1) {
                var obj = {
                  'book_name': replaceAll(items.title),
                  'img_src': imgCut(items.image),
                  'author': authorCut(replaceAll(items.author)),
                  'publisher': replaceAll(items.publisher),
                  'publishing_date': items.pubdate,
                  'isbn': items.isbn,
                  'price': items.price,
                  'manage_no': ''
                };
                newItems.push(obj);
              }
              else if (total > 1) {
                _.each(items, function (item) {
                  var obj = {
                    'book_name': replaceAll(item.title),
                    'img_src': imgCut(item.image),
                    'author': authorCut(replaceAll(item.author)),
                    'publisher': replaceAll(item.publisher),
                    'publishing_date': item.pubdate,
                    'isbn': item.isbn,
                    'price': item.price,
                    'manage_no': ''
                  };
                  newItems.push(obj);
                });
              }
              resolve(newItems);
            }
          })
        });
      });

      req.on('error', function (e) {
        console.error(e);
      });

      req.end();
    });
  }

  var _getManageNo = function (data) {
    return new Promise(function (resolve, reject) {

      BookLibraryDao.selectManageNo(data).then(function (result) {

        var arr = [];
        _.each(result, function (item) {
          arr.push(parseInt(item.manage_no.replace(data.manageno, '')));
        });

        if (arr.length == 0)
          resolve({ manage_no: 1 });

        if (arr.length == 1 && arr[0] != 1)
          resolve({ manage_no: 2 });

        var currentNo = 0;
        for (var i = 1; i < arr.length; i++) {
          var previousNo = arr[i - 1];
          currentNo = arr[i];

          if (previousNo == currentNo)
            continue;

          if (previousNo + 1 != currentNo) {
            resolve({ manage_no: previousNo + 1 });
          }
        }
        resolve({ manage_no: currentNo + 1 });
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
    getManageNo: _getManageNo,
    sendEmailRentOverDueDate: _sendEmailRentOverDueDate
  };
}
module.exports = new BookLibrary();
