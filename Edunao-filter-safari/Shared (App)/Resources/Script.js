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
        },
        es: {
          iosInstructions: "Puede activar la extensión Safari del filtro Edunao en Configuración.",
          macUnknown: "Puede activar la extensión del filtro Edunao en las preferencias de Extensiones de Safari.",
          macOn: "La extensión del filtro Edunao está actualmente activada. ",
          macOff: "La extensión del filtro Edunao está actualmente desactivada. ",
          macButton: "Salga y abra la configuración de Safari..."
        },
        
        de: {
            iosInstructions: "Sie können die Edunao-Filter-Safari-Erweiterung in den Einstellungen aktivieren.",
            macUnknown: "Sie können die Edunao-Filter-Erweiterung in den Safari-Erweiterungseinstellungen aktivieren.",
            macOn: "Die Edunao-Filter-Erweiterung ist derzeit aktiviert. Sie können sie in den Safari-Erweiterungseinstellungen deaktivieren.",
            macOff: "Die Edunao-Filter-Erweiterung ist derzeit deaktiviert. Sie können sie in den Safari-Erweiterungseinstellungen aktivieren.",
            macButton: "Beenden und Safari-Einstellungen öffnen…"
        },
        zh: {
            iosInstructions: "您可以在设置中启用 Edunao 过滤器的 Safari 扩展。",
            macUnknown: "您可以在 Safari 扩展首选项中启用 Edunao 过滤器的扩展。",
            macOn: "Edunao 过滤器的扩展目前已启用。您可以在 Safari 扩展首选项中将其关闭。",
            macOff: "Edunao 过滤器的扩展目前已关闭。您可以在 Safari 扩展首选项中将其打开。",
            macButton: "退出并打开 Safari 设置…"
        },
        hi: {
            iosInstructions: "आप सेटिंग्स में Edunao फ़िल्टर के Safari एक्सटेंशन को चालू कर सकते हैं।",
            macUnknown: "आप Safari एक्सटेंशन प्राथमिकताओं में Edunao फ़िल्टर के एक्सटेंशन को चालू कर सकते हैं।",
            macOn: "Edunao फ़िल्टर का एक्सटेंशन वर्तमान में चालू है। आप इसे Safari एक्सटेंशन प्राथमिकताओं में बंद कर सकते हैं।",
            macOff: "Edunao फ़िल्टर का एक्सटेंशन वर्तमान में बंद है। आप इसे Safari एक्सटेंशन प्राथमिकताओं में चालू कर सकते हैं।",
            macButton: "छोड़ें और Safari सेटिंग्स खोलें…"
        },
        ar: {
            iosInstructions: "يمكنك تفعيل امتداد Edunao filter لـ Safari في الإعدادات.",
            macUnknown: "يمكنك تفعيل امتداد Edunao filter في تفضيلات ملحقات Safari.",
            macOn: "امتداد Edunao filter مفعل حاليًا. يمكنك إيقافه في تفضيلات ملحقات Safari.",
            macOff: "امتداد Edunao filter غير مفعل حاليًا. يمكنك تفعيله في تفضيلات ملحقات Safari.",
            macButton: "الخروج وفتح إعدادات Safari…"
        },
        ru: {
            iosInstructions: "Вы можете включить расширение Edunao filter для Safari в Настройках.",
            macUnknown: "Вы можете включить расширение Edunao filter в настройках расширений Safari.",
            macOn: "Расширение Edunao filter включено. Вы можете отключить его в настройках расширений Safari.",
            macOff: "Расширение Edunao filter выключено. Вы можете включить его в настройках расширений Safari.",
            macButton: "Выйти и открыть настройки Safari…"
        },
        pt: {
            iosInstructions: "Você pode ativar a extensão do filtro Edunao para Safari nas Configurações.",
            macUnknown: "Você pode ativar a extensão do filtro Edunao nas preferências das Extensões do Safari.",
            macOn: "A extensão do filtro Edunao está ativada. Você pode desativá-la nas preferências das Extensões do Safari.",
            macOff: "A extensão do filtro Edunao está desativada. Você pode ativá-la nas preferências das Extensões do Safari.",
            macButton: "Sair e abrir as Configurações do Safari…"
        },
        ja: {
            iosInstructions: "設定でEdunaoフィルターのSafari拡張機能を有効にできます。",
            macUnknown: "Safari拡張機能の環境設定でEdunaoフィルターの拡張機能を有効にできます。",
            macOn: "Edunaoフィルターの拡張機能は現在有効です。Safari拡張機能の環境設定で無効にできます。",
            macOff: "Edunaoフィルターの拡張機能は現在無効です。Safari拡張機能の環境設定で有効にできます。",
            macButton: "終了してSafari設定を開く…"
        }
    };

    // Déterminer la langue détectée
    let lang = 'en';  // Langue par défaut : anglais
    if (userLang.startsWith("fr")) {
        lang = 'fr';  // Français
    } else if (userLang.startsWith("es")) {
        lang = 'es';  // Espagnol
    } else if (userLang.startsWith("de")) {
        lang = 'de';  // Allemand
    } else if (userLang.startsWith("zh")) {
        lang = 'zh';  // Chinois
    } else if (userLang.startsWith("hi")) {
        lang = 'hi';  // Hindi
    } else if (userLang.startsWith("ar")) {
        lang = 'ar';  // Arabe
    } else if (userLang.startsWith("ru")) {
        lang = 'ru';  // Russe
    } else if (userLang.startsWith("pt")) {
        lang = 'pt';  // Portugais
    } else if (userLang.startsWith("ja")) {
        lang = 'ja';  // Japonais
    }

    // Si la langue détectée n'est pas supportée, utiliser anglais par défaut
    const text = translations[lang] || translations['en'];
    
    
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
