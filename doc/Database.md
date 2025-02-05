# 📊 Comparative Study of Technologies

## 🛢️ **Database: MongoDB** ![MongoDB Logo](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white)

| Technology           | Strengths 🚀 | Weaknesses ⚠️ |
|----------------------|-------------|---------------|
| **MongoDB**         | - **NoSQL Benefits:** flexible schema, JSON-friendly<br> - **Hosting:** Cloud-based Atlas platform, automatic scaling<br> - **Team:** Unified access, no local setup needed | - **NoSQL Limitations:** Complex relations handling<br> - **Hosting:** Higher operational costs<br> - **Team:** Requires MongoDB Compass knowledge |
| **PostgreSQL**      | - **SQL Benefits:** Strong data consistency, relations<br> - **Hosting:** Self-hosted or cloud options<br> - **Team:** Mature tools ecosystem | - **SQL Limitations:** Rigid schema<br> - **Hosting:** Manual scaling setup<br> - **Team:** Complex local configuration |
| **Firebase Firestore** | - **NoSQL Benefits:** Real-time sync, flexible schema<br> - **Hosting:** Google Cloud integrated<br> - **Team:** Simple authentication setup | - **NoSQL Limitations:** Limited querying<br> - **Hosting:** Google vendor lock-in<br> - **Team:** Limited admin controls |

---

## 💡 **Why Compare These Technologies?**  

When selecting a database, it's crucial to consider various factors such as scalability, ease of use, flexibility, and integration with your existing technology stack. Here’s why we are comparing these three database solutions:  

- **MongoDB**: We have extensive experience using MongoDB in multiple projects and are highly proficient with its features and capabilities.  
- **PostgreSQL**: Recognized as one of the most widely used and respected open-source relational databases, PostgreSQL is known for its robust data consistency and reliability.  
- **Firebase Firestore**: Developed by Google, Firebase Firestore is a NoSQL database optimized for mobile and web applications, offering seamless real-time data synchronization.  

This comparative study helps us determine which database aligns best with our project needs, balancing performance, cost, and development efficiency.

## 🔄 **Database Comparison**

### 📊 **PostgreSQL Analysis**

1. **How It Handles Data** 🔄
   + Really good at keeping data organized
   - Have to plan everything ahead
   - Changing stuff later is a pain
   
2. **Where to Host It** 🌐
   + Works with all the big cloud providers
   + Good support if things break
   - Need to know server stuff (yikes)
   
3. **Team Setup** 👥
   + Security is solid
   - Everyone needs to install it locally (ugh)
   - Sharing configs is complicated

### 🔥 **Firebase Firestore Analysis**

1. **How It Handles Data** 🔄
   + Super flexible with how you store stuff
   + Can change things on the fly
   - Gets tricky with complex queries
   
2. **Where It Lives** ☁️
   + Just works out of the box
   + Handles scaling by itself
   - Stuck in Google's ecosystem
   
3. **Team Stuff** 👥
   + Login system ready to go
   + Updates happen in real-time
   - Not much control over admin things

### 📦 **MongoDB Analysis**

1. **How It Handles Data** 🔄
   + Can change data structure whenever we want
   + Works great with JSON (perfect for our APIs)
   - Gets messy with linked data
   
2. **Where It Lives** ☁️
   + Atlas handles all the hosting stuff
   + Works with different cloud services
   - Gets expensive if project grows big
   
3. **Working Together** 👥
   + Compass makes it easy to manage
   + Everyone can access from anywhere
   + No need to install stuff locally

### ✅ **Final Recommendation: Firebase Firestore**

Given our specific requirements:
- Needs minimal infrastructure management
- Requires easy team sharing
- Benefits from flexible schema

Firebase Firestore offers the best balance of:
1. Zero-configuration cloud hosting
2. Built-in authentication and sharing
3. Sufficient schema flexibility for our needs
4. Most cost-effective for small to medium projects

### 🎯 **Why We Chose MongoDB**

We finally opted for mongoDB because:
- We've used it before in other projects, reducing the learning curve
- It matched our technical requirements (schema flexibility, cloud hosting, team collaboration)
- It allowed us to jump straight into coding features instead of wasting precious project time learning another database

## 📖 **Detailed Documentation on MongoDB**

### 📌 **Overview**
MongoDB is a **NoSQL database** that uses a **document-oriented data model**. It is designed for **scalability** and **flexibility**, making it ideal for **large-scale applications**.

### 🔑 **Key Features**
- **⚡ Schema-less**: Allows for flexible and dynamic data models.
- **🚀 High Performance**: Optimized for read and write operations.
- **📈 Scalability**: Supports horizontal scaling through **sharding**.
- **🔄 Replication**: Provides high availability with **replica sets**.
- **🔍 Indexing**: Supports various types of indexes to improve **query performance**.

