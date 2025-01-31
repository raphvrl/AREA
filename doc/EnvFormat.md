# 🌍 **Environment Configuration**  

This `.env` file contains the necessary configurations for the **server** and **web**.

### 🖥️ **Server Environment (server/.env)**
```env
# 🌐 Server Configuration
BACKEND_PORT=8080
FRONTEND_PORT=8081

# 🔑 Authentication
TWITTER_CLIENT_SECRET=***
REACT_APP_TWITTER_CALLBACK_URL=***
LINKEDIN_CLIENT_ID=***
LINKEDIN_CLIENT_SECRET=***
JWT_SECRET=your_jwt_secret
CALLBACK_URL=http://localhost:5000/api/auth/linkedin/callback
FRONTEND_URL=http://localhost:8081/

GOOGLE_client_id=***
GOOGLE_client_secret=***

SPOTIFY_CLIENT_ID=***
SPOTIFY_CLIENT_SECRET=***
REACT_APP_AUDD_API_KEY=***

TELEGRAM_BOT_TOKEN=***
TELEGRAM_CHAT_ID=***

DISCORD_CLIENT_ID=***
DISCORD_CLIENT_SECRET=***

GITHUB_CLIENT_ID=***
GITHUB_CLIENT_SECRET=***
DISCORD_WEBHOOK_URL=***

DROPBOX_CLIENT_ID=***
DROPBOX_CLIENT_SECRET=***

NOTION_CLIENT_ID=***
NOTION_CLIENT_SECRET=***

```



### 🖥️ **Web Environment (web/.env)**
```env
# 🌐 Server Configuration
PORT=8080
BACKEND_PORT=8081

```
