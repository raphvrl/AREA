# 📊 Comparative Study of Technologies

## 🛢️ **Database: MongoDB** ![MongoDB Logo](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white)

| Technology           | Strengths 🚀 | Weaknesses ⚠️ |
|----------------------|-------------|---------------|
| **MongoDB**         | - **Schema-less** *(flexible for evolving projects)*<br> - **Great for large-scale applications**<br> - **Easy replication & sharding** | - **Less structured than SQL** *(not ideal for relational data)*<br> - **Higher memory usage** |
| **PostgreSQL**      | - **ACID-compliant & strong relational support**<br> - **Great for structured data** | - **More complex schema migrations**<br> - **Less suited for unstructured data** |
| **Firebase Firestore** | - **Easy to integrate with web & mobile apps**<br> - **Real-time sync capabilities** | - **Vendor lock-in with Google**<br> - **Limited querying capabilities** |

---

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
