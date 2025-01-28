# AREA

![AREA Banner](doc/assets/AREA.webp)

##  📂 Project Concept

Welcome to the **Action-REAction** project!

An AREA is a key “zone” or module in the Action-REAction project, which functions as an automation unit. Inspired by the concepts of tools like IFTTT and Zapier, an AREA allows you to link an action (Action) to a reaction (Reaction).

For example :

- Action: "A new email arrives in your Gmail box."
- Reaction: “Send a notification on Slack.”

AREAs thus serve as a bridge between different platforms or services, allowing personalized automation to be created based on user needs.


## 🎯 Objectives

Develop a software suite consisting of:

1. **Application Server**: Implements all core logic.
2. **Web Client**: User interface accessible via a browser.
3. **Mobile Client**: User interface accessible via a smartphone.

The REST API server manages all processes, while the web and mobile clients only display data and forward requests.


## 📋 Features

- User registration and authentication (via OAuth2 or password).
- User management and administration.
- Subscription to third-party services (Google, Facebook, etc.).
- Creation of AREA zones linking actions to reactions.
- Management of triggers to automate actions.

## 🛠️ Technologies Used

This project uses the following technologies:

- **Node.js** for the back end
<img alt="Node.js Logo" src="https://img.shields.io/badge/Node.js-339933?logo=node.js&amp;logoColor=white">
- **MongoDB** for the database
<img alt="MongoDB Logo" src="https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&amp;logoColor=white">
- **ReactJS** for the web front-end
<img alt="React Logo" src="https://img.shields.io/badge/ReactJS-61DAFB?logo=react&amp;logoColor=white">
- **Expo** for the mobile front-end
<img alt="Expo Logo" src="https://img.shields.io/badge/Expo-000020?logo=expo&amp;logoColor=white">
- **Docker** for containerization
<img alt="Docker Logo" src="https://img.shields.io/badge/Docker-2496ED?logo=docker&amp;logoColor=white">
- **GitHub Actions** for continuous integration
<img alt="GitHub Actions Logo" src="https://img.shields.io/badge/GitHub_Actions-2088FF?logo=github-actions&amp;logoColor=white">

## 🐳️ Setup with Docker Compose

The project includes three main services configured via `docker-compose`:

- `server`: Application server (port 8080).
- `client_web`: Web client (port 8081).
- `client_mobile`: Mobile client.

## 🚀 Run Project

### Prerequisites
- **Docker** and **Docker Compose** installed on your machine.
- `.env` file containing API keys and OAuth2 secrets.

### Steps

1. **Clone the repository** :
   ```bash
   git clone git@github.com:EpitechPromo2027/B-DEV-500-BDX-5-2-area-thomas.gaboriaud.git
   cd B-DEV-500-BDX-5-2-area-thomas.gaboriaud

2. **Run Server:** *```in /server```*

    ```npm install && nodemon server.js```

3. **Run web:** *```in /web```*

    ```npm install && npm run dev```

## 📖 Documentation

For detailed information about the project, please visit the [Documentation](docs/). 📚

---

## ✨ Authors

- [Raphaël Verrouil](https://github.com/raphvrl)
- [Thomas Gaboriaud](https://github.com/ThomasGaboriaud)
- [Tom Freida](https://github.com/TomFrda)
- [Raphaël Fouche](https://github.com/Raphael331100)
- [Mathieu Mayard](https://github.com/Mathieu17M)
