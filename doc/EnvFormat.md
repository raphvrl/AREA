# 🌍 **Environment Configuration**  

This `.env` file contains the necessary configurations for the **server** and **web**.

### 🖥️ **Server Environment (server/.env)**
```env
# 🌐 Server Configuration
BACKEND_PORT=8080
FRONTEND_PORT=8081

# 🔑 Authentication
JWT_SECRET=your_super_secret_key
ACCESS_TOKEN_EXPIRY=3600
REFRESH_TOKEN_EXPIRY=86400

# 🛢️ Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=your_database

# GitHub OAuth
# Telegram OAuth
```



### 🖥️ **Web Environment (web/.env)**
```env
# 🌐 Server Configuration
PORT=8080
BACKEND_PORT=8081

```
