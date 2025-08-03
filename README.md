# 🏠 REAL ESTATE PRO - Backend API

> Backend service for the REAL ESTATE PRO platform — a real estate management system built with Node.js, Express, and MongoDB.

## 🚀 Features

- RESTful API for real estate listings, user management, and posts
- Authentication with JWT
- Role-based access control (Admin/User)
- Modular service/controller structure
- Data validation with Joi
- Pagination, filtering, and sorting support
- Rate limiting, CORS, and security middlewares
- Centralized error handling
- MongoDB Atlas (or local MongoDB) integration

---

## 📁 Folder Structure

BE_REAL_ESTATE_PRO/
│
├── config/ # DB connection, environment configs
├── controllers/ # API route handlers
├── middlewares/ # Auth, validation, error handlers
├── models/ # Mongoose schemas
├── routes/ # Express route declarations
├── services/ # Business logic
├── utils/ # Helper functions
├── .env # Environment variables
├── app.js # Entry point
└── README.md # Project documentation

---

## 🔧 Installation

1. **Clone the repository**
```bash
git clone https://github.com/tiendunglaptrinh/BE_REAL_ESTATE_PRO.git
cd BE_REAL_ESTATE_PRO
Install dependencies

bash
Copy
Edit
npm install
Create .env file

env
Copy
Edit
PORT=5000
MONGO_URI=mongodb+srv://your_mongo_uri
JWT_SECRET=your_jwt_secret
SEND_EMAIL=your_email@example.com
SEND_EMAIL_PASS=your_email_password
Run the app

bash
Copy
Edit
# Development mode
npm run dev

# Production mode
npm start
🛠️ API Endpoints
Base URL: http://localhost:5000/api/v1

🔑 Auth
POST /auth/register – User registration

POST /auth/login – User login

GET /auth/me – Get current user info

👤 Users
GET /users/ – Get all users (admin only)

GET /users/:id – Get single user

PUT /users/:id – Update user

🏢 Projects / Posts
GET /posts – List all posts/projects

POST /posts – Create new post

PUT /posts/:id – Update post

DELETE /posts/:id – Delete post

Full API docs available soon via Swagger/OpenAPI.

✅ Technologies
Node.js

Express.js

MongoDB + Mongoose

JWT Authentication

Joi Validation

Nodemailer

Dotenv

Helmet, Morgan, CORS, Rate-Limiter

📮 Contact
📧 Email: dungtadev@gmail.com
🔗 GitHub: tiendunglaptrinh

📌 License
# This project is licensed under the MIT License.