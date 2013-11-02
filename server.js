var express = require('express');
var config = require('./server/config.json');
var nicknames = require('./server/nicknames.js');
var glossary = require('./server/glossary.js');
var storage = require('./server/storage.js');
var app = express();

app.get('/', function(req, res){
  res.send('hello world');
});

nicknames.populate();
glossary.populate();

app.get('/refresh', function(req, res){
  nicknames.populate();
  glossary.populate();
  res.send();
});

app.get('/list', function(req, res){
  res.send(JSON.stringify(storage.wordList));
});

app.get('/bills/:nickname', function(req, res){
  var nickname = req.params.nickname;
  res.send(JSON.stringify(storage.bills[nickname]));
});

app.get('/glossary/:word', function(req, res){
  var word = req.params.word;
  res.send(JSON.stringify(storage.glossary[word]));
});

app.listen(8080);