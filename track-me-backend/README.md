<h1 align="center" id="title">TrackMe Backend</h1>

<p id="description">TrackMe Backend is the backend component of the TrackMe project. It is built with Ruby on Rails and serves as the server-side logic for handling data storage retrieval and processing.</p>

  
  
<h2>🧐 Features</h2>

Here're some of the project's best features:

*   Provides APIs for storing screen time data in a PostgreSQL database
*   Implements business logic for screen time tracking
*   Handles user authentication and authorization

<h1>
   Project Setup Instructions
</h1>

This project has been set up and installed using Ruby on Rails, following the guide from GoRails. The development environment is Ubuntu WSL on a Windows 11 machine.

<h2>
⏮Preinstallation Steps
</h2>

To complete the preinstallation steps, please follow the instructions in the [GoRails setup guide for Windows 11](https://gorails.com/setup/windows/11).
  
<h2>🛠️ Installation Steps:</h2>

<p>1. Clone the repository</p>

```
git clone https://github.com/kasi-sj/track-me-backend.git
```

<p>2. Navigate to the project directory</p>

```
cd track-me-backend
```

<p>3. Install dependencies</p>

```
bundle install
```

<p>4. Set up environment variables</p>

```
DATABASE_URL=""
```

```
GMAIL_USERNAME=""
```

```
GMAIL_PASSWORD=""
```

```
SECRET_KEY_BASE=""
```

<p>8. Set up the database</p>

```
rails db:create && rails db:migrate
```

<p>9. Start the server</p>

```
rails s
```


## Project Links
This is a subproject of **TrackMe** and is used for `backend purpose`.

- [Repository](https://github.com/kasi-sj/TrackMe/)
  
  
<h2>💻 Built with</h2>

Technologies used in the project:

*   Ruby on Rails
*   PostgreSQL

