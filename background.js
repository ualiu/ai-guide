// background.js

chrome.action.onClicked.addListener(async (tab) => {
  try {
    // Inject content.js into the active tab if it's not already injected
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content.js"],
    });
    console.log("Content script injected successfully.");
  } catch (error) {
    console.error("Failed to inject content script:", error);
  }
});

// Listener for analyzing the website
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "analyzeWebsite") {
    handleAnalyzeWebsite(request, sender)
      .then((response) => sendResponse(response))
      .catch((error) => {
        console.error("Error in handleAnalyzeWebsite:", error);
        sendResponse({ success: false, error: error.message });
      });
    return true; // Will respond asynchronously
  }
});

async function handleAnalyzeWebsite(request, sender) {
  try {
    const response = await fetch("http://localhost:3000/analyzeWebsite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: request.url }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (sender.tab && sender.tab.id) {
      await chrome.tabs.sendMessage(sender.tab.id, {
        action: "websiteAnalysisComplete",
        analysis: data.analysis,
      });
    } else {
      console.error("Sender tab information is missing");
    }

    return { success: true, analysis: data.analysis };
  } catch (error) {
    console.error("Error analyzing website:", error);
    return { success: false, error: error.message };
  }
}

// Optional: Add an onInstalled listener to set up any necessary initial state
chrome.runtime.onInstalled.addListener(() => {
  console.log("AI Guide Extension installed");
  // You can add any initialization code here if needed
});

// Optional: Add an alarm for periodic tasks if needed
chrome.alarms.create("refreshData", { periodInMinutes: 60 });
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "refreshData") {
    // Perform any periodic tasks here
    console.log("Performing periodic task");
  }
});
