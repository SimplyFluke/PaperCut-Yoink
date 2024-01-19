console.log("Background Script Executed");

let receivedAllText;

chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: sendTextToContentScript,
  });
});

chrome.runtime.onMessage.addListener((request, sender) => {
  console.log("Background Script: Received Message", request);

  if (request.action === "sendAllText" && sender.tab) {
    receivedAllText = request.allText;
    const inputFieldValue = request.inputFieldValue;
    console.log('Received All Text in Background:', receivedAllText);
    console.log('Received input: ', inputFieldValue);

    // Check if the URL contains the expected substring
    if (sender.tab.url.toLowerCase().includes("ansatt")) {
      console.log("Background Script: Checking URL - URL includes 'ansatt'");
      processClipboardText(receivedAllText, sender.tab.id);
    } else {
      console.log("Background Script: Checking URL - URL does not include 'ansatt'");
    }
  }
});

function sendTextToContentScript() {
  const allText = document.body.innerText;
  console.log("Background Script: Sending Message to Content Script");
  chrome.runtime.sendMessage({ action: "sendAllText", allText });
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


// // Input box from hell: // // 

// Full XPATH: /html/body/div[5]/div[2]/div/div/div[2]/div[2]/table/tbody/tr[2]/td[2]/form/table/tbody/tr[1]/td/p[4]/input
// JS Path: document.querySelector("#content > div > div > div.tabContent > div.box > table > tbody > tr:nth-child(2) > td.box-content > form > table > tbody > tr:nth-child(1) > td > p:nth-child(5) > input[type=text]")
// Outer HTML: <input type="text" name="location" value="Sletten barnehage, Hallsetvegen 8, sokkel - innenfor arbeidsrom" size="40" maxlength="255">
// Selector: #content > div > div > div.tabContent > div.box > table > tbody > tr:nth-child(2) > td.box-content > form > table > tbody > tr:nth-child(1) > td > p:nth-child(5) > input[type=text]
// Element: <input type="text" name="location" value="Sletten barnehage, Hallsetvegen 8, sokkel - innenfor arbeidsrom" size="40" maxlength="255">
