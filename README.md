# 🛡️ Data Breach Checker [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) ![GitHub stars](https://img.shields.io/github/stars/yourusername/data-breach-checker?style=social)

A full-stack web application that allows users to check if their credentials have been exposed in data breaches, manage passwords securely, and learn about digital safety.

---

## 🌟 Features

### 👤 User Features
- ✅ Check email/username against known data breaches
- 🔒 Secure password management with hashing
- ✉️ Email-based password reset // ( implementation required in progress) 
- 📝 Educational resources about digital safety

### 👑 Admin Features
- 🛠️ Admin dashboard with user metrics
- 📦 Breach data management
- 👥 User account management

---

## 🛠️ Tech Stack

**Frontend:**  
![HTML5](https://img.shields.io/badge/-HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/-CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/-JavaScript-F7DF1E?logo=javascript&logoColor=black)

**Backend:**  
![Node.js](https://img.shields.io/badge/-Node.js-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/-Express-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/-MongoDB-47A248?logo=mongodb&logoColor=white)

**Security:**  
![Bcrypt](https://img.shields.io/badge/-Bcrypt-402D30?logo=bcrypt&logoColor=white)
![Passport.js](https://img.shields.io/badge/-Passport.js-34E27A?logo=passport.js&logoColor=white)

---

## 📁 Project Structure

data-breach-checker/
<br>
│
<br>
├── app.js # Main server file (Express.js)<br>
├── package.json # Project dependencies and scripts<br>
├── passport-setup.js # Passport.js configuration<br>
├── MOCK_DATA.json # Sample/mock data for breaches<br>
│<br>
├── models/<br>
│ ├── User.js # User schema/model<br>
│ └── Password.js # Password schema/model<br>
│<br>
├── controllers/<br>
│ ├── passwordController.js # Password management logic<br>
│ ├── userController.js # User management logic<br>
│ ├── userCheckPassword.js # Password check logic<br>
│ ├── resetPass.js # Password reset logic<br>
│ └── script.js # Frontend JS for UI/UX<br>
│<br>
├── routes/<br>
│ ├── auth.js # Authentication routes<br>
│ └── admin.js # Admin-specific routes<br>
│<br>
├── views/<br>
│ ├── home.html # Main landing page<br>
│ ├── about.html # About the project<br>
│ ├── contact.html # Contact form<br>
│ ├── FAQ's.html # Frequently Asked Questions<br>
│ ├── admin.html # Admin dashboard<br>
│ ├── style.css # Main stylesheet<br>
│ ├── resetPassword.html # Password reset page<br>
│ └── resetPassword.css # Password reset styles<br>



---

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)
- API keys (see `.env.example`)

### Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/data-breach-checker.git
cd data-breach-checker
cd dataBase_Page_data

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
```

### Running the App

1. **Start MongoDB**  
   Make sure MongoDB is running locally (default port 27017):
   ```bash
   mongod
   ```

2. **Start the server**
   ```bash
   npm start
   ```
   or for development with auto-reload:
   ```bash
   npm run dev
   ```

3. **Open your browser and visit:**  
   [http://localhost:3000/](http://localhost:3000/)

---

## 📊 Functionality Overview

- **User Registration & Login:** Secure authentication and session management.
- **Breach Check:** Instantly check if your credentials have been exposed.
- **Password Reset:** Secure, email-based password reset flow.
- **Admin Dashboard:** Manage users, view breach statistics, and oversee the system.
- **Contact & Support:** Built-in contact form with email validation.
- **Educational Resources:** Learn about digital safety and best practices.

---

## 🧩 API Endpoints

- `POST /auth/register` — Register a new user
- `POST /auth/login` — User login
- `POST /auth/logout` — User logout
- `POST /contact/send` — Send a message via contact form
- `GET /admin` — Admin dashboard (protected)
- ...and more (see `routes/` for details)

---

## 📝 License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).

---

## 🙏 Credits

- [Remix Icon](https://remixicon.com/)
- [Font Awesome](https://fontawesome.com/)
- [AbstractAPI](https://www.abstractapi.com/)

---

> _Feel free to contribute or open issues!_



