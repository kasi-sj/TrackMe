var restrictedUrl = [];
const windowToActiveTab = new Map();
const urlTime = new Map();
const idToUrl = new Map();
const urlToId = new Map();
var userId = null;
var stopBlocking = false;
var stopTracking = false;

const printUserId = () => {
  chrome.storage.local.get(["userId"], function (result) {
    userId = result.userId;
    console.log("User ID:", userId);
  });
  chrome.storage.local.get(["stopBlocking"], function (result) {
    if (result.stopBlocking) stopBlocking = result.stopBlocking;
    else stopBlocking = false;
    console.log("stopBlocking:", stopBlocking);
  });
  chrome.storage.local.get(["stopTracking"], function (result) {
    if (result.stopTracking) stopTracking = result.stopTracking;
    else stopTracking = false;
    console.log("stopTracking:", stopTracking);
  });
};

chrome.tabs.onActivated.addListener(function (activeInfo) {
  console.log("activate in " + activeInfo.windowId);
  const tabId = activeInfo.tabId;
  chrome.tabs.get(tabId, function (tab) {
    const url = tab.url;
    if (idToUrl.has(tabId)) {
      const prevUrl = idToUrl.get(tabId);
      urlToId.set(
        prevUrl,
        urlToId.get(prevUrl).filter((id) => id !== tabId)
      );
      idToUrl.set(tabId, url);
      if (!urlToId.has(url)) {
        urlToId.set(url, []);
      }
      urlToId.get(url).push(tabId);
    } else {
      idToUrl.set(tabId, url);
      if (!urlToId.has(url)) {
        urlToId.set(url, []);
      }
      urlToId.get(url).push(tabId);
    }
    windowToActiveTab.set(tab.windowId, tabId);
  });
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  console.log("update in " + tab.windowId);
  chrome.tabs.get(tabId, function (tab) {
    const url = tab.url;
    if (idToUrl.has(tabId)) {
      const prevUrl = idToUrl.get(tabId);
      urlToId.set(
        prevUrl,
        urlToId.get(prevUrl).filter((id) => id !== tabId)
      );
      idToUrl.set(tabId, url);
      if (!urlToId.has(url)) {
        urlToId.set(url, []);
      }
      urlToId.get(url).push(tabId);
    } else {
      idToUrl.set(tabId, url);
      if (!urlToId.has(url)) {
        urlToId.set(url, []);
      }
      urlToId.get(url).push(tabId);
    }
    windowToActiveTab.set(tab.windowId, tabId);
  });
});

chrome.tabs.onRemoved.addListener(function (tabId, removeInfo) {
  const url = idToUrl.get(tabId);
  const windowId = removeInfo.windowId;
  console.log("remove in " + windowId);
  urlToId.set(
    url,
    urlToId.get(url).filter((id) => id !== tabId)
  );
  idToUrl.delete(tabId);
  windowToActiveTab.delete(windowId);
});

chrome.windows.onRemoved.addListener(function (windowId) {
  console.log("window remove in " + windowId);
  sendData();
});

function checkTabs() {
  if (stopTracking) return;
  if (windowToActiveTab.size === 0) return;
  for (let ids of windowToActiveTab.values()) {
    const activeUrl = idToUrl.get(ids);
    if (activeUrl === null || activeUrl === undefined) continue;
    if (!urlTime.has(activeUrl)) {
      urlTime.set(activeUrl, 0);
    }
    urlTime.set(activeUrl, urlTime.get(activeUrl) + 1);
  }
}

async function checkResticted() {
  if (stopBlocking) return;
  if (windowToActiveTab.size === 0) return;
  console.log(restrictedUrl);
  for (let websiteId of windowToActiveTab.keys()) {
    const activeId = windowToActiveTab.get(websiteId);
    const activeUrl = idToUrl.get(activeId);
    for (const entry of restrictedUrl) {
      const url = entry.domain;
      if (activeUrl.includes(url)) {
        if (entry.type === "TLE") {
          for (const tabId of urlToId.get(activeUrl)) {
            chrome.tabs.remove(tabId);
            idToUrl.delete(tabId);
          }
          urlToId.delete(activeUrl);
          urlTime.delete(activeUrl);
          if (windowToActiveTab.has(websiteId))
            chrome.scripting.executeScript({
              target: { tabId: windowToActiveTab.get(websiteId) },
              function: executeContentScript,
              args: ["Time Limit Exceeded " + activeUrl], // Pass activeUrl as an argument
            });
        } else {
          chrome.scripting.executeScript({
            target: { tabId: activeId },
            function: executeContentScript,
            args: ["Resticted domain " + activeUrl], // Pass activeUrl as an argument
          });
        }
      }
    }
  }
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(request);
  if (request.needId === true) {
    sendResponse({ userId: userId });
  } else if (request.removeId === true) {
    chrome.storage.local.remove(["userId"], function () {
      console.log("Value is removed");
    });
  } else if (request.set) {
    stopTracking = request.stopTracking;
    chrome.storage.local.set({ stopTracking: stopTracking }, function () {
      console.log("stop prop changed " + stopTracking);
    });
    stopBlocking = request.stopBlocking;
    chrome.storage.local.set({ stopBlocking: stopBlocking }, function () {
      console.log("block prop changed " + stopBlocking);
    });
  } else if (request.get) {
    sendResponse({ stopBlocking, stopTracking });
  } else {
    chrome.tabs.create({ url: request.url }, function (tab) {
      sendResponse({ access: "yes" });
    });
  }
});

chrome.runtime.onMessageExternal.addListener(async function (
  request,
  sender,
  sendResponse
) {
  if (request.name === "AUTHORIZE_EXTENSION") {
    chrome.storage.local.set({ userId: request.userId }, function () {
      console.log("user id set to " + request.userId);
      userId = request.userId;
    });
  }
});

async function postData(url, data) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const responseData = await response.json();
    console.log("Success:", responseData);
    return responseData;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

function sendData() {
  const urlTimeData = new Map();
  urlTime.forEach((value, key) => {
    urlTimeData.set(key, value);
    urlTime.set(key, 0);
  });
  console.log(urlTimeData);
  if (urlTimeData.size === 0) return;
  urlTimeData.forEach((time, url) => {
    const data = {
      tracked_website: {
        user_id: userId,
        websiteurl: url,
        date: new Date().toISOString().split("T")[0],
        time: [new Date().toISOString()],
        total_live_time: time,
      },
    };
    console.log(data);
    postData(
      "https://track-me-backend-n5qp.onrender.com/tracked_websites",
      data
    );
  });
}

async function getResticted() {
  try {
    const response = await fetch(
      `https://track-me-backend-n5qp.onrender.com/restricted_websites/user/${userId}/exceeded`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const responseData = await response.json();
    restrictedUrl = responseData;
    console.log("Success:", responseData);
    return responseData;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

function executeContentScript(string) {
  alert(string);
}

const initialSetUp = async () => {
  for (var i = 0; i < 5; i++) {
    printUserId();
    getResticted();
    checkResticted();
    checkTabs();
    sendData();
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
};

initialSetUp();

setInterval(printUserId, 1000);

setInterval(getResticted, 1000 * 60 * 5);

setInterval(checkResticted, 1000);

setInterval(checkTabs, 1000);

setInterval(sendData, 1000 * 60 * 5);
