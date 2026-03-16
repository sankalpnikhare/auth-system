# 🔐 Authentication System

A secure authentication system built using Node.js, Express, and MongoDB.

## 🚀 Features

- User Registration
- Password Hashing using bcrypt
- Login Authentication
- Google Authntication (Google Auth will work o Hosted device only because of Localhost Redirect URl)
- Protected Routes 
- JWT Authentication
- Environment Variable Configuration
- MVC Structure

## 🛠️ Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- bcrypt
- dotenv
- JsonWebToken
- Passport Authentication
- Google Oauth 2.0 Strategy

## 📦 Installation

1. Clone the repository
2. Install dependencies:

   npm install , express , express-session , passport , passport-gooogle-oauth2 , bcrpyt , mongose , dotenv , jsonwebtoken

3. Create a .env file:

   PORT=5000
   MONGO_URI=your_mongodb_connection
   
   JWT_SECRET=your_secret_key

4. Run the server:

   node server.js 
   - OR
   nodemon server.js 

## 📌 Author

Sankalp Nikhare