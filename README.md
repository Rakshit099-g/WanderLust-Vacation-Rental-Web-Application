# 🏡 WanderLust – Vacation Rental Web Application

A full-stack vacation rental web application built using **Node.js, Express.js, MongoDB, Mongoose, Express, and EJS**. The application allows users to browse vacation rentals, create and manage property listings, upload images, securely authenticate, leave reviews, search listings by location, and filter properties by category while following the **MVC Architecture** and **RESTful Routing** principles.

---

## 🚀 Features

- 🔐 User Authentication & Authorization using Passport.js
- 👤 Secure session management with Express Session
- 💬 Flash messages for user feedback
- 🏠 Create, Read, Update, and Delete (CRUD) operations for property listings
- ⭐ Add, edit, and delete reviews
- 🔍 Search listings by location
- 🏷️ Filter listings by category
- 💰 Toggle listing prices with taxes
- ☁️ Image upload and cloud storage using Cloudinary & Multer
- ✅ Server-side validation using Joi
- ⚠️ Centralized error handling using custom middleware
- 🗂️ MongoDB integration with Mongoose
- 🔗 Mongoose Populate for document relationships
- 🔄 RESTful Routing with Method Override
- 🎨 Dynamic server-side rendering using EJS & EJS-Mate
- 📱 Responsive UI using Bootstrap
- 🔒 Environment variable management using dotenv

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
- JavaScript

### Authentication
- Passport.js
- passport-local-mongoose
- Express Session
- Connect Flash

### File Upload & Storage
- Multer
- Cloudinary

### Validation
- Joi

### Architecture
- MVC (Model-View-Controller)
- RESTful Routing

### Tools
- Git
- GitHub
- VS Code
- dotenv

---

## 📂 Project Structure

```text
WanderLust/
│
├── controllers/
├── models/
├── routes/
├── views/
├── public/
│   ├── css/
│   ├── js/
│   └── images/
├── utils/
├── init/
├── middleware.js
├── cloudConfig.js
├── schema.js
├── app.js
├── package.json
└── README.md
```

---

## ⚙️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Rakshit099-g/WanderLust-Vacation-Rental-Web-Application.git
```

### 2. Navigate to the Project

```bash
cd WanderLust-Vacation-Rental-Web-Application
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` file in the root directory.

```env
ATLASDB_URL=

SECRET=

CLOUD_NAME=

CLOUD_API_KEY=

CLOUD_API_SECRET=
```

---

### 5. Start the Server

```bash
node app.js
```

or

```bash
npm start
```

---



## 🔮 Future Improvements

- Pagination
- Interactive Maps (Mapbox)
- Wishlist / Favorites
- Online Booking System
- Payment Gateway Integration
- Email Notifications
- Admin Dashboard
- AI-based Property Recommendations

---

## 👨‍💻 Author

### Rakshit Gupta

GitHub:  
https://github.com/Rakshit099-g

---
