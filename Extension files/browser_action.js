var sendGreeting = function() {
  chrome.runtime.sendMessage({
    greeting: "hello",
    var1: "variable 1"
  });
};

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.greeting == "hello") {
      console.log(request.var1);
    } ./*else if (request.greeting == "page-reader") {
      alert(request.var1);
    }*/
  });

document.addEventListener('DOMContentLoaded', function() {
    var link = document.getElementById('link');
    // onClick's logic below:
    link.addEventListener('click', function() {
      sendGreeting();
    });
});