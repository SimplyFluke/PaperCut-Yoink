console.log("Content Script Executed");

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "readAllText") {
    console.log("Content Script: Received readAllText message");

    // Function to wait for the input field to be populated
    function waitForInputField() {
      console.log("Content Script: Waiting for Input Field");

      const inputField = document.querySelector("input[name='location']");
      const inputFieldValue = inputField ? inputField.value : null;

      console.log("Content Script: Input Field Value", inputFieldValue);

      if (inputFieldValue !== null) {
        // Input field is populated, send the message to the background script
        chrome.runtime.sendMessage({ action: "sendAllText", allText, inputFieldValue });
      } else {
        // Input field is not populated yet, wait for a short delay and try again
        setTimeout(waitForInputField, 500);
      }
    }

    // Retrieve the main text from the body
    const allText = document.body.innerText;

    // Start waiting for the input field
    waitForInputField();
  }
});
