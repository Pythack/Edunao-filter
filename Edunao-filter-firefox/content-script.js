// Script injecté dans la page
(function () {
    const parentElement = document.querySelector(".courses");
    if (!parentElement || parentElement.classList.contains("reordered")) {
      return; // Si l'élément n'existe pas ou a déjà été traité
    }
  
    document.querySelector(".frontpage-block")?.remove(); // Supprime le message d'accueil inutile
  
    const children = Array.from(parentElement.children);
    const jsonDict = {};
  
    // Réorganiser les cours
    children.forEach((child, index) => {
      if (index === children.length - 1) {
        child.remove(); // Supprime le bouton "Tous les cours"
        return;
      }
      const key = child.firstChild.firstChild.firstChild.textContent
        .split(" -")[0]
        .trim()
        .toLowerCase();
      jsonDict[key] = child;
      child.remove();
    });
  
    // Récupérer les paramètres stockés par l'extension
    const ongoingEvent = "${ONGOING_EVENT}";
    const firstYears = ${FIRST_YEARS};
    const secondYears = ${SECOND_YEARS};
    const differentiator = "${DIFFERENTIATOR}";
    const ongoingColour = "${ONGOING_COLOUR}";
    const focusColour = "${FOCUS_COLOUR}";
  
    // Ajouter l'événement en cours
    if (jsonDict.hasOwnProperty(ongoingEvent)) {
      jsonDict[ongoingEvent].firstChild.style.boxShadow = ongoingColour;
      parentElement.appendChild(jsonDict[ongoingEvent]);
      delete jsonDict[ongoingEvent];
    }
  
    // Trier les cours en fonction de la classe (1ère ou 2ème année)
    const isFirstYear = !jsonDict.hasOwnProperty(differentiator);
    const relevantCourses = isFirstYear ? firstYears : secondYears;
  
    relevantCourses.forEach((key) => {
      if (jsonDict.hasOwnProperty(key)) {
        jsonDict[key].firstChild.style.boxShadow = focusColour;
        parentElement.appendChild(jsonDict[key]);
        delete jsonDict[key];
      }
    });
  
    // Ajouter le reste des éléments
    Object.values(jsonDict).forEach((element) => {
      parentElement.appendChild(element);
    });
  
    parentElement.classList.add("reordered");
  })();