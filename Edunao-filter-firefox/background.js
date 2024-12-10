// importScripts('ical.min.js');

// if (typeof browser === "undefined") {
//   var browser = chrome;
//   var browser_action = browser.action;
// } else {
//   var browser_action = browser.browserAction;
// }

// function initialize() {
//   browser.storage.local.get('settings', function(result) {
//     if (!result.settings) {
//       browser.storage.local.set({ settings: {"courses":{"firstYears":[],"secondYears":[]},"differentiator":"","colours":{"ongoing":"","focus":""}} }, function() {
//         console.log('Temporary settings have been saved to local storage.');
//       });
//     }
//   });
// }

// function onError(error) {
//   console.log(`Error:${error}`);
// }

// function getOngoingEvent() {
//   return new Promise(function(resolve, reject) {
//     browser.storage.local.get('calendarEvents', function(result) {
//       const events = result.calendarEvents;

//       if (!events || events.length === 0) {
//         console.log('No events found in local storage.');
//         resolve("");
//         return;
//       }

//       const now = new Date();

//       const ongoingEvent = events.find(event => {
//         const startDate = new Date(event.start);
//         const endDate = new Date(event.end);
//         return startDate <= now && endDate >= now;
//       });

//       if (ongoingEvent) {
//         let result = ongoingEvent.summary.split(' -')[0].trim().toLowerCase();
//         resolve(result);
//         return;
//       } else {
//         console.log('No ongoing event at the moment.');
//       }
//       resolve("");
//     });
//   });
// }

// function applyFilter(tabId, changeInfo, tab) {
//   var taburl = new URL(tab.url);
//   if (taburl.host == "centralesupelec.edunao.com" && taburl.pathname == "/") {
//     getOngoingEvent().then(ongoingEventName => {
//       browser.storage.local.get('settings', function(result) {
//         if (!result.settings) {
//           console.log('No settings found in local storage.');
//           firstYears = [];
//           secondYears = [];
//           differentiator = "";
//           ongoingColour = "";
//           focusColour = "";
//         }
//         var firstYears = result.settings.courses.firstYears;
//         var secondYears = result.settings.courses.secondYears;
//         var differentiator = result.settings.differentiator;
//         var ongoingColour = result.settings.colours.ongoing;
//         var focusColour = result.settings.colours.focus;
//         browser.tabs.executeScript(tabId, {
//           code: `
//             const ongoingEvent = "${ongoingEventName}";
//             const firstYears = ${JSON.stringify(firstYears)};
//             const secondYears = ${JSON.stringify(secondYears)};
//             const differentiator = "${differentiator}";
//             const ongoingColour = "${ongoingColour}";
//             const focusColour = "${focusColour}";
//             const parentElement = document.querySelector(".courses");
//             if (parentElement.classList.contains("reordered")) {
//               return;
//             }

//             document.querySelector(".frontpage-block").remove();

//             const children = Array.from(parentElement.children);
//             const jsonDict = {};

//             children.forEach((child, index) => {
//               if (index === children.length - 1) {child.remove();return;}
//               const key = child.firstChild.firstChild.firstChild.textContent.split(' -')[0].trim().toLowerCase();
//               const value = child.textContent;
//               jsonDict[key] = child;
//               child.remove();
//             });

//             if (jsonDict.hasOwnProperty(ongoingEvent)) {
//               jsonDict[ongoingEvent].firstChild.style.boxShadow = ongoingColour;
//               parentElement.appendChild(jsonDict[ongoingEvent]);
//               delete jsonDict[ongoingEvent];
//             }

//             if (!jsonDict.hasOwnProperty(differentiator)) {
//               firstYears.forEach((key) => {
//                 if (jsonDict.hasOwnProperty(key)) {
//                   jsonDict[key].firstChild.style.boxShadow = focusColour;
//                   parentElement.appendChild(jsonDict[key]);
//                   delete jsonDict[key];
//                 }
//               });
//             } else {
//               secondYears.forEach((key) => {
//                 if (jsonDict.hasOwnProperty(key)) {
//                   jsonDict[key].firstChild.style.boxShadow = focusColour;
//                   parentElement.appendChild(jsonDict[key]);
//                   delete jsonDict[key];
//                 }
//               });
//             }

//             Object.values(jsonDict).forEach((element) => {
//               parentElement.appendChild(element);
//             });

//             parentElement.classList.add("reordered");
//           `
//         });
//       });
//     }, onError);
//   }
// }

// async function fetchAndSaveSettings() {
//   try {
//     const response = await fetch("https://ical.bdbcs.fr/Edunao-Filter/settings.json");
//     const settings = await response.json();
//     let currentTimestamp = new Date().toISOString();
//     browser.storage.local.set({ settings: settings, settingsLast: currentTimestamp }, function() {
//       console.log('Settings have been saved to local storage.');
//       console.log(settings);
//     });
//   } catch (error) {
//     console.log('Error fetching or parsing settings file', error);
//   }
// }

// async function fetchAndSaveICal(url) {
//   try {
//     const response = await fetch(url);
//     const icalText = await response.text();
//     const jcalData = ICAL.parse(icalText);
//     const comp = new ICAL.Component(jcalData);
//     const vevents = comp.getAllSubcomponents('vevent');

//     const eventsData = [];

//     vevents.forEach(event => {
//       const summary = event.getFirstPropertyValue('summary');
//       const start = event.getFirstPropertyValue('dtstart');
//       const end = event.getFirstPropertyValue('dtend');

//       const eventData = {
//         summary,
//         start: start.toString(),
//         end: end.toString()
//       };

//       eventsData.push(eventData);
//     });

