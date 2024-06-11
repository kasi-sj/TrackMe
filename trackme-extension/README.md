<h1 align="center" id="title">Activity Tracker Chrome Extension</h1>

<p id="description">Activity Tracker Chrome Extension is a browser extension designed to track user screen time and store the data for analysis. It integrates seamlessly with the user's browser to capture screen time metrics and send them to the Activity Tracker backend for storage.</p>


<h2>📱 ScreenShots</h2>

![Screenshot 2024-05-20 233830](https://github.com/kasi-sj/activity-tracker-extension/assets/110708280/a2ca1b96-5eb9-4f4d-8045-eaf363dca02c)
![Screenshot 2024-05-20 233807](https://github.com/kasi-sj/activity-tracker-extension/assets/110708280/ba0e5cdf-0bd9-4b58-8313-202700aa5400)

  
<h2>🧐 Features</h2>

Here're some of the project's best features:

*   Tracks user screen time across websites visited
*   Stores screen time data securely in a PostgreSQL database via the Activity Tracker backend
*   Provides users with insights into their browsing habits and screen time usage

<h2>🛠️ Installation Steps:</h2>

<h3>🚀 Quick Start:</h3>
<p>1. Clone the repository</p>

```
git clone https://github.com/kasi-sj/TrackMe/
```

<p>2. Navigate to the project directory</p>

```
cd  trackme-extension/extension
```

<p>4. Load the extension in Chrome</p>

```
Open Chrome browser
```

```
Go to `chrome://extensions/`
```

```
Enable Developer mode
```

```
Click on "Load unpacked"
```

```
Select the `trackme-extension/extension` folder 
```

<p>5. Sign In into website</p>

```
click the signIn button to sign in with email
```

  
  
<h2>💻 Built with</h2>

Technologies used in the project:

*   HTML & CSS
*   JavaScript
*   Manifest.json

<h1>Important note</h1>
## Project Links
This project is a subproject of **Activity Tracker** and is used for `extension purpose(background worker)`.

- [Repository](https://github.com/kasi-sj/TrackMe/)

<h2>Extension Integration</h2>
<p>
Before signing in, please copy the Extension ID from the Manage Extensions tab. This ID is required to enable communication between the server and the frontend.
</p>

Extension `ID: your-extension-id`

<h3>
Steps to Sign In:
</h3>
<p>
*  Install the browser extension if you haven't already.
</p>
<p>
*  Before signing in, navigate to the Manage Extensions tab and copy the Extension ID provided above.
</p>
<p>
*  During the sign-in process, enter the Extension ID when prompted.
</p>

<p>
  *  This will allow the application to integrate with the extension and track your browser usage.
</p>

<p>
*  This will allow the application to integrate with the extension and track your browser usage.
</p>

<p>
*  To ensure optimal server performance, updates may occur every five minutes. Therefore, if any changes have been made (like adding the website to limit or block ), please consider closing all Chrome windows and reopening them, or alternatively, waiting for a five-minute interval.
</p>
