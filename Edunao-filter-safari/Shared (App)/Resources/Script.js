function show(platform, enabled, useSettingsInsteadOfPreferences) {
    const userLang = navigator.language || navigator.userLanguage;

    // Textes en fonction de la langue détectée (français ou anglais)
    const translations = {
        en: {
            iosInstructions: "You can turn on Edunao filter’s Safari extension in Settings.",
            macUnknown: "You can turn on Edunao filter’s extension in Safari Extensions preferences.",
            macOn: "Edunao filter’s extension is currently on. You can turn it off in Safari Extensions preferences.",
            macOff: "Edunao filter’s extension is currently off. You can turn it on in Safari Extensions preferences.",
            macButton: "Quit and Open Safari Settings…"
        },
        fr: {
            iosInstructions: "Vous pouvez activer l’extension Safari Edunao filter dans les Réglages.",
            macUnknown: "Vous pouvez activer l'extension Edunao filter dans les préférences des extensions Safari.",
            macOn: "L'extension Edunao filter est actuellement activée. Vous pouvez la désactiver dans les préférences des extensions Safari.",
            macOff: "L'extension Edunao filter est actuellement désactivée. Vous pouvez l'activer dans les préférences des extensions Safari.",
            macButton: "Quitter et ouvrir les réglages de Safari..."
        }
    };

    // Détecter si la langue est en français ou en anglais (par défaut anglais)
    const lang = userLang.startsWith("fr") ? 'fr' : 'en';
    const text = translations[lang];

    // Injecter le texte correspondant
    document.querySelector("#ios-instructions").innerText = text.iosInstructions;
    document.querySelector("#state-unknown").innerText = text.macUnknown;
    document.querySelector("#state-on").innerText = text.macOn;
    document.querySelector("#state-off").innerText = text.macOff;
    document.querySelector("#open-preferences").innerText = text.macButton;

    // Cacher toutes les sections au début
    document.querySelector('.platform-ios').style.display = 'none';
    document.querySelector('.platform-mac').style.display = 'none';
    document.querySelector('.state-on').style.display = 'none';
    document.querySelector('.state-off').style.display = 'none';
    document.querySelector('.state-unknown').style.display = 'none';

    // Afficher la section correspondant à la plateforme
    document.querySelector(`.platform-${platform}`).style.display = 'block';

    // Gérer l'état de l'extension sur macOS
    if (platform === 'mac') {
        if (typeof enabled === "boolean") {
            if (enabled) {
                document.querySelector('.state-on').style.display = 'block';
            } else {
                document.querySelector('.state-off').style.display = 'block';
            }
        } else {
            document.querySelector('.state-unknown').style.display = 'block';
        }
    }
}

// Fonction pour ouvrir les préférences Safari
function openPreferences() {
    webkit.messageHandlers.controller.postMessage("open-preferences");
}

// Attacher l'événement au bouton
document.querySelector("button.open-preferences").addEventListener("click", openPreferences);
