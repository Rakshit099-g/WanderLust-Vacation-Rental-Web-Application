# 🏡 WanderLust – Vacation Rental Web Application

🔗 **Live Demo:** [https://wanderlust-vacation-rental-web.onrender.com]

A full-stack vacation rental web application built using **Node.js, Express.js, MongoDB, Mongoose, and EJS**. The application allows users to browse vacation rentals, create and manage property listings, upload images, securely authenticate with OTP-based email verification, leave reviews, search listings by location, view listings on interactive maps, and filter properties by category while following the **MVC Architecture** and **RESTful Routing** principles.

---

## 🚀 Features

- 🔐 User Authentication & Authorization using Passport.js
- 📧 OTP-based Email Verification during Signup using SendGrid
- 👤 Secure session management with Express Session
- 💬 Flash messages for user feedback
- 🏠 Create, Read, Update, and Delete (CRUD) operations for property listings
- 🗺️ Interactive Maps for every listing using MapTiler SDK
- 📍 Automatic Geocoding of location & country into coordinates using MapTiler Geocoding API
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

### Authentication & Verification
- Passport.js
- passport-local-mongoose
- Express Session
- Connect Flash
- OTP Generation using otp-generator
- Email Delivery using SendGrid

### Maps & Location
- MapTiler SDK (frontend map rendering)
- MapTiler Client (backend geocoding — converts location & country into coordinates)

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

MAPTILER_KEY=

SEND_GRID_API_KEY=
SEND_GRID_EMAIL=
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

## 📍 How Maps & Geocoding Work

- When a listing is created or updated, the **location & country** entered by the user are sent to the **MapTiler Geocoding API**, which converts them into `[longitude, latitude]` coordinates.
- These coordinates are stored in the listing's `geometry` field in MongoDB.
- On the listing's show page, the **MapTiler SDK** renders an interactive map centered on these coordinates with a marker showing the property's approximate location.

## 📧 How OTP Email Verification Works

- During signup, a 6-digit OTP is generated using **otp-generator** and stored in MongoDB with the user's email.
- The OTP is emailed to the user via **SendGrid** with both plain text and styled HTML templates.
- The user must enter the correct OTP to complete registration; OTPs expire after **5 minutes**.

---

## 🔮 Future Improvements

- Pagination
- Wishlist / Favorites
- Online Booking System
- Payment Gateway Integration
- Admin Dashboard
- AI-based Property Recommendations

---

## 👨‍💻 Author

### Rakshit Gupta

GitHub:  
https://github.com/Rakshit099-g

---