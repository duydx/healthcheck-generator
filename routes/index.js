var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var fs = require('fs');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/upload', function(req, res, next) {
  res.render('upload',{fileContent : ''});   
});

router.post('/upload', function(req, res, next) {
  var form = new formidable.IncomingForm();
  form.parse(req, function(err, fields, files){
    var oldpath = files.files.path;
    var newpath = "C:\\Users\\ThinkPad\\Documents\\upload\\" + files.files.name;

    console.log(oldpath);
    console.log(newpath);
    fs.rename(oldpath, newpath, function (err) {
      if (err) throw err;
      console.log("File uploaded!");
      res.render('upload',{fileContent : 'Đã upload thành công'});   
    });
  })
});

module.exports = router;
