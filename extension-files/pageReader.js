chrome.runtime.onMessage.addListener(function(req, sender, sendResponse) {
  if (req.greeting === 'gimme') {
    console.log('giving text!');
    chrome.runtime.sendMessage({
      method: "page.sendText",
      data: document.body.innerText
    });
  }
});

console.log('pageReader checking in!');
