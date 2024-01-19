console.log("Background Script Executed");

let receivedAllText;

chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: sendTextToContentScript,
  });
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "contentMessage") {
    const message = request.message;
    console.log("Background Script: Received Message from Content Script:", message);
  }
});

function sendTextToContentScript() {
  const message = "Hello from Background!";
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, { action: "backgroundMessage", message });
  });
}


function processClipboardText(clip, tabId) {
  // Your existing code for processing the clipboard text
  clip = clip.trim().replace(/\r/g, "").split("\n").slice(20, 60);

  const lopenummer = clip[clip.indexOf("Physical identifier") + 1].match(/TKP\d+/)[0];
  const locationInfo = clip[clip.indexOf("Location/Department") + 1].split(",");
  const rom = clip[clip.indexOf("Location/Department") + 1].split(",").slice(2, 5);
  let tmp = "";

  rom.forEach(item => {
    item = item.trim();
    tmp += `${item},`;
  });

  const resultText = `Enhet: ${locationInfo[0]}\nAdresse: ${locationInfo[1]}\nEtg./Rom: ${tmp.slice(0, -1).toLowerCase().capitalize()}\nLøpenummer: ${lopenummer}\nModell: ${clip[clip.indexOf('Type/Model') + 1]}`;

  // Copy the processed text to the clipboard using chrome.scripting
  chrome.scripting.executeScript({
    target: { tabId: tabId },
    function: copyToClipboard,
    args: [resultText],
  });
}

function copyToClipboard(text) {
  document.addEventListener('copy', function (e) {
    e.clipboardData.setData('text/plain', text);
    e.preventDefault();
  });
  document.execCommand('copy');
}

String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};
