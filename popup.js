// POPUP.JS

document.addEventListener("DOMContentLoaded", function () {
  const getInstructionsButton = document.getElementById("getInstructions");
  const analyzePageButton = document.getElementById("analyzePageButton");
  const promptInput = document.getElementById("prompt");
  const loadingSpinner = document.getElementById("loadingSpinner");

  getInstructionsButton.addEventListener("click", handleGetInstructions);
  analyzePageButton.addEventListener("click", handleAnalyzePage);

  function showLoading() {
    loadingSpinner.style.display = "block";
    getInstructionsButton.disabled = true;
    analyzePageButton.disabled = true;
  }

  function hideLoading() {
    loadingSpinner.style.display = "none";
    getInstructionsButton.disabled = false;
    analyzePageButton.disabled = false;
  }

  async function handleGetInstructions() {
    const prompt = promptInput.value.trim();
    if (!prompt) {
      alert("Please enter a prompt");
      return;
    }

    showLoading();

    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      // Inject the content script if not already injected
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["content.js"],
      });

      let context;
      try {
        const response = await chrome.tabs.sendMessage(tab.id, {
          action: "getUpdatedContext",
        });
        context = response;
      } catch (error) {
        console.log("getUpdatedContext failed, falling back to getPageContext");
        const response = await chrome.tabs.sendMessage(tab.id, {
          action: "getPageContext",
        });
        context = response.pageContext;
      }

      const serverResponse = await fetch("http://localhost:3000/instructions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, context }),
      });

      if (!serverResponse.ok) {
        throw new Error(`HTTP error! status: ${serverResponse.status}`);
      }

      const data = await serverResponse.json();

      await chrome.tabs.sendMessage(tab.id, {
        action: "displayInstructions",
        instructions: data.instructions,
      });

      // Close the popup after sending the instructions
      chrome.runtime.sendMessage({ action: "closePopupWindow" });
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred: " + error.message + ". Please try again.");
    } finally {
      hideLoading();
    }
  }

  async function handleAnalyzePage() {
    showLoading();

    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      // Inject the content script if not already injected
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["content.js"],
      });

      const response = await chrome.tabs.sendMessage(tab.id, {
        action: "analyzePage",
      });
      const pageContent = response.content;

      const analysisResponse = await fetch(
        "http://localhost:3000/analyzePage",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pageContent }),
        }
      );

      if (!analysisResponse.ok) {
        throw new Error(`HTTP error! status: ${analysisResponse.status}`);
      }

      const data = await analysisResponse.json();

      await chrome.tabs.sendMessage(tab.id, {
        action: "displayAnalysis",
        analysis: data.analysis,
      });

      // Close the popup after sending the analysis
      chrome.runtime.sendMessage({ action: "closePopupWindow" });
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred: " + error.message + ". Please try again.");
    } finally {
      hideLoading();
    }
  }

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "closePopupWindow") {
      window.close(); // Close the popup.html window
    }
  });
});
