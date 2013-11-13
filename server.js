var express = require('express');
var fs = require('fs');
var config = require('./server/config.json');
var nicknames = require('./server/nicknames.js');
var glossary = require('./server/glossary.js');
var storage = require('./server/storage.js');
var bills = require('./server/bills.js');
var congressmen = require('./server/congressmen.js');

// Initialize node-localstorage
if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

var app = express();

app.get('/', function(req, res){
  res.send('hello world');
});

// nicknames.populate();
// glossary.populate();
// congressmen.populate();

storage.wordList = JSON.parse(localStorage.getItem('wordList'));
storage.glossary = JSON.parse(localStorage.getItem('glossary'));
storage.nicknames = JSON.parse(localStorage.getItem('nicknames'));
storage.congressmen = JSON.parse(localStorage.getItem('congressmen'));

app.get('/test', function(req, res) {
  // bills.retrieve(req.params.id);
  congressmen.populate();
});

app.get('/refresh', function(req, res){
  nicknames.populate();
  glossary.populate();
  congressmen.populate();
  setTimeout(function() {
    localStorage.setItem('wordList', JSON.stringify(storage.wordList));
    localStorage.setItem('glossary', JSON.stringify(storage.glossary));
    localStorage.setItem('nicknames', JSON.stringify(storage.nicknames));
    localStorage.setItem('congressmen', JSON.stringify(storage.congressmen));
  }, 5000);
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
    name: word,
    def: storage.glossary[word]
  }));
  console.log(storage.glossary[word]);
});

app.get('/congressmen/:id', function(req, res){
  var id = req.params.id;
  congressmen.retrieveByID(id, res);
});

app.get('/congressmen/img/:id', function(req, res){
  console.log("Serving picture!");
  var id = req.params.id;
  res.send(fs.readFileSync(__dirname+'/server/assets/pics/' + id + ".jpg"));
});

app.listen(8080);
