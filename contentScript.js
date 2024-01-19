chrome.runtime.sendMessage({ action: "contentMessage", message: "Hello from Content!" });

console.log("Content Script Executed");

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "backgroundMessage") {
    const message = request.message;
    console.log("Content Script: Received Message from Background:", message);
  }
});
