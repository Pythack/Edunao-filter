if (typeof browser === "undefined") {
  var browser = chrome;
  var browser_action = browser.action
} else {
  var browser_action = browser.browserAction
}

const keys = ['linear algebra', 'electromagnetism and conduction', 'introduction to automation and control', 'structure of corporation']; // 2A courses
const alternativeKeys = ['analysis 1', 'classical mechanics', 'introduction to programming', 'general chemistry', 'philosophy, ethics and critical thinking']; // 1A courses

function onError(error) { // Define onError function
    console.log(`Error:${error}`);
}

function getOngoingEvent() { // Function to get the ongoing event
  return new Promise(function(resolve, reject) { // Promise is necessary to handle asynchronous operations
    browser.storage.local.get('calendarEvents', function(result) { // Get the stored calendar events
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
        let result = ongoingEvent.summary.split(' -')[0].trim().toLowerCase();
        resolve(result); // Take the first part of the event name (used for identification in the html) and convert it to lowercase
        return;
      } else {
        console.log('No ongoing event at the moment.');
      }
      resolve("");
      
    });
  });
}

browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => { // When a tab is updated
  var taburl = new URL(tab.url);
  if (taburl.host == "centralesupelec.edunao.com" && taburl.pathname == "/") { // Check if the tab is Edunao
    getOngoingEvent().then(ongoingEventName => { // Get the ongoing event (empty string if none)
      browser.scripting.executeScript({ // Inject the following script into the tab
        target: { tabId: tabId },
        args: [ongoingEventName, keys, alternativeKeys],
        function: (ongoingEvent, keys, alternativeKeys) => {
          const parentElement = document.querySelector(".courses"); // Get the courses' list's container
          if (parentElement.classList.contains("reordered")) { // Listener is triggered about 3 times when the page is loaded, so we need to check if the elements have already been reordered
            return;
          }

          document.querySelector(".frontpage-block").remove(); // Remove the useless Edunao welcome message

          const children = Array.from(parentElement.children);
          const jsonDict = {};
  
          children.forEach((child, index) => {
            if (index === children.length - 1) {child.remove();return;}; // Skip the last element which is the "Tous les cours" button
            const key = child.firstChild.firstChild.firstChild.textContent.split(' -')[0].trim().toLowerCase(); // Get the first part of the course name and convert it to lowercase
            const value = child.textContent;
            jsonDict[key] = child;
            child.remove();
          });
          
          // Place the ongoing event first if it exists
          if (jsonDict.hasOwnProperty(ongoingEvent)) { // If there is an ongoing event
            jsonDict[ongoingEvent].firstChild.style.boxShadow = '0 0 20px #007ef3'; // Add a blue shadow to the element
            parentElement.appendChild(jsonDict[ongoingEvent]); // Append the corresponding element to parentElement
            delete jsonDict[ongoingEvent]; // Remove the ongoingEventName
          }
          
          if (!jsonDict.hasOwnProperty('linear algebra')) { // If linear algebra is not in the list so the use is 1A then put the 1A courses on top
            alternativeKeys.forEach((key) => {
              if (jsonDict.hasOwnProperty(key)) {
                jsonDict[key].firstChild.style.boxShadow = '0 0 20px #910035';
                parentElement.appendChild(jsonDict[key]);
                delete jsonDict[key];
              }
            });
          } else {
            keys.forEach((key) => {
              if (jsonDict.hasOwnProperty(key)) { // If the key exists in jsonDict
                jsonDict[key].firstChild.style.boxShadow = '0 0 20px #910035'; // Add a red shadow to the element
                parentElement.appendChild(jsonDict[key]); // Append the corresponding element to parentElement
                delete jsonDict[key]; // Remove the key from jsonDict
              }
            });
          }

          

  
          // Add the remaining elements to parentElement
          Object.values(jsonDict).forEach((element) => {
            parentElement.appendChild(element);
          });
          
          parentElement.classList.add("reordered"); // Add the reordered class to the parentElement so that we know it has been reordered (this is added at the end so that if an error occurs the code will retry upon next listener trigger)
        }
      });
    }, onError);
  }
});