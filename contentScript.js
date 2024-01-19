console.log("Content Script Executed");

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "readAllText") {
    console.log("Content Script: Received readAllText message");

    // Use the provided JS path to locate the input field
    const inputField = document.querySelector("#content > div > div > div.tabContent > div.box > table > tbody > tr:nth-child(2) > td.box-content > form > table > tbody > tr:nth-child(1) > td > p:nth-child(5) > input[type=text]");
    const inputFieldValue = inputField ? inputField.value : null;

    console.log("Content Script: Input Field Value", inputFieldValue);

    // Send the message to the background script
    chrome.runtime.sendMessage({ action: "sendAllText", allText, inputFieldValue });
  }
});
