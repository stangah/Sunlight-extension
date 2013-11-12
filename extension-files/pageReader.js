console.log('pageReader checking in!');

// chromely.send('page-reader', document.body.innerText);

// chromely.send('hihi', []);

chrome.runtime.onMessage.addListener(function(req, sender, sendResponse) {
  if (req.greeting === 'gimme') {
    console.log('giving!');
    chrome.runtime.sendMessage({
      method: "page.sendText",
      data: document.body.innerText
    });
  }
});

// chrome.runtime.sendMessage({
//   greeting: "page-reader",
//   var1: document.body.innerText
// });

// function getText(){
//     return document.body.innerText;
// }

// console.log(getText());

