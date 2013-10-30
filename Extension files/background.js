var sendBackGreeting = function() {
  chrome.runtime.sendMessage({
    greeting: "hello",
    var1: "Sending back!"
  });
};

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.greeting == "hello") {
      sendBackGreeting();
    } else if (request.greeting == "page-reader") {
      console.log(request.var1);
    }
  });


console.log('background checking in!');

function getText(){
    return document.body.innerText;
}

console.log(getText());
