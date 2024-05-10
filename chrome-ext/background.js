let startTime;
let endTime;
let currentTabId = null;

// Function to send data to the backend
function sendUsageData(url, duration, device) {
  chrome.storage.local.get(["username"], function (result) {
    const username = result.username || device;

    fetch("http://localhost:5000/data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        device: device,
        url: url,
        duration: duration,
      }),
    }).then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.text(); // Use text() if you're not sure it's always JSON
    });
  });
}

// Listen for tab changes to track active tab and duration
chrome.tabs.onActivated.addListener((activeInfo) => {
  if (currentTabId !== null) {
    endTime = new Date();
    const duration = endTime - startTime; // Duration in milliseconds

    // Get the URL of the previously active tab
    chrome.tabs.get(currentTabId, function (tab) {
      sendUsageData(tab.url, duration, chrome.runtime.id);
    });
  }

  // Update current tab ID and start time
  currentTabId = activeInfo.tabId;
  startTime = new Date();
});

// Also consider window focus and blur events
chrome.windows.onFocusChanged.addListener(function (windowId) {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    if (currentTabId !== null) {
      endTime = new Date();
      const duration = endTime - startTime;

      chrome.tabs.get(currentTabId, function (tab) {
        sendUsageData(tab.url, duration, chrome.runtime.id);
      });
      currentTabId = null;
    }
  } else {
    if (currentTabId === null) {
      chrome.tabs.query({ active: true, windowId: windowId }, function (tabs) {
        if (tabs[0]) {
          currentTabId = tabs[0].id;
          startTime = new Date();
        }
      });
    }
  }
});

// Consider tab closure as well
chrome.tabs.onRemoved.addListener(function (tabId, removeInfo) {
  if (tabId === currentTabId) {
    endTime = new Date();
    const duration = endTime - startTime;

    chrome.tabs.get(tabId, function (tab) {
      if (tab) {
        sendUsageData(tab.url, duration, chrome.runtime.id);
      }
    });
    currentTabId = null;
  }
});
