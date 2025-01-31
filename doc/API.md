# 📚 API Documentation

## 🚀 Introduction
This documentation describes the various APIs available in the **AREA** project. Each section details the endpoints, required parameters, expected responses, and usage examples.

---

## 🔐 Authentication

### 🔑 Sign Up
**📍 Endpoint:** `/signUp`  
**🛠 Method:** `POST`  
**📝 Description:** Creates a new user.

**📌 Parameters:**
- `firstName` (*string, required*): User's first name.
- `lastName` (*string, required*): User's last name.
- `email` (*string, required*): User's email address.
- `password` (*string, required*): User's password.

**📤 Request Example:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "password123"
}
```

**📥 Response:**
```json
{
  "message": "User created successfully"
}
```

---

### 🔑 Sign In
**📍 Endpoint:** `/signIn`  
**🛠 Method:** `POST`  
**📝 Description:** Authenticates an existing user.

**📌 Parameters:**
- `email` (*string, required*): User's email address.
- `password` (*string, required*): User's password.

**📤 Request Example:**
```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

**📥 Response:**
```json
{
  "token": "jwt-token"
}
```

---

## 👤 User Management

### 🔍 Get User Information
**📍 Endpoint:** `/user`  
**🛠 Method:** `GET`  
**📝 Description:** Retrieves the authenticated user's information.

**📌 Headers:**
- `Authorization` (*string, required*): User's JWT token.

**📥 Response:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com"
}
```

---

## 🌐 Integration Services

### 🎵 Spotify Authentication
**📍 Endpoint:** `/auth/spotify`  
**🛠 Method:** `GET`  
**📝 Description:** Redirects the user to Spotify's authentication page.

**📌 Parameters:**
- `email` (*string, required*): User's email address.
- `redirectUri` (*string, required*): URI for redirection after authentication.

### 🎵 Spotify Callback
**📍 Endpoint:** `/auth/spotify/callback`  
**🛠 Method:** `POST`  
**📝 Description:** Handles the Spotify authentication callback and saves tokens.

**📌 Parameters:**
- `code` (*string, required*): Authentication code returned by Spotify.
- `state` (*string, required*): State containing email and `redirectUri`.

**📤 Request Example:**
```json
{
  "code": "auth-code",
  "state": "{\"email\":\"john.doe@example.com\",\"redirectUri\":\"http://localhost:8080/callback\"}"
}
```

**📥 Response:**
```json
{
  "message": "OK"
}
```

---

### 🐙 GitHub Authentication
**📍 Endpoint:** `/auth/github`  
**🛠 Method:** `GET`  
**📝 Description:** Redirects the user to GitHub's authentication page.

**📌 Parameters:**
- `email` (*string, required*): User's email address.
- `redirectUri` (*string, required*): URI for redirection after authentication.

### 🐙 GitHub Callback
**📍 Endpoint:** `/auth/github/callback`  
**🛠 Method:** `POST`  
**📝 Description:** Handles the GitHub authentication callback and saves tokens.

**📌 Parameters:**
- `code` (*string, required*): Authentication code returned by GitHub.
- `state` (*string, required*): State containing email and `redirectUri`.

**📤 Request Example:**
```json
{
  "code": "auth-code",
  "state": "{\"email\":\"john.doe@example.com\",\"redirectUri\":\"http://localhost:8080/callback\"}"
}
```

**📥 Response:**
```json
{
  "message": "OK"
}
```

---

## 📋 AREA Management

### ➕ Create an AREA
**📍 Endpoint:** `/setArea`  
**🛠 Method:** `POST`  
**📝 Description:** Creates a new AREA for the user.

**📌 Parameters:**
- `email` (*string, required*): User's email address.
- `action` (*string, required*): Action to monitor.
- `reaction` (*string, required*): Reaction to trigger.

**📤 Request Example:**
```json
{
  "email": "john.doe@example.com",
  "action": "new_email",
  "reaction": "send_notification"
}
```

**📥 Response:**
```json
{
  "message": "AREA created successfully"
}
```

### ❌ Delete an AREA
**📍 Endpoint:** `/deleteArea`  
**🛠 Method:** `DELETE`  
**📝 Description:** Deletes an existing AREA.

**📌 Parameters:**
- `email` (*string, required*): User's email address.
- `nomArea` (*string, required*): Name of the AREA to delete.

**📤 Request Example:**
```json
{
  "email": "john.doe@example.com",
  "nomArea": "my_area"
}
```

**📥 Response:**
```json
{
  "message": "AREA deleted successfully"
}
```

---

## 📄 Conclusion
This documentation provides an overview of the available APIs in the **AREA** project. For more details on each endpoint, please refer to the source code or contact the development team. 🚀
