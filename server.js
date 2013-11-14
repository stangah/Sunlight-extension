var express = require('express'),
    fs = require('fs'),
    config = require('./server/config.json'),
    nicknames = require('./server/nicknames.js'),
    glossary = require('./server/glossary.js'),
    storage = require('./server/storage.js'),
    bills = require('./server/bills.js'),
    congressmen = require('./server/congressmen.js'),
    app = express();

// Initialize node-localstorage
if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

// Initialize from localStorage if available
storage.wordList = JSON.parse(localStorage.getItem('wordList')) || {};
storage.glossary = JSON.parse(localStorage.getItem('glossary')) || {};
storage.nicknames = JSON.parse(localStorage.getItem('nicknames')) || {};
storage.congressmen = JSON.parse(localStorage.getItem('congressmen')) || {};

// Proper case-ness
String.prototype.toProperCase = function () {
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

app.get('/', function(req, res){
  res.send('hello world');
});

// app.get('/test', function(req, res) {
//   bills.retrieve(req.params.id);
//   congressmen.populate();
// });

//Manual refresh of list
app.get('/refresh', function(req, res){
  nicknames.populate();
  glossary.populate();
  congressmen.populate();

  // Ugly, but it works
  setTimeout(function() {
    localStorage.setItem('wordList', JSON.stringify(storage.wordList));
    localStorage.setItem('glossary', JSON.stringify(storage.glossary));
    localStorage.setItem('nicknames', JSON.stringify(storage.nicknames));
    localStorage.setItem('congressmen', JSON.stringify(storage.congressmen));
    console.log('saved');
  }, 7000);

  res.send();
});

app.get('/list', function(req, res){
  res.send(JSON.stringify(storage.wordList));
});

app.get('/bills/:id', function(req, res){
  var id = req.params.id;
  bills.retrieve(id, res);
});

app.get('/glossary/:word', function(req, res){
  var word = req.params.word.toLowerCase();
  res.send(JSON.stringify({
    name: word.toProperCase(),
    def: storage.glossary[word]
  }));
  // console.log(storage.glossary[word]);
});

app.get('/congressmen/:id', function(req, res){
  var id = req.params.id;
  congressmen.retrieveByID(id, res);
});

app.get('/congressmen/img/:id', function(req, res){
  var id = req.params.id;
  // console.log("Serving picture!");
  res.send(fs.readFileSync(__dirname+'/server/assets/pics/' + id + ".jpg"));
});

app.listen(8080);
