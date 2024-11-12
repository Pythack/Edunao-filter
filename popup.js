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

function saveSuccess() {
	document.querySelector("#save_btn").style.backgroundColor = "#00df61";
	document.querySelector("#save_btn").textContent = browser.i18n.getMessage("popupSaveSuccess");
	setTimeout(() => {
		browser.tabs.query({ url: "https://centralesupelec.edunao.com/" }, function(tabs) {
			tabs.forEach(function(tab) {
				browser.tabs.reload(tab.id);
			});
		});
		window.close();
	}, 700);
}

function saveLoad() {
	document.querySelector("#save_btn").style.backgroundColor = "#0060df";
	document.querySelector("#save_btn").textContent = browser.i18n.getMessage("popupSaveLoad");
}

function saveError(message) {
	document.querySelector("#save_btn").style.backgroundColor = "#df0000";
		document.querySelector("#save_btn").textContent = browser.i18n.getMessage(message);
		setTimeout(() => {
			document.querySelector("#save_btn").style.backgroundColor = "#0060df";
			document.querySelector("#save_btn").textContent = browser.i18n.getMessage("popupSave");
		}, 1500);
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
	  browser.storage.local.set({ calendarEvents: eventsData }, function() {
		console.log('Events have been saved to local storage.');
		saveSuccess();
	  });
  
	} catch (error) {
	  console.log('Error fetching or parsing iCal file');
	  saveError("popupFetchError");
	}
}  

function saveOptions(e) { // Function called when user clicks on "Save" button
	e.preventDefault();
	if (document.querySelector("#add_url").checkValidity() === false || document.querySelector("#add_url").value === "") {
		saveError("popupInvalidURL");
		return;
	}
	var url = document.querySelector("#add_url").value;
	browser.storage.local.set({ ICALURL: url }, function() {
		console.log('URL has been saved to local storage.');
	});
	saveLoad();
	fetchAndSaveICal("https://ical.bdbcs.fr/edunaoproxy/" + url); // Fetch and save the iCal file using a proxy to avoid CORS issues
};

function localizeHtmlPage() // This is used to translate the popup.html page
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
document.addEventListener("DOMContentLoaded", restoreOptions); // When the popup loads
document.querySelector("#save_btn").addEventListener("click", saveOptions); // When the user clicks on "Save"
document.querySelector("#add_url").addEventListener("input", checkURLHost); // When the user types in the input field