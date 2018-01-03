const path = require('path');
const vm = require('vm');
var express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
var multer = require("multer");
var pug = require('pug');
var markdown = require('markdown').markdown;

app.use(bodyParser.urlencoded( { extended: false }));
app.use(multer({dest: './tmp/'}).single('file'));

app.get('/up.html', function (req, res) {
    res.sendFile(__dirname + "/" + "up.html");
});

app.post('/file_upload', function (req, res) {
    var file = __dirname + "/" + req.file.originalname;

    fs.readFile(req.file.path, function (err, data) {
        fs.writeFile(file, data, function (err) {
            if (err) {
                console.log(err);
            } else {
                response = {
                    message: 'Success!',
                    filename: req.file.originalname
                };
            }
            console.log(response);
            res.end(JSON.stringify(response));
        });
    });
});



class Blog {
  constructor(fs, app, markdown) {
    let readURL = Blog.readURL(fs);
    let url_array = readURL.url;
    let filename_array = readURL.filename;
    for (var v = 0; v < url_array.length; ++v) {
      app.get('/' + url_array[v], function(req, res){
        for (var w = 0; w < url_array.length; ++w) {
          if (('/' + url_array[w]) == req.url) {
            res.sendFile(__dirname + '/html/' + filename_array[w]);
            break;
          }
        }
      });
    }
    
    app.post('/plugin', function(req, res) {
      let pluginsDir = path.join(__dirname, 'plugins');
      let pluginObjects = [];
      fs.readdirSync(pluginsDir).forEach(file => {
        if (path.extname(file) !== '.js') {
          return;
        }
        pluginObjects.push( path.join(pluginsDir, file));
      });

      let result = '';
      for (var v = 0; v < pluginObjects.length; ++v) {
        var obj = Blog.loadObject(fs, pluginObjects[v]);
        var pluginTest = new obj();
        result += pluginTest.print('hoge') + '<br>';
      }
      res.send(result);
    });
    app.post('/preview', function(req, res) {
      var contents = decodeURI(req.body.textarea2);
      var contents2 = contents.replace(/sssss/g, 'script' );
      fs.writeFile('edit_article.html', contents2,
        (error) => {
          if (error) {
            console.log(error);
          }
        }
      );
      res.send(contents2);
    });
    app.post('/createURL', function(req, res) {
      var url = req.body.link;
      var name = req.body.textarea2;
      var title = req.body.title;
      app.get('/' + url, function(req, res) {
        let readURL = Blog.readURL(fs);
        let url_array = readURL.url;
        let filename_array = readURL.filename;
    
        let onceFlag = true;
        let fileIndex = 0;
        for (let v = 0; v < url_array.length; ++v) {
          if (url == url_array[v]) {
            fileIndex = v;
            onceFlag = false;
          }
        }

        if (onceFlag) {

          var nowTime = new Date();
          var time = nowTime.getFullYear();
          time += ('0' + (nowTime.getMonth() + 1)).slice(-2);
          time += ('0' + nowTime.getDate()).slice(-2);
          time += ('0' + nowTime.getHours()).slice(-2);
          time += ('0' + nowTime.getMinutes()).slice(-2);
          time += ('0' + nowTime.getSeconds()).slice(-2);
          var contents = decodeURI(name);
          var contents2 = contents.replace(/sssss/g, 'script' );
          fs.appendFileSync('html/' + time + '.html', contents2);
          fs.appendFileSync('url.txt', url + ' ' + time + '.html ' + title + '\n');
          res.sendFile(__dirname + '/html/' + time + '.html');
        } else {
          res.sendFile(__dirname + '/html/' + filename_array[fileIndex]);
        }
      });
      res.redirect(url);
    });
    app.post('/home', function(req, res) {
      var contents = decodeURI(req.body.textarea2);
      var contents2 = contents.replace(/sssss/g, 'script' );
      fs.writeFile('edit_article.html', contents2,
        (error) => {
          if (error) {
            console.log(error);
          }
        }
      );
      res.sendFile(__dirname + '/home/write_article.html');
    });
    app.get('/home', function(req, res) {
      res.sendFile(__dirname + '/home/home.html');
    });
    app.get('/home.css', function(req, res) {
      res.sendFile(__dirname + '/home/home.css');
    });
    app.get('/home_client.js', function(req, res) {
      res.sendFile(__dirname + '/home/home_client.js');
    });
    app.get('/loader.js', function(req, res) {
      res.sendFile(__dirname + '/home/loader.js');
    });
    app.get('/top.html', function(req, res) {
      res.sendFile(__dirname + '/home/top.html');
    });
    app.get('/image_upload.html', function(req, res) {
      res.sendFile(__dirname + '/home/image_upload.html');
    });
    app.get('/image_upload.js', function(req, res) {
      res.sendFile(__dirname + '/home/image_upload.js');
    });
    app.get('/setting.html', function(req, res) {
      res.sendFile(__dirname + '/home/setting.html');
    });
    app.get('/setting.js', function(req, res) {
      res.sendFile(__dirname + '/home/setting.js');
    });
    app.get('/plugin.html', function(req, res) {
      res.sendFile(__dirname + '/home/plugin.html');
    });
    app.get('/plugin.js', function(req, res) {
      res.sendFile(__dirname + '/home/plugin.js');
    });
    app.get('/write_article.html', function(req, res) {
      res.sendFile(__dirname + '/home/write_article.html');
    });
    app.get('/write_article.js', function(req, res) {
      res.sendFile(__dirname + '/home/write_article.js');
    });
    app.get('/article_list.html', function(req, res) {
      res.sendFile(__dirname + '/home/article_list.html');
    });
    app.get('/article_list.js', function(req, res) {
      res.sendFile(__dirname + '/home/article_list.js');
    });
    app.get('/url.txt', function(req, res) {
      res.sendFile(__dirname + '/url.txt');
    });
    app.get('/edit_article.html', function(req, res) {
      res.sendFile(__dirname + '/edit_article.html');
    });
  }
  static readURL(fs) {
    var url_filename = fs.readFileSync('url.txt', 'utf8');
    var begin = 0;
    var end = 0;
    var url_array = [];
    var filename_array = [];

    while (-1 != ( end = url_filename.indexOf(' ', begin) ) ) {
      url_array.push( url_filename.substring(begin, end) );
      begin = end + 1;
      end = url_filename.indexOf(' ', begin);
      filename_array.push( url_filename.substring(begin, end) );
      begin = end + 1;
      end = url_filename.indexOf('\n', begin);
      //title array url_filename
      begin = end + 1;
    }
    return {url:url_array, filename:filename_array};
  }
  static loadObject (fs, file) {
    var sandbox = {};
    var script = vm.createScript(fs.readFileSync(file, 'utf8'), file);
    script.runInNewContext(sandbox);
    return sandbox.exports;
  };
};



const http = require('http').Server(app);

var blog = new Blog(fs, app, markdown);

http.listen(8080);
