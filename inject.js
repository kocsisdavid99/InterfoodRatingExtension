
const script = document.createElement("script");
script.src = chrome.runtime.getURL("injected.js");
script.type = "module";
document.documentElement.appendChild(script);

const style = document.createElement("link");
style.rel = "stylesheet";
style.href = chrome.runtime.getURL("stars.css");
document.head.appendChild(style);
