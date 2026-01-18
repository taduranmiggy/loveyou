# 🦫💕 Milady Setup Guide

## Quick Setup Instructions

### 1. Frontend (Already Running!) ✅
Your React development server is running on: **http://localhost:5174**

### 2. Backend Setup (XAMPP + PHP)

#### Step 1: Install XAMPP
1. Download XAMPP from https://www.apachefriends.org/
2. Install and start **Apache** and **MySQL** services

#### Step 2: Setup Database
1. Open phpMyAdmin: http://localhost/phpmyadmin
2. Create a new database called `milady_pill_tracker`
3. Import the SQL file: `backend/database.sql`

#### Step 3: Configure Backend
1. Copy the `backend` folder to your XAMPP `htdocs` directory:
   ```
   Copy: c:\milady\backend\
   To: C:\xampp\htdocs\milady\
   ```

2. The API will be available at: http://localhost/milady/api.php/

#### Step 4: Update CORS Settings (if needed)
If you encounter CORS issues, update the API URL in `src/utils/api.js`:
```javascript
const API_BASE_URL = 'http://localhost/milady/backend';
```

### 3. Test the Application

1. **Frontend**: http://localhost:5174 ✅
2. **Backend API**: http://localhost/milady/api.php/pill-types
3. **Database**: http://localhost/phpmyadmin

### 4. Default Pill Types Included
- Diane-35 (21 active + 7 rest)
- Althea (21 active + 7 rest)
- Yasmin (21 active + 7 rest)
- Marvelon (21 active + 7 rest)
- Custom cycle option

### 5. Features Ready to Use! 🌟

✅ **User Registration & Login**
✅ **Pink Girly Design with Glass Morphism**
✅ **Capybara Mascot with Animations**
✅ **Smart Calendar with Pill Tracking**
✅ **Streak Tracking & Statistics**
✅ **Settings & Customization**
✅ **Motivational Quotes & Fun Facts**
✅ **Responsive Mobile Design**

### 6. What to Test

1. **Register** a new account with cute nickname
2. **Choose** your pill type and start date
3. **Track** pills on the calendar (click to mark as taken)
4. **View** your dashboard with stats and streaks
5. **Customize** settings and capybara name
6. **Enjoy** the cute animations and capybara companion!

### 7. Troubleshooting

**CORS Issues?**
- Ensure `.htaccess` file is in the backend directory
- Check that Apache mod_rewrite is enabled

**Database Connection Issues?**
- Verify MySQL is running in XAMPP
- Check database name and credentials in `config.php`

**API Not Working?**
- Test: http://localhost/milady/api.php/pill-types
- Check XAMPP Apache error logs

---

## 🎉 You're All Set!

Your adorable capybara pill tracker is ready! Start by registering an account and meet your new capybara friend! 🦫💕

**Frontend**: http://localhost:5174  
**Backend**: http://localhost/milady/api.php/  

Remember: You're doing amazing, and your capybara believes in you! ✨
