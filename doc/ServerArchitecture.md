# 🛠️ **Server Architecture Overview**

This is the high-level structure of the server architecture, designed for clarity and modularity. Each part of the architecture is responsible for a specific task, making it easy to scale and maintain.  

## 🌲 **Directory Structure**
```
src/
│
├── 🖥️ server/          # Launches the server
│
├── 🌐 routes/          # Contains all routes
│
├── 🛠️ api/             # Includes all APIs
│
├── 🗄️ db/              # Manages database connections
│
├── ⚙️ service/         # Handles business logic
│   ├── ✨ action/      # Handles actions
│   └── 🔁 reaction/    # Handles reactions
│
├── 🧩 area_handler/    # Manages AREAs (automation zones)
│
└── ⏳ task/            #  Executes user actions and reactions
```
---

## 📂 **Detailed Explanation**

### 🖥️ `server/`  
This is the **entry point** of the application. It initializes the server and sets up all required configurations.

### 🌐 `routes/`  

This folder is responsible for organizing the routes of the application:  
- **🛠️ `api/`**: Contains all the APIs exposed by the server.  
- **🗄️ `db/`**: Manages the connection to the database, ensuring data integrity and availability.  
- **⚙️ `service/`**: The core business logic layer:  
  - **✨ `action/`**: Handles user-defined actions.  
  - **🔁 `reaction/`**: Manages reactions triggered by actions.  
- **🧩 `area_handler/`**: Responsible for managing AREAs, which connect actions to reactions.  
- **⏳ `task/`**: Executes user-defined workflows (actions and reactions).  

---

## 📐 **Visual Representation**

Here’s a simplified representation of how the server architecture works:


### 📋 **Process Flow**
1. **User Request**: A user interacts with the server through a defined API.  
2. **Routes**: The request is routed to the appropriate handler (e.g., API, database, or task executor).  
3. **Services**: The core business logic executes the requested operation (e.g., triggering an action or managing an AREA).  
4. **Database**: Relevant data is retrieved or updated based on the request.

---

## 🎯 **Key Advantages**
- **Modularity**: Each folder handles a specific responsibility, improving maintainability.  
- **Scalability**: The structure supports adding new features (e.g., more AREAs or tasks) without breaking the existing architecture.  
- **Clarity**: The separation of concerns makes debugging and development easier.  