### 🎯 **Use Cases**
- **📊 Real-time Analytics**: Suitable for applications requiring real-time data processing.
- **📝 Content Management**: Ideal for managing large volumes of unstructured content.
- **🌍 Internet of Things (IoT)**: Efficiently handles time-series data from IoT devices.

---

## ⚙️ **Installation and Setup**

1. **📥 Download MongoDB**: Visit the [official MongoDB website](https://www.mongodb.com/try/download/community) to download the latest version.
2. **🖥️ Install MongoDB**: Follow the installation instructions for your operating system.
3. **🚀 Start MongoDB**: Use the command `mongod` to start the MongoDB server.
4. **🔗 Connect to MongoDB**: Use the MongoDB shell or a client like [MongoDB Compass](https://www.mongodb.com/products/compass) to connect to the database.

---

## 📊 **Database Schema**

```mermaid
erDiagram
    USER {
        String firstName
        String lastName
        String email
        Map apiKeys
        Map idService
        Map service
        String lastFirstName
        String password
        Map area
        Object spotify
    }

    AREA {
        String action
        String reaction
        String is_on
    }

    SPOTIFY {
        Array savedTracks
    }

    USER ||--o{ AREA : contains
    USER ||--|| SPOTIFY : has
```


### 📑 **Document Example**

```json
// Example of a User document in MongoDB
{
  "_id": "507f1f77bcf86cd799439011",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "hashedPassword123",
  "lastFirstName": "Doe John",
  
  // API keys for different services
  "apiKeys": {
    "spotify": "spotify_api_key_here",
    "github": "github_api_key_here"
  },
  
  // Service IDs
  "idService": {
    "spotify": "spotify_user_id",
    "github": "github_username"
  },
  
  // Service states
  "service": {
    "spotify": true,
    "github": false
  },
  
  // User's AREA automations
  "area": {
    "area1": {
      "action": "SPOTIFY_LIKED_SONG",
      "reaction": "GITHUB_CREATE_ISSUE",
      "is_on": true
    },
    "area2": {
      "action": "GITHUB_NEW_STAR",
      "reaction": "SPOTIFY_CREATE_PLAYLIST",
      "is_on": false
    }
  },
  
  // Spotify specific data
  "spotify": {
    "savedTracks": [
      "track_id_1",
      "track_id_2"
    ]
  }
}

```

## 🛠️ **Database Operations**

### 🔗 **Connecting to MongoDB**
To connect to MongoDB, use the `mongoose` library. Here is an example from **server/src/db/db.ts**:

```ts
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(
      'mongodb+srv://root:root@cluster0.1iiqj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
    );
    console.log('✅ MongoDB Connected...');
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message); // Ensure 'err' is an instance of Error
    } else {
      console.error('❌ Unexpected error', err);
    }
    process.exit(1); // Exit process in case of critical error
  }
};

export default connectDB;
```

---

## 📝 **CRUD Operations**

### ➕ **Create**
To create a new user, use the `userModel` from `userModel.ts`:

```ts
import userModel from '../db/userModel';

const createUser = async (userData) => {
  const newUser = new userModel(userData);
  await newUser.save();
  console.log('✅ User created:', newUser);
};
```

### 🔍 **Read**
To read user data, use the `findOne` method:

```ts
const getUserByEmail = async (email) => {
  const user = await userModel.findOne({ email });
  console.log('🔎 User found:', user);
  return user;
};
```

### 🔄 **Update**
To update user data, use the `updateOne` method:

```ts
const updateUser = async (email, updateData) => {
  await userModel.updateOne({ email }, updateData);
  console.log('✅ User updated');
};
```

### ❌ **Delete**
To delete a user, use the `deleteOne` method:

```ts
const deleteUser = async (email) => {
  await userModel.deleteOne({ email });
  console.log('🗑️ User deleted');
};
```

---

## 🔥 **Best Practices**

- **⚡ Indexing**: Create indexes on frequently queried fields to improve performance.
- **🛠️ Data Modeling**: Design your schema according to the application's access patterns.
- **📀 Backup and Restore**: Regularly back up your data and test the restore process.
- **🔒 Security**: Implement authentication and authorization to secure your database.

---

## 📚 **Resources**

📖 **[MongoDB Documentation](https://www.mongodb.com/docs/)**  
🎓 **[MongoDB University](https://university.mongodb.com/)**  
💬 **[MongoDB Community Forums](https://www.mongodb.com/community/forums/)**  
