
## ✨ Features

### 🌸 Beautiful UI
- **Pink girly color palette** with glass morphism effects
- **Cute capybara mascot** that cheers you on
- **Smooth animations** using Framer Motion
- **Responsive design** that works on all devices
- **Dark/light mode** toggle

### 💊 Pill Tracking
- **Multiple pill types** support (Diane, Althea, Yasmin, Marvelon, etc.)
- **Smart calendar** that automatically calculates active/rest days
- **Visual indicators** with hearts, stars, and cute emojis
- **Streak tracking** to motivate consistency
- **One-click marking** for daily pill intake

### 🦫 Capybara Companion
- **Personalized capybara friend** with cute names
- **Motivational quotes** and encouragement
- **Easter eggs** when completing cycles
- **Fun facts** about capybaras
- **Interactive mascot** that responds to clicks

### 🔐 User Management
- **Simple registration** with nickname and email
- **Secure authentication** with session management
- **Customizable settings** for pill types and schedules
- **Data persistence** with MySQL database

## 🚀 Getting Started

### Prerequisites
- **XAMPP** (Apache + MySQL + PHP)
- **Node.js** (v14 or higher)
- **npm** or **yarn**

### Backend Setup (XAMPP)

1. **Start XAMPP** services (Apache + MySQL)

2. **Create the database**:
   ```bash
   # Open phpMyAdmin (http://localhost/phpmyadmin)
   # Import the database.sql file or run the SQL commands manually
   ```

3. **Configure the backend**:
   ```bash
   # Copy the backend folder to your XAMPP htdocs directory
   cp -r backend/ /path/to/xampp/htdocs/milady/
   ```

4. **Update database config** in `backend/config.php` if needed:
   ```php
   define('DB_HOST', 'localhost');
   define('DB_USER', 'root');
   define('DB_PASS', '');
   define('DB_NAME', 'milady_pill_tracker');
   ```

### Frontend Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser** and navigate to `http://localhost:5173`

## 🛠️ Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

---

Made with 💕 for all the amazing women taking control of their health

*Remember: You're doing amazing, and your capybara friend believes in you! 🦫✨*+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
