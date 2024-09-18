if (typeof browser === "undefined") {
  var browser = chrome;
  var browser_action = browser.action
} else {
  var browser_action = browser.browserAction
}


function onError(error) { // Define onError function
    console.log(`Error:${error}`);
}

browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {// When a tab is updated
  var taburl = new URL(tab.url);
  if (taburl.host == "centralesupelec.edunao.com" && taburl.pathname == "/") {
    browser.scripting.executeScript({
      target: { tabId: tabId },
      function: () => {
        const parentElement = document.querySelector(".courses");
        if (parentElement.classList.contains("reordered")) {
          return;
        }
        const children = Array.from(parentElement.children);
        const jsonDict = {};

        // const allcourses = children[-1];

        children.forEach((child, index) => {
          if (index === children.length - 1) {child.remove();return;}; // Skip the last element
          const key = child.firstChild.firstChild.firstChild.textContent.split(' -')[0].trim().toLowerCase();
          const value = child.textContent;
          jsonDict[key] = child;
          child.remove();
        });

        

        const keys = ['linear algebra', 'electromagnetism and conduction', 'introduction to automation and control', 'structure of corporation']; // Define a list of keys

        keys.forEach((key) => {
          if (jsonDict.hasOwnProperty(key)) { // If the key exists in jsonDict
            parentElement.appendChild(jsonDict[key]); // Append the corresponding element to parentElement
            delete jsonDict[key]; // Remove the key from jsonDict
          }
        });

        // Add the remaining elements to parentElement
        Object.values(jsonDict).forEach((element) => {
          parentElement.appendChild(element);
        });
        
        // parentElement.appendChild(allcourses);

        parentElement.classList.add("reordered");

        console.log(jsonDict);
        console.log(parentElement);
      }
    });
  }
  
});
