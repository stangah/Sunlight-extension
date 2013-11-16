chrome.runtime.onMessage.addListener(function(req, sender, sendResponse) {
  if (req.greeting === 'gimme') {
    chrome.runtime.sendMessage({
      method: "page.sendText",
      data: document.body.innerText
    });
  }
});
