console.log('pageReader checking in!');

chromely.send('page-reader', document.body.innerText);

chromely.send('hihi', []);

chrome.runtime.onMessage.addListener('gimme', function(req, sender, sendResponse) {
  sendResponse(document.body.innerText);
});

// chrome.runtime.sendMessage({
//   greeting: "page-reader",
//   var1: document.body.innerText
// });

// function getText(){
//     return document.body.innerText;
// }

// console.log(getText());

