if (typeof browser === "undefined") {
  var browser = chrome;
  var browser_action = browser.action
} else {
  var browser_action = browser.browserAction
}
const keys = ['linear algebra', 'electromagnetism and conduction', 'introduction to automation and control', 'structure of corporation']; // Define a list of keys
const alternativeKeys = ['analysis 1', 'introduction to classical mechanics', 'introduction to programming', 'general chemistry', 'philosophy, ethics and critical thinking']; // Définissez votre liste alternative ici

function onError(error) { // Define onError function
    console.log(`Error:${error}`);
}

function getOngoingEvent() {
  return new Promise(function(resolve, reject) {
    browser.storage.local.get('calendarEvents', function(result) {
      const events = result.calendarEvents;
  
      if (!events || events.length === 0) {
        console.log('No events found in local storage.');
        resolve("");
        return;
      }
  
      const now = new Date(); // Get the current time
  
      // Find ongoing event
      const ongoingEvent = events.find(event => {
        const startDate = new Date(event.start);  // Convert the stored string back to Date
        const endDate = new Date(event.end);
        return startDate <= now && endDate >= now;  // Check if current time is within the event duration
      });
  
      if (ongoingEvent) {
        resolve(ongoingEvent.summary.split(' -')[0].trim().toLowerCase());
        return;
      } else {
        console.log('No ongoing event at the moment.');
      }
      resolve("");
      
    });
  });
}

browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {// When a tab is updated
  var taburl = new URL(tab.url);
  if (taburl.host == "centralesupelec.edunao.com" && taburl.pathname == "/") {
    getOngoingEvent().then(ongoingEventName => {
      browser.scripting.executeScript({
        target: { tabId: tabId },
        args: [ongoingEventName, keys, alternativeKeys],
        function: (ongoingEvent, keys, alternativeKeys) => {
          const parentElement = document.querySelector(".courses");
          if (parentElement.classList.contains("reordered")) {
            return;
          }

          document.querySelector(".frontpage-block").remove();

          const children = Array.from(parentElement.children);
          const jsonDict = {};
  
          children.forEach((child, index) => {
            if (index === children.length - 1) {child.remove();return;}; // Skip the last element
            const key = child.firstChild.firstChild.firstChild.textContent.split(' -')[0].trim().toLowerCase();
            const value = child.textContent;
            jsonDict[key] = child;
            child.remove();
          });
          
          // Place the ongoing event first if it exists
          if (jsonDict.hasOwnProperty(ongoingEvent)) { // If the ongoingEventName exists in jsonDict
            jsonDict[ongoingEvent].firstChild.style.boxShadow = '0 0 20px #007ef3';
            parentElement.appendChild(jsonDict[ongoingEvent]); // Append the corresponding element to parentElement
            delete jsonDict[ongoingEvent]; // Remove the ongoingEventName
          }
          
          keys.forEach((key) => {
            if (jsonDict.hasOwnProperty(key)) { // If the key exists in jsonDict
              jsonDict[key].firstChild.style.boxShadow = '0 0 20px #910035';
              parentElement.appendChild(jsonDict[key]); // Append the corresponding element to parentElement
              delete jsonDict[key]; // Remove the key from jsonDict
            }
          });

          // Vérifiez si "linear algebra" est présent
          if (!jsonDict.hasOwnProperty('linear algebra')) {
            alternativeKeys.forEach((key) => {
              if (jsonDict.hasOwnProperty(key)) {
                jsonDict[key].firstChild.style.boxShadow = '0 0 20px #910035';
                parentElement.appendChild(jsonDict[key]);
                delete jsonDict[key];
              }
            });
          }
  
          // Add the remaining elements to parentElement
          Object.values(jsonDict).forEach((element) => {
            parentElement.appendChild(element);
          });
          
          parentElement.classList.add("reordered");
  
          console.log(jsonDict);
          console.log(parentElement);
        }
      });
    }, onError);
  }
});