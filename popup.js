if (typeof browser === "undefined") {
    var browser = chrome;
}

function matchRuleShort(str, rule) {
	var escapeRegex = (str) => str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
	return new RegExp("^" + rule.split("*").map(escapeRegex).join(".*") + "$").test(str);
  }


function onError(error) {
	console.log(`Error:${error}`);
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
		const summary = event.getFirstPropertyValue('summary');
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
	  browser.storage.local.set({ calendarEvents: eventsData }, function() {
		console.log('Events have been saved to local storage.');
	  });
  
	} catch (error) {
	  console.error('Error fetching or parsing iCal file:', error);
	}
}  

function saveOptions(e) { // Function called when user clicks on "Save" button
	e.preventDefault();
	if (document.querySelector("#add_url").checkValidity() === false || document.querySelector("#add_url").value === "") {
		return;
	}
	var url = document.querySelector("#add_url").value;
	browser.storage.local.set({ ICALURL: url }, function() {
		console.log('URL has been saved to local storage.');
	});
	fetchAndSaveICal("https://corsproxy.io/?" + url);
};

function localizeHtmlPage()
{
    //Localize by replacing __MSG_***__ meta tags
    var objects = document.getElementsByTagName('html');
    for (var j = 0; j < objects.length; j++)
    {
        var obj = objects[j];

        var valStrH = obj.innerHTML.toString();
        var valNewH = valStrH.replace(/__MSG_(\w+)__/g, function(match, v1)
        {
            return v1 ? browser.i18n.getMessage(v1) : "";
        });

        if(valNewH != valStrH)
        {
            obj.innerHTML = valNewH;
        }
    }
}

function restoreOptions() {
	let getting = browser.storage.local.get(); // Get storage
	getting.then(result => {
	  if (result.ICALURL) { // If there are custom settings
		document.querySelector("#add_url").value = result.ICALURL; // Set the value of the input field
	  }
	}, onError);
  };
  

function checkURLHost(event) {
	const inp = event.target;
	if (inp.value === "") {
		inp.setCustomValidity("");
		return;
	}
	try {
		const url = new URL(inp.value);
		if (url.hostname === "connecteur.alcuin.com") {
			inp.setCustomValidity("");
			return;
		} else {
			inp.setCustomValidity("Please enter a valid ICAL URL");
		}
	} catch (e) {
		inp.setCustomValidity("Please enter a valid ICAL URL");
	}
}

localizeHtmlPage();

// Set event listeners
document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("#save_btn").addEventListener("click", saveOptions);
document.querySelector("#add_url").addEventListener("input", checkURLHost);