# MERN Stack Blog Application

A full-stack blog application built with the MERN (MongoDB, Express.js, React.js, Node.js) stack, demonstrating seamless integration between the frontend and backend. This application allows users to register, log in, create, view, edit, and delete blog posts, manage categories, and interact through comments.

## ✨ Features

*   **User Authentication**: Secure user registration, login, and logout with JSON Web Tokens (JWT).
*   **Role-Based Access Control**: Differentiate between 'user' and 'admin' roles, with administrative privileges for managing posts and categories.
*   **CRUD for Blog Posts**: Create, Read, Update, and Delete blog posts.
*   **Category Management**: Organize posts using categories with CRUD functionality.
*   **Commenting System**: Authenticated users can add comments to blog posts.
*   **Slug Generation**: Automatic generation of SEO-friendly slugs for posts and categories.
*   **Responsive Design**: A user-friendly interface that adapts to various screen sizes, built with Tailwind CSS.
*   **Form Validation**: Robust input validation on both client and server sides using Joi.
*   **Centralized State Management**: Utilizes React Context API for authentication and notifications.

## 🚀 Technologies Used

### Frontend (Client)

*   **React (with Preact)**: A fast and lightweight JavaScript library for building user interfaces.
*   **Vite**: A next-generation frontend tooling that provides an extremely fast development experience.
*   **React Router**: For declarative routing in the React application.
*   **Tailwind CSS**: A utility-first CSS framework for rapid UI development.
*   **Axios**: Promise-based HTTP client for making API requests.
*   **Context API**: For global state management (Authentication, Notifications).

### Backend (Server)

*   **Node.js**: JavaScript runtime for server-side logic.
*   **Express.js**: A fast, unopinionated, minimalist web framework for Node.js.
*   **MongoDB**: A NoSQL document database for storing application data.
*   **Mongoose**: An ODM (Object Data Modeling) library for MongoDB and Node.js.
*   **JSON Web Tokens (JWT)**: For secure user authentication and authorization.
*   **Bcrypt.js**: For hashing passwords.
*   **Joi**: For powerful schema description and data validation.
*   **CORS**: Middleware for enabling Cross-Origin Resource Sharing.

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed:

*   **Node.js**: [LTS version recommended](https://nodejs.org/en/)
*   **npm** (Node Package Manager) or **Yarn**: Comes with Node.js or can be installed separately.
*   **MongoDB**: [Community Server](https://www.mongodb.com/try/download/community) or access to a MongoDB Atlas cluster.

## ⚙️ Setup Instructions

Follow these steps to get the project up and running on your local machine.

### 1. Clone the Repository

```bash
git clone https://github.com/VictorOduorKe/mern-stack-integration-VictorOduorKe.git
cd mern-stack-integration-VictorOduorKe
```

### 2. Backend Setup

Navigate to the `server` directory and install dependencies.

```bash
cd server
npm install # or yarn install
```

#### Environment Variables

Create a `.env` file in the `server/` directory with the following content:

```env
PORT=5000
MONGO_URI="mongodb://localhost:27017/mern_blog_db" # Replace with your MongoDB URI
JWT_SECRET="YOUR_SUPER_SECRET_JWT_KEY" # Generate a strong secret key
CLIENT_URL="http://localhost:5173" # Or wherever your client is running
```

*   `PORT`: The port your Express server will run on.
*   `MONGO_URI`: Your MongoDB connection string. For local MongoDB, it's typically `mongodb://localhost:27017/mern_blog_db`. For MongoDB Atlas, use your connection string.
*   `JWT_SECRET`: A strong, random string used to sign and verify JWTs.
*   `CLIENT_URL`: The URL of your frontend application. This is crucial for CORS.

#### Run the Backend Server

```bash
npm start # or node server.js
```

The server will start on `http://localhost:5000` (or your specified PORT).

### 3. Frontend Setup

Open a new terminal, navigate to the `client` directory, and install dependencies.

```bash
cd ../client # If you are in the server directory
npm install # or yarn install
```

#### Run the Frontend Application

```bash
npm run dev # or vite
```

The frontend application will start on `http://localhost:5173` (or another available port). Open your browser and navigate to this URL.

## 🚀 Usage

1.  **Register / Login**: Access the application in your browser. Register a new account or log in with existing credentials.
2.  **Admin Role**: For full administrative features (like creating categories or editing any post), you will need to manually update a user's `role` to `'admin'` directly in your MongoDB database. By default, new registrations are `'user'`.
3.  **Create Posts**: Once logged in, you can create new blog posts with a title, content, image, category, and tags.
4.  **View Posts**: Browse through the list of blog posts on the home page or click on individual posts for more details.
5.  **Edit/Delete Posts**: If you are the author of a post or an admin, you will see "Edit" and "Delete" buttons on the blog list and post detail pages.
6.  **Add Comments**: Logged-in users can add comments to any post.

## 📂 Project Structure

```
.
├── client/                 # Frontend (React/Preact with Vite)
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── app.css
│   │   ├── App.jsx         # Main application component & routing
│   │   ├── assets/
│   │   ├── components/     # Reusable UI components (Button, Modal, NavBar, NotificationDisplay)
│   │   ├── context/        # React Context for Auth, Notifications, Theme
│   │   ├── hooks/          # Custom React hooks (useAuth, useApi)
│   │   ├── pages/          # Page-specific components (Blog, Home, Auth, Category)
│   │   ├── services/       # API interaction services (authService, postService, etc.)
│   │   ├── index.css
│   │   └── main.jsx        # Entry point for the React app
│   ├── vite.config.js      # Vite configuration
│   └── package.json
├── server/                 # Backend (Node.js/Express.js)
│   ├── config/             # Database connection, etc.
│   ├── controllers/        # Logic for handling API requests
│   ├── middleware/         # Custom middleware (auth, validation)
│   ├── models/             # Mongoose schemas and models
│   ├── routes/             # API route definitions
│   ├── seeds/              # Database seeding scripts
│   ├── utils/              # Utility functions
│   ├── server.js           # Main Express server entry point
│   └── package.json
└── README.md               # Project overview and instructions
```

## 🤝 Contributing

Contributions are welcome! If you find a bug or have an improvement, please open an issue or submit a pull request.

## 📄 License

This project is licensed under the MIT License. 