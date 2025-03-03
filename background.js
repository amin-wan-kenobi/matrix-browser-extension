console.log("✅ Background script running");

chrome.runtime.onInstalled.addListener(() => {
    console.log("🔄 Extension installed or reloaded.");
});

chrome.runtime.onStartup.addListener(() => {
    console.log("🚀 Background script started (onStartup).");
});

function injectContentScript(tab) {
    console.log("🎯 Extension icon clicked! Trying to inject content script into:", tab.url);

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["content.js"]
    }).then(() => {
        console.log("✅ Content script successfully injected!");
    }).catch((err) => {
        console.error("❌ Failed to inject content script:", err);
    });
}

// Register the listener again on startup
chrome.action.onClicked.addListener(injectContentScript);
console.log("📌 Event listener registered for chrome.action.onClicked");
