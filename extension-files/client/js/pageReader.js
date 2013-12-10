chrome.runtime.sendMessage({
  method: "page.sendText",
  data: document.body.innerText
});