//     let currentTimestamp = new Date().toISOString();
//     browser.storage.local.set({ calendarEvents: eventsData, calendarLast: currentTimestamp }, function() {
//       console.log('Events have been saved to local storage.');
//     });
//   } catch (error) {
//     console.log('Error fetching or parsing iCal file', error);
//   }
// }

// function updateValues() {
//   fetchAndSaveSettings();
//   browser.storage.local.get('ICALURL', function(result) {
//     if (result.ICALURL) {
//       fetchAndSaveICal("https://ical.bdbcs.fr/edunaoproxy/" + result.ICALURL);
//     } else {
//       console.log('No ICALURL found in local storage.');
//     }
//   });
// }

// initialize();

// setTimeout(updateValues, 0);
// setInterval(updateValues, 600000);

// setTimeout(() => {
//   browser.tabs.onUpdated.addListener(applyFilter);
// }, 500);

// browser.runtime.setUninstallURL("https://forms.gle/soeTKjxfNEfQpqfB7");


importScripts('ical.min.js');

if (typeof browser === "undefined") {
  var browser = chrome;
}

function initialize() {
  browser.storage.local.get('settings', function(result) {
    if (!result.settings) {
      browser.storage.local.set({
        settings: {
          "courses": { "firstYears": [], "secondYears": [] },
          "differentiator": "",
          "colours": { "ongoing": "", "focus": "" }
        }
      }, function() {
        console.log('Temporary settings have been saved to local storage.');
      });
    }
  });
}

function onError(error) {
  console.log(`Error: ${error}`);
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

      const now = new Date();
      const ongoingEvent = events.find(event => {
        const startDate = new Date(event.start);
        const endDate = new Date(event.end);
        return startDate <= now && endDate >= now;
      });

      if (ongoingEvent) {
        let result = ongoingEvent.summary.split(' -')[0].trim().toLowerCase();
        resolve(result);
        return;
      } else {
        console.log('No ongoing event at the moment.');
      }
      resolve("");
    });
  });
}

function applyFilter(tabId, changeInfo, tab) {
  const taburl = new URL(tab.url);
  if (taburl.host === "centralesupelec.edunao.com" && taburl.pathname === "/") {
    getOngoingEvent().then(ongoingEventName => {
      browser.storage.local.get('settings', function(result) {
        if (!result.settings) {
          console.log('No settings found in local storage.');
          return;
        }

        const settings = result.settings;
        const firstYears = settings.courses.firstYears || [];
        const secondYears = settings.courses.secondYears || [];
        const differentiator = settings.differentiator || "";
        const ongoingColour = settings.colours.ongoing || "";
        const focusColour = settings.colours.focus || "";

        browser.tabs.executeScript(tabId, {
          code: `
            (function() {
              const ongoingEvent = "${ongoingEventName}";
              const firstYears = ${JSON.stringify(firstYears)};
              const secondYears = ${JSON.stringify(secondYears)};
              const differentiator = "${differentiator}";
              const ongoingColour = "${ongoingColour}";
              const focusColour = "${focusColour}";

              const parentElement = document.querySelector(".courses");
              if (!parentElement || parentElement.classList.contains("reordered")) {
                return;
              }

              document.querySelector(".frontpage-block")?.remove();

              const children = Array.from(parentElement.children);
              const jsonDict = {};

              children.forEach((child, index) => {
                if (index === children.length - 1) {
                  child.remove();
                  return;
                }
                const key = child.firstChild.firstChild.firstChild.textContent.split(' -')[0].trim().toLowerCase();
                jsonDict[key] = child;
                child.remove();
              });

              if (jsonDict.hasOwnProperty(ongoingEvent)) {
                jsonDict[ongoingEvent].firstChild.style.boxShadow = ongoingColour;
                parentElement.appendChild(jsonDict[ongoingEvent]);
                delete jsonDict[ongoingEvent];
              }

              const courses = jsonDict.hasOwnProperty(differentiator) ? secondYears : firstYears;
              courses.forEach((key) => {
                if (jsonDict[key]) {
                  jsonDict[key].firstChild.style.boxShadow = focusColour;
                  parentElement.appendChild(jsonDict[key]);
                  delete jsonDict[key];
                }
              });

              Object.values(jsonDict).forEach((element) => {
                parentElement.appendChild(element);
              });

              parentElement.classList.add("reordered");
            })();
          `
        });
      });
    }).catch(onError);
  }
}

async function fetchAndSaveSettings() {
  try {
    const response = await fetch("https://ical.bdbcs.fr/Edunao-Filter/settings.json");
    const settings = await response.json();
    const currentTimestamp = new Date().toISOString();
    browser.storage.local.set({ settings, settingsLast: currentTimestamp }, function() {
      console.log('Settings have been saved to local storage.');
    });
  } catch (error) {
    console.error('Error fetching or parsing settings file:', error);
  }
}

async function fetchAndSaveICal(url) {
  try {
    const response = await fetch(url);
    const icalText = await response.text();
    const jcalData = ICAL.parse(icalText);
    const comp = new ICAL.Component(jcalData);
    const vevents = comp.getAllSubcomponents('vevent');

    const eventsData = vevents.map(event => ({
      summary: event.getFirstPropertyValue('summary'),
      start: event.getFirstPropertyValue('dtstart').toString(),
      end: event.getFirstPropertyValue('dtend').toString()
    }));

    const currentTimestamp = new Date().toISOString();
    browser.storage.local.set({ calendarEvents: eventsData, calendarLast: currentTimestamp }, function() {
      console.log('Events have been saved to local storage.');
    });
  } catch (error) {
    console.error('Error fetching or parsing iCal file:', error);
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

initialize();
setTimeout(updateValues, 0);
setInterval(updateValues, 600000);

browser.tabs.onUpdated.addListener(applyFilter);

browser.runtime.setUninstallURL("https://forms.gle/soeTKjxfNEfQpqfB7");