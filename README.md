# 🏡 WanderLust – Vacation Rental Web Application

A full-stack vacation rental web application built using **Node.js, Express.js, MongoDB, Mongoose, and EJS**. The application enables users to create and manage property listings, upload images, authenticate securely, and post reviews while following RESTful architecture and server-side rendering.

---

## 🚀 Features

- User Authentication & Authorization using Passport.js
- Secure session management with Express Session
- Flash messages for user feedback
- Create, Read, Update, and Delete (CRUD) operations for property listings
- Add, edit, and delete reviews for listings
- Image upload and cloud storage using Cloudinary and Multer
- Server-side validation using Joi
- Centralized error handling using custom middleware
- MongoDB integration with Mongoose
- Mongoose Populate for managing document relationships
- RESTful routing with Method Override
- Dynamic server-side rendering using EJS and EJS-Mate
- Responsive user interface using Bootstrap
- Environment variable management using dotenv

---

## 🛠️ Tech Stack

### Backend
- Node.js
- Express.js

### Database
- MongoDB
- Mongoose

### Frontend
- EJS
- Bootstrap
- HTML
- CSS

### Authentication
- Passport.js
- passport-local-mongoose
- Express Session
- Connect Flash

### File Storage
- Cloudinary
- Multer

### Validation
- Joi

### Tools
- Git
- VS Code
- dotenv

---

## 📂 Project Structure

```text
WanderLust/
│── controllers/
│── models/
│── routes/
│── middleware.js
│── utils/
│── public/
│── views/
│── init/
│── app.js
│── package.json
│── package-lock.json
```

---

## ⚙️ Installation

### Clone the repository

```bash
git clone https://github.com/Rakshit099-g/WanderLust-Vacation-Rental-Web-Application.git
```

### Navigate to the project

```bash
cd WanderLust-Vacation-Rental-Web-Application
```

### Install dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `.env` file and add the required credentials:

```env
CLOUD_NAME=
CLOUD_API_KEY=
CLOUD_API_SECRET=
```

### Start the application

```bash
node app.js
```

---

## 🔮 Future Improvements

- Search and Filter functionality
- Pagination for property listings
- Interactive Maps Integration
- Online Booking System
- Payment Gateway Integration
- Email Notifications
- Deployment on Render

---

## 👨‍💻 Author

**Rakshit Gupta**

GitHub: https://github.com/Rakshit099-g
