var userId = null;
async function fetchHtml(file) {
  const response = await fetch(file);
  return response.text();
}

async function sayHello(url) {
  chrome.runtime.sendMessage({ url: url }, function (response) {
    console.log(response.access);
  });
}

document
  .getElementById("signIn")
  .addEventListener("click", () =>
    sayHello("https://trackme-web-jade.vercel.app/signIn")
  );

document
  .getElementById("signUp")
  .addEventListener("click", () =>
    sayHello("https://trackme-web-jade.vercel.app/signUp")
  );

async function getId() {
  chrome.runtime.sendMessage({ needId: true }, async function (response) {
    userId = response.userId;
    console.log(userId);
    if (userId) {
      const dashboardHtml = await fetchHtml("dashboard.html");
      document.getElementById("wrapper").innerHTML = dashboardHtml;
      document
        .getElementById("dashboard")
        .addEventListener("click", () =>
          sayHello("https://trackme-web-jade.vercel.app/dashboard")
        );
      document.getElementById("logout").addEventListener("click", handleLogout);
      document.getElementById("blocking").addEventListener("change", () => {
        chrome.runtime.sendMessage({
          set: true,
          stopBlocking: document.getElementById("blocking").checked,
          stopTracking: document.getElementById("tracking").checked,
        });
      });
      document.getElementById("tracking").addEventListener("change", () => {
        chrome.runtime.sendMessage({
          set: true,
          stopBlocking: document.getElementById("blocking").checked,
          stopTracking: document.getElementById("tracking").checked,
        });
      });
    } else {
      const dashboardHtml = await fetchHtml("index.html");
      document.getElementById("wrapper").innerHTML = dashboardHtml;
      document
        .getElementById("signIn")
        .addEventListener("click", () =>
          sayHello("https://trackme-web-jade.vercel.app/signIn")
        );

      document
        .getElementById("signUp")
        .addEventListener("click", () =>
          sayHello("https://trackme-web-jade.vercel.app/signUp")
        );
    }
  });
}

async function getProps() {
  if (!userId) return;
  chrome.runtime.sendMessage({ get: true }, async function (response) {
    const stopBlocking = response.stopBlocking;
    const stopTracking = response.stopTracking;
    document.getElementById("blocking").checked = stopBlocking;
    document.getElementById("tracking").checked = stopTracking;
    console.log("updating error");
  });
}

async function handleLogout() {
  sayHello("https://trackme-web-jade.vercel.app/");
}

getId();
setInterval(getId, 1000 * 20);
getProps();
setInterval(getProps, 1000);
