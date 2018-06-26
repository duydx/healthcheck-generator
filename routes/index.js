var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var fs = require('fs');
var path = require('path');
var JSZip = require('jszip');
var Docxtemplater = require('docxtemplater');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/upload', function(req, res, next) {
  res.render('upload',{fileContent : ''});   
});

router.get('/reports', function(req, res, next) {
  // fs.readdir("C:\\Users\\ThinkPad\\Documents\\GitHub\\healthcheck-generator\\public\\upload\\", function(err, listfile){
  //   if (err) throw err;
  //   for (var i = 0 ; i < listfile.length; i++){
  //     console.log(listfile[i]);
  //   }
  // })
  var content = fs
    .readFileSync("C:\\Users\\ThinkPad\\Documents\\GitHub\\healthcheck-generator\\public\\upload\\raw.docx", 'binary');

var zip = new JSZip(content);

var doc = new Docxtemplater();
doc.loadZip(zip);

//set the templateVariables
doc.setData({
    first_name: 'Jerry',
    last_name: 'Dang',
    phone: '0652455478',
    description: 'Wecommit'
});

try {
    // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
    doc.render()
}
catch (error) {
    var e = {
        message: error.message,
        name: error.name,
        stack: error.stack,
        properties: error.properties,
    }
    console.log(JSON.stringify({error: e}));
    // The error thrown here contains additional information when logged with JSON.stringify (it contains a property object).
    throw error;
}

var buf = doc.getZip()
             .generate({type: 'nodebuffer'});

// buf is a nodejs buffer, you can either write it to a file or do anything else with it.
fs.writeFileSync("C:\\Users\\ThinkPad\\Documents\\GitHub\\healthcheck-generator\\public\\upload\\output.docx", buf);

  res.render('reports',{title : 'List all reports'});   
});

router.post('/upload', function(req, res, next) {
  var form = new formidable.IncomingForm();
  form.parse(req, function(err, fields, files){
    var oldpath = files.files.path;
    var newpath = "C:\\Users\\ThinkPad\\Documents\\GitHub\\healthcheck-generator\\public\\upload\\" + files.files.name;

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
