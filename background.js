console.log("Content Script: Received readAllText message"); 
 
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) { 
  if (request.action === "readAllText") { 
    console.log("Content Script: Received readAllText message"); 
 
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

    const xpath = '//input[@name="location"]';  
    const allText = document.body.innerText;  
    const inputFieldValue = getInputFieldValueByXpath(xpath); 
 
    getInputFieldValueByXpath(xpath).then((inputFieldValue) => {
      console.log("Content Script: Input Field Value", inputFieldValue);
      chrome.runtime.sendMessage({ action: "sendAllText", allText, inputFieldValue });
    });

  } 
});
