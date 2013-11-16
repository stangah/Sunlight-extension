var express = require('express'),
    fs = require('fs'),
    config = require('./server/config.json'),
    nicknames = require('./server/nicknames.js'),
    glossary = require('./server/glossary.js'),
    storage = require('./server/storage.js'),
    bills = require('./server/bills.js'),
    congressmen = require('./server/congressmen.js'),
    app = express();
    port = process.env.PORT || 8080;

// Initializes node-localstorage
if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

!localStorage.getItem('wordList') && refreshData();

// Populates data from localStorage if available
storage.wordList = JSON.parse(localStorage.getItem('wordList')) || {};
storage.glossary = JSON.parse(localStorage.getItem('glossary')) || {};
storage.nicknames = JSON.parse(localStorage.getItem('nicknames')) || {};
storage.congressmen = JSON.parse(localStorage.getItem('congressmen')) || {};

//Manually refreshes list
app.get('/refresh', function(req, res){
  refreshData();
  res.send(200);
});

app.get('/list', function(req, res){
  res.json(200, storage.wordList);
});

app.get('/bills/:id', function(req, res){
  var id = req.params.id;
  bills.retrieve(id, res);
});

app.get('/glossary/:word', function(req, res){
  var word = req.params.word.toLowerCase();

  res.json(200, {
    name: word,
    def: storage.glossary[word]
  });
});

app.get('/congressmen/:id', function(req, res){
  var id = req.params.id;
  congressmen.retrieveByID(id, res);
});

app.get('/congressmen/img/:id', function(req, res){
  var id = req.params.id;
  res.send(200, fs.readFileSync(__dirname+'/assets/pics/' + id + ".jpg"));
});

var refreshData = function() {
  nicknames.populate();
  glossary.populate();
  congressmen.populate();

  // Delays storage of data in local storage until responses have returned
  setTimeout(function() {
    localStorage.setItem('wordList', JSON.stringify(storage.wordList));
    localStorage.setItem('glossary', JSON.stringify(storage.glossary));
    localStorage.setItem('nicknames', JSON.stringify(storage.nicknames));
    localStorage.setItem('congressmen', JSON.stringify(storage.congressmen));
    console.log('saved');
  }, 10000);
};

app.listen(port);
