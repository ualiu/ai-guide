document
  .getElementById("getInstructions")
  .addEventListener("click", async () => {
    const prompt = document.getElementById("prompt").value;

    const response = await fetch("http://localhost:3000/instructions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();
    const instructions = data.instructions;

    // Send instructions to the content script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "displayInstructions",
        instructions,
      });
    });

    // Close the popup.html window
    window.close();
  });

document
  .getElementById("analyzePageButton")
  .addEventListener("click", async () => {
    // Query the active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: "analyzePage" },
        async (response) => {
          const pageContent = response.content;

          // Send page content to your server for AI analysis
          const analysis = await fetch("http://localhost:3000/analyzePage", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ pageContent }),
          });

          const data = await analysis.json();

          // Send the analysis to the content script to display it
          chrome.tabs.sendMessage(tabs[0].id, {
            action: "displayAnalysis",
            analysis: data.analysis,
          });

          // Close the popup.html window
          window.close();
        }
      );
    });
  });
