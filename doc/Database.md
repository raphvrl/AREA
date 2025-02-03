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

## 🤔 **Why Not PostgreSQL?**

### ❌ **Key Limiting Factors**

1. **SQL Constraints**
   - Rigid schema complicates rapid prototyping
   - Complex migrations for schema changes
   - Overhead for simple document-style data

2. **Hosting Complexity**
   - More complex setup and maintenance
   - Manual scaling configuration required
   - Higher infrastructure management overhead

3. **Team Collaboration**
   - Local setup required for each developer
   - More complex backup and restore procedures
   - Steeper learning curve for team members

## 🤔 **Why Not Firebase Firestore?**

### ❌ **Key Limiting Factors**

1. **Platform Limitations**
   - Vendor lock-in with Google ecosystem
   - Limited query capabilities
   - Restricted data modeling options

2. **Cost Structure**
   - Pay-per-operation model can be expensive
   - Higher costs for read-heavy applications
   - Limited free tier capabilities

3. **Development Constraints**
   - Restricted batch operations
   - Complex migration from other databases

## 🤔 **Why MongoDB?**

### 🌟 **Key Decision Factors**

1. **NoSQL Benefits**
   - Flexible schema allowing rapid data model evolution
   - Perfect for storing unstructured data (JSON)
   - Easy integration of new services without schema modification

2. **MongoDB Atlas Advantages**
   - Cloud-hosted database
   - 24/7 accessibility for all team members
   - Simplified management through MongoDB Compass
   - Automatic backup and integrated security
   - Automatic scaling based on needs

3. **Team Collaboration**
   - Unified access for all developers
   - No local configuration needed
   - Identical development environment for the whole team
   - Facilitates continuous integration (CI/CD)

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
