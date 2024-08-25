//CONTENT.JS

// Check if currentDomain is already defined
if (typeof currentDomain === "undefined") {
  var currentDomain = "";
}
let websiteAnalysis = "";

function getPageContext() {
  const url = window.location.href;
  const title = document.title;
  const h1 = document.querySelector("h1")
    ? document.querySelector("h1").innerText
    : "";
  const metaDescription = document.querySelector('meta[name="description"]')
    ? document.querySelector('meta[name="description"]').getAttribute("content")
    : "";

  return { url, title, h1, metaDescription };
}

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

function displayAnalysisPopup(content) {
  // Code to display analysis in a popup
  const popup = document.createElement("div");
  popup.id = "ai-guide-popup";
  popup.style.position = "fixed";
  popup.style.top = "20px";
  popup.style.left = "50%";
  popup.style.transform = "translateX(-50%)";
  popup.style.width = "600px";
  popup.style.backgroundColor = "#f8f4f0";
  popup.style.borderRadius = "15px";
  popup.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.1)";
  popup.style.zIndex = 10000;
  popup.style.padding = "20px";
  popup.style.fontFamily = "'Inter', sans-serif";
  popup.style.overflowY = "auto";
  popup.style.maxHeight = "80vh";
  popup.style.border = "2px solid #0c0c18";

  const titleDiv = document.createElement("div");
  titleDiv.style.fontSize = "20px";
  titleDiv.style.fontWeight = "600";
  titleDiv.style.marginBottom = "10px";
  titleDiv.style.color = "#1A202C";
  titleDiv.innerText = "Page Analysis";
  popup.appendChild(titleDiv);

  const contentDiv = document.createElement("div");
  contentDiv.style.fontSize = "16px";
  contentDiv.style.color = "#4A5568";
  contentDiv.style.margin = "15px 0";
  contentDiv.innerHTML = content;
  popup.appendChild(contentDiv);

  const closeButton = document.createElement("div");
  closeButton.innerText = "✕";
  closeButton.style.position = "absolute";
  closeButton.style.top = "15px";
  closeButton.style.right = "15px";
  closeButton.style.cursor = "pointer";
  closeButton.style.fontSize = "18px";
  closeButton.style.color = "#718096";
  closeButton.addEventListener("click", () => {
    document.body.removeChild(popup);
  });
  popup.appendChild(closeButton);

  document.body.appendChild(popup);
}

function createPopup(content, instructions, stepIndex = 0) {
  // Code to create and display instructions in a popup
  const popup = document.createElement("div");
  popup.id = "ai-guide-popup";
  popup.style.position = "fixed";
  popup.style.top = "20px";
  popup.style.left = "50%";
  popup.style.transform = "translateX(-50%)";
  popup.style.width = "600px";
  popup.style.backgroundColor = "#f8f4f0";
  popup.style.borderRadius = "15px";
  popup.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.1)";
  popup.style.zIndex = 10000;
  popup.style.padding = "20px";
  popup.style.fontFamily = "'Inter', sans-serif";
  popup.style.border = "2px solid #0c0c18";

  const titleDiv = document.createElement("div");
  titleDiv.style.fontSize = "20px";
  titleDiv.style.fontWeight = "600";
  titleDiv.style.marginBottom = "10px";
  titleDiv.style.color = "#1A202C";
  titleDiv.innerText = "Follow these step-by-step instructions";
  popup.appendChild(titleDiv);

  const stepCountDiv = document.createElement("div");
  stepCountDiv.style.fontSize = "14px";
  stepCountDiv.style.color = "#718096";
  stepCountDiv.style.marginBottom = "15px";
  stepCountDiv.innerText = `${instructions.length} Steps | ${
    instructions.length * 10
  } seconds`;
  popup.appendChild(stepCountDiv);

  const progressBar = document.createElement("div");
  progressBar.style.width = `${((stepIndex + 1) / instructions.length) * 100}%`;
  progressBar.style.height = "5px";
  progressBar.style.backgroundColor = "#38A169";
  progressBar.style.borderRadius = "5px";
  popup.appendChild(progressBar);

  const closeButton = document.createElement("div");
  closeButton.innerText = "✕";
  closeButton.style.position = "absolute";
  closeButton.style.top = "15px";
  closeButton.style.right = "15px";
  closeButton.style.cursor = "pointer";
  closeButton.style.fontSize = "18px";
  closeButton.style.color = "#718096";
  closeButton.addEventListener("click", () => {
    document.body.removeChild(popup);
    clearPopupState();
  });
  popup.appendChild(closeButton);

  const contentDiv = document.createElement("div");
  contentDiv.style.fontSize = "16px";
  contentDiv.style.color = "#4A5568";
  contentDiv.style.margin = "15px 0";
  contentDiv.innerHTML = `<strong>Step ${stepIndex + 1}:</strong> ${content}`;
  popup.appendChild(contentDiv);

  const buttonContainer = document.createElement("div");
  buttonContainer.style.marginTop = "20px";
  buttonContainer.style.display = "flex";
  buttonContainer.style.justifyContent = "space-between";

  const nextButton = document.createElement("button");
  nextButton.innerText = "Next";
  nextButton.style.padding = "10px 20px";
  nextButton.style.backgroundColor = "#38A169";
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

  const collapseButton = document.createElement("button");
  collapseButton.innerText = "Collapse";
  collapseButton.style.padding = "10px 20px";
  collapseButton.style.backgroundColor = "#E2E8F0";
  collapseButton.style.border = "none";
  collapseButton.style.borderRadius = "5px";
  collapseButton.style.color = "#4A5568";
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
    collapsedIcon.style.backgroundColor = "#38A169";
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

