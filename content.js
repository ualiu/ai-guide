// Function to extract text content from the page
function extractPageContent() {
  let bodyText = document.body.innerText || "";
  let title = document.title || "";
  let metaDescription = document.querySelector('meta[name="description"]');
  let description = metaDescription ? metaDescription.content : "";

  return {
    title: title,
    description: description,
    bodyText: bodyText,
  };
}

// Function to display the analysis result in a styled popup
function displayAnalysisPopup(content) {
  const popup = document.createElement("div");
  popup.id = "ai-analysis-popup";
  popup.style.position = "fixed";
  popup.style.top = "20px";
  popup.style.left = "50%";
  popup.style.transform = "translateX(-50%)";
  popup.style.width = "600px";
  popup.style.backgroundColor = "#fff";
  popup.style.border = "3px solid";
  popup.style.borderImage = "linear-gradient(45deg, #8e2de2, #ff6c00) 1";
  popup.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.1)";
  popup.style.padding = "15px";
  popup.style.zIndex = 10000;
  popup.style.borderRadius = "8px";
  popup.style.fontSize = "16px";
  popup.style.color = "#000";
  popup.style.overflowY = "auto";
  popup.style.maxHeight = "80vh";

  // Progress bar (just for visual similarity; not functional in this context)
  const progressBar = document.createElement("div");
  progressBar.style.width = "100%";
  progressBar.style.height = "5px";
  progressBar.style.backgroundColor = "#8e2de2";
  progressBar.style.marginBottom = "10px";
  popup.appendChild(progressBar);

  const contentDiv = document.createElement("div");
  contentDiv.innerHTML = `<strong>Analysis:</strong><br><br>${content}`;
  popup.appendChild(contentDiv);

  const buttonContainer = document.createElement("div");
  buttonContainer.style.marginTop = "10px";
  buttonContainer.style.display = "flex";
  buttonContainer.style.justifyContent = "space-between";

  const closeButton = document.createElement("button");
  closeButton.innerText = "OK";
  closeButton.style.padding = "10px";
  closeButton.style.width = "30%";
  closeButton.style.backgroundImage =
    "linear-gradient(45deg, #8e2de2, #ff6c00)";
  closeButton.style.border = "none";
  closeButton.style.borderRadius = "5px";
  closeButton.style.color = "#fff";
  closeButton.style.fontWeight = "bold";
  closeButton.style.cursor = "pointer";

  closeButton.addEventListener("click", () => {
    document.body.removeChild(popup);
  });

  buttonContainer.appendChild(closeButton);
  popup.appendChild(buttonContainer);

  const closeButtonTop = document.createElement("button");
  closeButtonTop.innerText = "X";
  closeButtonTop.style.position = "absolute";
  closeButtonTop.style.top = "5px";
  closeButtonTop.style.right = "5px";
  closeButtonTop.style.backgroundColor = "transparent";
  closeButtonTop.style.border = "none";
  closeButtonTop.style.color = "#888";
  closeButtonTop.style.fontSize = "16px";
  closeButtonTop.style.cursor = "pointer";
  closeButtonTop.addEventListener("click", () => {
    document.body.removeChild(popup);
  });
  popup.appendChild(closeButtonTop);

  document.body.appendChild(popup);
}

