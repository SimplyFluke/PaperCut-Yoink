console.log("Content Script: Received readAllText message"); 
 
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) { 
  if (request.action === "readAllText") { 
    console.log("Content Script: Received readAllText message"); 
 
    // Function to retrieve the input field value using XPATH 
    function getInputFieldValueByXpath(xpath, delay = 2000) {
      return new Promise((resolve) => {
        setTimeout(() => {
          let element = null;

          // Search in iframes first
          const iframes = document.getElementsByTagName('iframe');
          for (let i = 0; i < iframes.length; i++) {
            const iframeDoc = iframes[i].contentDocument || iframes[i].contentWindow.document;
            element = iframeDoc.evaluate(
              xpath,
              iframeDoc,
              null,
              XPathResult.FIRST_ORDERED_NODE_TYPE,
              null
            ).singleNodeValue;
            if (element) {
              break;
            }
          }

          // If the element wasn't found in the iframes, search in the main document
          if (!element) {
            element = document.evaluate(
              xpath,
              document,
              null,
              XPathResult.FIRST_ORDERED_NODE_TYPE,
              null
            ).singleNodeValue;
          }

          console.log(element);
          resolve(element ? element.value : null);
        }, delay);
      });
    }
 
    // XPATH for the input field 
    const xpath = '//input[@name="location"]'; 
 
    // Retrieve the main text from the body 
    const allText = document.body.innerText; 
 
    // Retrieve the input field value using XPATH 
    const inputFieldValue = getInputFieldValueByXpath(xpath); 
 
    // Retrieve the input field value using XPATH
    getInputFieldValueByXpath(xpath).then((inputFieldValue) => {
      console.log("Content Script: Input Field Value", inputFieldValue);

      // Send the message directly to the background script
      chrome.runtime.sendMessage({ action: "sendAllText", allText, inputFieldValue });
    });

  } 
});
