# ❤️ MERN Stack Todo App 📋

A simple yet powerful full-stack todo application built with the MERN stack. Organize your tasks efficiently with a clean and responsive user interface.

- [🚀 _Live Project Demo_ 😍](https://mern-todofy.netlify.app/)

## 🚀 About the Project

This is a full-stack Todo application that allows users to create, read, update, and delete (CRUD) tasks. It's built with the MERN stack (MongoDB, Express.js, React.js, Node.js) to provide a seamless and fast user experience.

## 🛠️ Tech Stack

**Client (Frontend):**

- **React.js**: A JavaScript library for building the user interface.
- **HTML, CSS**: For structuring and styling the application.
- **TailwindCSS**: A utility-first CSS framework for rapid UI development.

**Server (Backend):**

- **Node.js**: A JavaScript runtime environment.
- **Express.js**: A web application framework for building the RESTful API.
- **Mongoose**: An object data modeling (ODM) library for MongoDB.

**Database:**

- **MongoDB**: A NoSQL database for storing todos.

## 🌱 Project Structure

The repository is organized into two main folders to separate the frontend and backend concerns.

```bash
/MERN-Todo

├── client/                      # Frontend React application
│   ├── public/
│   ├── src/                     # Source code
│   │   └── App.jsx
│   ├── .env                     # Environment variables
│   ├── index.css                # Global styles
│   ├── index.html               # HTML entry point
│   └── index.jsx                # React entry point
│
└── server/                      # Backend Node.js and Express.js application
│   ├── controllers/             # Request handling logic
│   ├── models/                  # Mongoose schemas
│   ├── node_modules/
│   ├── routes/                  # API route definitions
│   ├── .env                     # Environment variables
│   └── index.js                 # Server entry point
│
└── README.md                    # Project documentation
```

## 🎻 Prerequisites

Before getting started with the Practicing Projects, you should have a basic understanding of `MongoDB, Express.js, React.js, Node.js, HTML, CSS, TailwindCSS and JavaScript.`

## 🔥 Clone this Repository

You need to write the following commands on the terminal screen (in vscode) so that you can run this project locally.

```bash
git clone https://github.com/chetannada/MERN-Todo.git
```

Go to the project directory

```bash
cd MERN-Todo
```

Install dependencies for both client and server:

```bash
Install client dependencies

cd client
npm install

Install server dependencies

cd ../server
npm install
```

Set up environment variables:

    * .env - environment variables for this project to run in development environment (fill with actual values for environment variables)

Run the application:

- In the **server** directory, start the backend server:

  ```bash
  npm run start
  ```

- In the **client** directory, start the frontend app:
  ```bash
  npm run dev
  ```

The client application will now be running on `http://localhost:3000` and the server will be listening on `http://localhost:5000`.

If you want to Fork repository and want to run locally, follow this guidelines [Fork and Clone Github Repository](https://docs.github.com/en/get-started/quickstart/fork-a-repo)

## ✏️ Contributing

This is an Open-Source repository, and contributions are always welcome! If you find an issue, please create a new issue under the "Issues" section. To contribute code, fork the repository and submit a pull request. Your contributions will help make this a valuable resource for the community!

## 🤝 Let's Connect

[![linkedin](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/chetannada/)
[![twitter](https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/chetannada)
[![discord](https://img.shields.io/badge/Discord-5865F2?style=for-the-badge&logo=discord&logoColor=white)](https://discordapp.com/users/916005177838956555)