// Function to create the instruction popup
function createPopup(content, instructions, stepIndex = 0) {
  const popup = document.createElement("div");
  popup.id = "ai-guide-popup";
  popup.style.position = "fixed";
  popup.style.top = "20px";
  popup.style.left = "50%";
  popup.style.transform = "translateX(-50%)";
  popup.style.width = "600px"; // Adjust width if necessary
  popup.style.backgroundColor = "#fff";
  popup.style.border = "3px solid";
  popup.style.borderImage = "linear-gradient(45deg, #8e2de2, #ff6c00) 1";
  popup.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.1)";
  popup.style.padding = "15px";
  popup.style.zIndex = 10000;
  popup.style.borderRadius = "8px";
  popup.style.fontSize = "16px";
  popup.style.color = "#000";

  // Progress bar
  const progressBar = document.createElement("div");
  progressBar.style.width = `${((stepIndex + 1) / instructions.length) * 100}%`;
  progressBar.style.height = "5px";
  progressBar.style.backgroundColor = "#8e2de2";
  progressBar.style.marginBottom = "10px";
  popup.appendChild(progressBar);

  // Content
  const contentDiv = document.createElement("div");
  contentDiv.innerHTML = `<strong>Step ${stepIndex + 1}:</strong> ${content}`;
  popup.appendChild(contentDiv);

  // Button container
  const buttonContainer = document.createElement("div");
  buttonContainer.style.marginTop = "10px";
  buttonContainer.style.display = "flex";
  buttonContainer.style.justifyContent = "space-between";

  // Next button
  const nextButton = document.createElement("button");
  nextButton.innerText = "Next";
  nextButton.style.padding = "10px";
  nextButton.style.width = "70%";
  nextButton.style.backgroundImage = "linear-gradient(45deg, #8e2de2, #ff6c00)";
  nextButton.style.border = "none";
  nextButton.style.borderRadius = "5px";
  nextButton.style.color = "#fff";
  nextButton.style.fontWeight = "bold";
  nextButton.style.cursor = "pointer";

  nextButton.addEventListener("click", () => {
    const nextStep = stepIndex + 1;
    chrome.storage.local.set({ "ai-guide-step": nextStep });
    document.body.removeChild(popup);
    if (nextStep < instructions.length) {
      createPopup(instructions[nextStep], instructions, nextStep);
    } else {
      clearPopupState();
    }
  });

  // Collapse button
  const collapseButton = document.createElement("button");
  collapseButton.innerText = "Collapse";
  collapseButton.style.padding = "10px";
  collapseButton.style.width = "25%";
  collapseButton.style.backgroundColor = "#f0f0f0"; // Light gray
  collapseButton.style.border = "none";
  collapseButton.style.borderRadius = "5px";
  collapseButton.style.color = "#666";
  collapseButton.style.cursor = "pointer";

  collapseButton.addEventListener("click", () => {
    popup.style.display = "none";
    const collapsedIcon = document.createElement("div");
    collapsedIcon.id = "collapsed-ai-guide-icon";
    collapsedIcon.innerText = "AI";
    collapsedIcon.style.position = "fixed";
    collapsedIcon.style.bottom = "20px";
    collapsedIcon.style.left = "20px";
    collapsedIcon.style.width = "50px";
    collapsedIcon.style.height = "50px";
    collapsedIcon.style.borderRadius = "50%";
    collapsedIcon.style.backgroundColor = "#8e2de2";
    collapsedIcon.style.color = "#fff";
    collapsedIcon.style.display = "flex";
    collapsedIcon.style.alignItems = "center";
    collapsedIcon.style.justifyContent = "center";
    collapsedIcon.style.fontSize = "16px";
    collapsedIcon.style.lineHeight = "1";
    collapsedIcon.style.textAlign = "center";
    collapsedIcon.style.cursor = "pointer";
    collapsedIcon.style.zIndex = 10001;

    document.body.appendChild(collapsedIcon);

    collapsedIcon.addEventListener("click", () => {
      popup.style.display = "block";
      collapsedIcon.remove();
    });
  });

  buttonContainer.appendChild(nextButton);
  buttonContainer.appendChild(collapseButton);
  popup.appendChild(buttonContainer);

  document.body.appendChild(popup);
}

// Function to clear the popup state
function clearPopupState() {
  chrome.storage.local.remove(["ai-guide-instructions", "ai-guide-step"]);
}

// Function to initialize the popup on page load
function initializePopup() {
  chrome.storage.local.get(
    ["ai-guide-instructions", "ai-guide-step"],
    (result) => {
      const storedInstructions = result["ai-guide-instructions"];
      const storedStepIndex = result["ai-guide-step"];

      if (storedInstructions && !isNaN(storedStepIndex)) {
        createPopup(
          storedInstructions[storedStepIndex],
          storedInstructions,
          storedStepIndex
        );
      }
    }
  );
}

// Listen for messages from the popup or background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "analyzePage") {
    const pageContent = extractPageContent();
    // Send the content back to the popup or background script
    sendResponse({ content: pageContent });
  } else if (request.action === "displayAnalysis") {
    displayAnalysisPopup(request.analysis);
  } else if (request.action === "displayInstructions") {
    const instructions = request.instructions;
    chrome.storage.local.set({
      "ai-guide-instructions": instructions,
      "ai-guide-step": 0,
    });
    createPopup(instructions[0], instructions);
  }
});

window.addEventListener("load", initializePopup);