function showCompletionMessage() {
  const completionDiv = document.createElement("div");
  completionDiv.id = "completion-message";
  completionDiv.style.position = "fixed";
  completionDiv.style.bottom = "20px";
  completionDiv.style.left = "50%";
  completionDiv.style.transform = "translateX(-50%)";
  completionDiv.style.backgroundColor = "#38A169";
  completionDiv.style.color = "#fff";
  completionDiv.style.padding = "10px 20px";
  completionDiv.style.borderRadius = "5px";
  completionDiv.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.1)";
  completionDiv.style.fontSize = "16px";
  completionDiv.style.zIndex = "10000";
  completionDiv.innerText = "All steps completed!";

  document.body.appendChild(completionDiv);

  setTimeout(() => {
    completionDiv.remove();
  }, 3000);
}

function clearPopupState() {
  chrome.storage.local.remove(["ai-guide-instructions", "ai-guide-step"]);
}

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

function updateCurrentDomain() {
  const newDomain = new URL(window.location.href).hostname;
  if (newDomain !== currentDomain) {
    currentDomain = newDomain;
    chrome.runtime.sendMessage({
      action: "analyzeWebsite",
      url: `https://${currentDomain}`,
    });
  }
}

function getUpdatedContext() {
  const pageContext = getPageContext();
  return {
    ...pageContext,
    websiteAnalysis,
    currentUrl: window.location.href,
  };
}

function showLoadingSpinner() {
  const spinner = document.createElement("div");
  spinner.id = "ai-guide-spinner";
  spinner.style.position = "fixed";
  spinner.style.top = "50%";
  spinner.style.left = "50%";
  spinner.style.transform = "translate(-50%, -50%)";
  spinner.style.width = "50px";
  spinner.style.height = "50px";
  spinner.style.border = "5px solid #f3f3f3";
  spinner.style.borderTop = "5px solid #3498db";
  spinner.style.borderRadius = "50%";
  spinner.style.animation = "spin 1s linear infinite";
  spinner.style.zIndex = "10001";

  const keyframes = `
    @keyframes spin {
      0% { transform: translate(-50%, -50%) rotate(0deg); }
      100% { transform: translate(-50%, -50%) rotate(360deg); }
    }
  `;
  const style = document.createElement("style");
  style.textContent = keyframes;
  document.head.appendChild(style);

  document.body.appendChild(spinner);
}

function hideLoadingSpinner() {
  const spinner = document.getElementById("ai-guide-spinner");
  if (spinner) {
    spinner.remove();
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "displayInstructions") {
    hideLoadingSpinner();
    const instructions = request.instructions;
    chrome.storage.local.set({
      "ai-guide-instructions": instructions,
      "ai-guide-step": 0,
    });
    createPopup(instructions[0], instructions);

    // Close the popup.html window if instructions are shown
    chrome.runtime.sendMessage({ action: "closePopupWindow" });
  } else if (request.action === "analyzePage") {
    const pageContent = extractPageContent();
    sendResponse({ content: pageContent });
  } else if (request.action === "displayAnalysis") {
    displayAnalysisPopup(request.analysis);
    chrome.runtime.sendMessage({ action: "closePopupWindow" });
  } else if (request.action === "getPageContext") {
    sendResponse({ pageContext: getPageContext() });
  } else if (request.action === "getUpdatedContext") {
    sendResponse(getUpdatedContext());
  } else if (request.action === "websiteAnalysisComplete") {
    websiteAnalysis = request.analysis;
  } else if (request.action === "showLoadingSpinner") {
    showLoadingSpinner();
  } else if (request.action === "hideLoadingSpinner") {
    hideLoadingSpinner();
  }
  return true; // Indicates that the response will be sent asynchronously
});

// Initialize the popup and update the current domain when the page loads
window.addEventListener("load", () => {
  initializePopup();
  updateCurrentDomain();
});

// Update the current domain when the URL changes without a page reload
window.addEventListener("popstate", updateCurrentDomain);
