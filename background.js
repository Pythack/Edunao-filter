if (typeof browser === "undefined") {
  var browser = chrome;
  var browser_action = browser.action
} else {
  var browser_action = browser.browserAction
}
const keys = ['linear algebra', 'electromagnetism and conduction', 'introduction to automation and control', 'structure of corporation']; // Define a list of keys


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


// async function refreshICal() {
//   try {
//     const result = await browser.storage.local.get('ICALURL');
//     const url = "https://corsproxy.io/?" + result.ICALURL;

//     console.log(url);
    

//     // Fetch the .ics file from the given URL
//     const response = await fetch(url);
//     const icalText = await response.text();
    
//     // Parse the .ics file using ical.js
//     const jcalData = ICAL.parse(icalText);
//     const comp = new ICAL.Component(jcalData);
//     const vevents = comp.getAllSubcomponents('vevent');
  
//     // Prepare an array to store the optimized event details
//     const eventsData = [];
  
//     // Extract and store event details
//     vevents.forEach(event => {
//     const summary = event.getFirstPropertyValue('summary');
//     const start = event.getFirstPropertyValue('dtstart');
//     const end = event.getFirstPropertyValue('dtend');
    
//     const eventData = {
//       summary,
//       start: start.toString(),  // Store dates as ISO strings
//       end: end.toString()
//     };
    
//     eventsData.push(eventData); // Push event data into array
//     });
  
//     // Save the optimized event data to local storage
//     browser.storage.local.set({ calendarEvents: eventsData }, function() {
//     console.log('Events have been saved to local storage.');
//     });
  
//   } catch (error) {
//     console.error('Error fetching or parsing iCal file:', error);
//   }
// };


browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {// When a tab is updated
  var taburl = new URL(tab.url);
  if (taburl.host == "centralesupelec.edunao.com" && taburl.pathname == "/") {
    getOngoingEvent().then(ongoingEventName => {
      browser.scripting.executeScript({
        target: { tabId: tabId },
        args: [ongoingEventName, keys],
        function: (ongoingEvent, keys) => {
          const parentElement = document.querySelector(".courses");
          if (parentElement.classList.contains("reordered")) {
            return;
          }

          document.querySelector(".frontpage-block").remove();

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
          
          
          
          if (jsonDict.hasOwnProperty(ongoingEvent)) { // If the ongoingEventName exists in jsonDict
            // jsonDict[ongoingEvent].firstChild.setAttribute('style', 'border: 1px solid #007ef3 !important');
            // jsonDict[ongoingEvent].firstChild.style.border = '1px solid #007ef3';
            jsonDict[ongoingEvent].firstChild.style.boxShadow = '0 0 20px #007ef3';
            parentElement.appendChild(jsonDict[ongoingEvent]); // Append the corresponding element to parentElement
            delete jsonDict[ongoingEvent]; // Remove the ongoingEventName
          }
          
          keys.forEach((key) => {
            if (jsonDict.hasOwnProperty(key)) { // If the key exists in jsonDict
              // jsonDict[key].firstChild.setAttribute('style', 'border: 1px solid #910035 !important');
              // jsonDict[key].firstChild.style.border = '1px solid #910035';
              jsonDict[key].firstChild.style.boxShadow = '0 0 20px #910035';
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
    }, onError);
    
  }
  
});
