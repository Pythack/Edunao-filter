importScripts('ical.min.js');

if (typeof browser === "undefined") {
  var browser = chrome;
  var browser_action = browser.action
} else {
  var browser_action = browser.browserAction
}

function intialize() {
  browser.storage.local.get('settings', function(result) {
    if (!result.settings) {
      browser.storage.local.set({ settings: {"courses":{"firstYears":[],"secondYears":[]},"differentiator":"","colours":{"ongoing":"","focus":""}, "openinnewtab": true} }, function() {
        console.log('Temporary settings have been saved to local storage.');
      });
    }
  });
}

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

function applyFilter(tabId, changeInfo, tab) { // When a tab is updated
  var taburl = new URL(tab.url);
  if (taburl.host == "centralesupelec.edunao.com" && taburl.pathname == "/") { // Check if the tab is Edunao
    getOngoingEvent().then(ongoingEventName => { // Get the ongoing event (empty string if none)
      browser.storage.local.get('settings', function(result) {
        if (!result.settings) {
          console.log('No settings found in local storage.');
          firstYears = [];
          secondYears = [];
          differentiator = "";
          ongoingColour = "";
          focusColour = "";
        }
        var firstYears = result.settings.courses.firstYears;
        var secondYears = result.settings.courses.secondYears;
        var differentiator = result.settings.differentiator;
        var ongoingColour = result.settings.colours.ongoing;
        var focusColour = result.settings.colours.focus;
        browser.scripting.executeScript({ // Inject the following script into the tab
          target: { tabId: tabId },
          args: [ongoingEventName, firstYears, secondYears, differentiator, ongoingColour, focusColour],
          function: (ongoingEvent, firstYears, secondYears, differentiator, ongoingColour, focusColour) => {
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
              jsonDict[ongoingEvent].firstChild.style.boxShadow = ongoingColour; // Add a blue shadow to the element
              parentElement.appendChild(jsonDict[ongoingEvent]); // Append the corresponding element to parentElement
              delete jsonDict[ongoingEvent]; // Remove the ongoingEventName
            }
            
            if (!jsonDict.hasOwnProperty(differentiator)) { // If linear algebra is not in the list so the use is 1A then put the 1A courses on top
              firstYears.forEach((key) => {
                if (jsonDict.hasOwnProperty(key)) {
                  jsonDict[key].firstChild.style.boxShadow = focusColour;
                  parentElement.appendChild(jsonDict[key]);
                  delete jsonDict[key];
                }
              });
            } else {
              secondYears.forEach((key) => {
                if (jsonDict.hasOwnProperty(key)) { // If the key exists in jsonDict
                  jsonDict[key].firstChild.style.boxShadow = focusColour; // Add a red shadow to the element
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
      });
    }, onError);
  } else if (taburl.host == "centralesupelec.edunao.com" && taburl.pathname == "/course/view.php") {
    browser.storage.local.get('settings', function(settings) {
      if (settings.settings.openinnewtab) {
        browser.scripting.executeScript({ // Inject the following script into the tab
          target: { tabId: tabId },
          function: () => {
            document.querySelectorAll('.aalink').forEach(link => {
              link.target = "_blank";
            });
          }
        });
      }
    });
  }
};

async function fetchAndSaveSettings() {
  try {
    // Fetch the .json file from the given URL
	  const response = await fetch("https://ical.bdbcs.fr/Edunao-Filter/settings.json");
	  const icalText = await response.text();
	  
    // Parse the .json file using JSON.parse
    const settings = JSON.parse(icalText);
    
	  // Save the optimized event data to local storage
    let currentTimestamp = new Date().toISOString();
	  browser.storage.local.set({ settings: settings, settingsLast: currentTimestamp }, function() {
      console.log('Settings have been saved to local storage.');
      console.log(settings);
    });
    
	} catch (error) {
    console.log('Error fetching or parsing settings file', error);
	}
}  


async function fetchAndSaveICal(url) {
  try {
    // Fetch the .ics file from the given URL
	  const response = await fetch(url);
	  const icalText = await response.text();
	  
	  // Parse the .ics file using ical.js
	  const jcalData = ICAL.parse(icalText);
	  const comp = new ICAL.Component(jcalData);
	  const vevents = comp.getAllSubcomponents('vevent');
    
	  // Prepare an array to store the optimized event details
	  const eventsData = [];
    
	  // Extract and store event details
	  vevents.forEach(event => {
      const summary = event.getFirstPropertyValue('summary'); // This is the event title
      const start = event.getFirstPropertyValue('dtstart');
      const end = event.getFirstPropertyValue('dtend');
      
      const eventData = {
        summary,
        start: start.toString(),  // Store dates as ISO strings
        end: end.toString()
      };
      
      eventsData.push(eventData); // Push event data into array
	  });
    
	  // Save the optimized event data to local storage
    let currentTimestamp = new Date().toISOString();
	  browser.storage.local.set({ calendarEvents: eventsData, calendarLast: currentTimestamp }, function() {
      console.log('Events have been saved to local storage.');
	  });
    
	} catch (error) {
    console.log('Error fetching or parsing iCal file', error);
	}
}  

function updateValues() {
  fetchAndSaveSettings();
  browser.storage.local.get('ICALURL', function(result) {
    if (result.ICALURL) {
      fetchAndSaveICal("https://ical.bdbcs.fr/edunaoproxy/" + result.ICALURL);
    } else {
      console.log('No ICALURL found in local storage.');
    }
  });
}

intialize();

setTimeout(updateValues, 0);
setInterval(updateValues, 600000);

setTimeout(() => {
  browser.tabs.onUpdated.addListener(applyFilter); // Add the listener to the tabs
}, 500);

browser.runtime.setUninstallURL("https://forms.gle/soeTKjxfNEfQpqfB7");