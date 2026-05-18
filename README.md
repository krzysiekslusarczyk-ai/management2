# Task Management System with iCloud Integration

[![PHP Version](https://img.shields.io/badge/PHP-8.1%2B-blue.svg)](https://www.php.net/)
[![Laravel](https://img.shields.io/badge/Laravel-10.x-red.svg)](https://laravel.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Complete web application for task submission and management with iCloud calendar integration.

## 📚 Documentation

- **🇵🇱 [Polish Documentation (README_PL.md)](README_PL.md)** - Pełna dokumentacja w języku polskim
- **🚀 [Quick Start (QUICKSTART.md)](QUICKSTART.md)** - Szybki start w 5 minut
- **📖 [API Documentation (API_DOCUMENTATION.md)](API_DOCUMENTATION.md)** - Dokumentacja API REST

## ✨ Key Features

- ✅ **Task Submission** - Easy task submission for clients
- ✅ **Task Management** - Complete CRUD operations
- ✅ **Interactive Calendar** - FullCalendar with task visualization
- ✅ **iCloud Integration** - CalDAV sync with Apple iCloud
- ✅ **User Authentication** - JWT-based secure authentication
- ✅ **Advanced Filtering** - Search and filter tasks
- ✅ **Responsive UI** - Bootstrap 5 responsive design
- ✅ **Real-time Status** - Task status tracking

## 🏗️ Architecture

```
Backend:  Laravel 10 (PHP 8.1+)
Database: MySQL 5.7+
Frontend: HTML5, CSS3, JavaScript (ES6+)
API:      RESTful with JWT
Calendar: FullCalendar 6.1.8
```

## 🚀 Quick Start

```bash
# 1. Clone repository
git clone https://github.com/yourusername/management2.git
cd management2

# 2. Install dependencies
composer install

# 3. Setup environment
cp .env.example .env
php artisan key:generate

# 4. Setup database
mysql -u root -p -e "CREATE DATABASE task_management;"
php artisan migrate

# 5. Run server
php artisan serve
```

Access: http://localhost:8000

## 📋 Project Structure

```
/
├── app/
│   ├── Http/Controllers/    # API Controllers
│   ├── Models/              # Database Models
│   ├── Services/            # Business Logic
│   └── Helpers/             # Helper Functions
├── routes/
│   ├── api.php              # API Routes
│   └── web.php              # Web Routes
├── database/
│   ├── migrations/          # Database Migrations
│   └── seeders/             # Database Seeders
├── resources/views/         # HTML Templates
├── public/
│   ├── css/                 # Stylesheets
│   └── js/                  # Frontend Scripts
└── config/                  # Configuration Files
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Tasks
- `GET /api/tasks` - List tasks
- `POST /api/tasks` - Create task
- `GET /api/tasks/{id}` - Get task details
- `PATCH /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task

### iCloud Integration
- `POST /api/icloud/connect` - Connect iCloud account
- `GET /api/icloud/accounts` - List connected accounts
- `POST /api/icloud/accounts/{id}/sync` - Sync tasks
- `DELETE /api/icloud/accounts/{id}` - Disconnect account

## 📚 Dependencies

### Backend
- `laravel/framework` - Web framework
- `laravel/sanctum` - API authentication
- `sabre/dav` - CalDAV protocol support
- `guzzlehttp/guzzle` - HTTP client

### Frontend
- `Bootstrap 5.3.0` - CSS Framework
- `FullCalendar 6.1.8` - Calendar component

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- CSRF protection
- SQL Injection prevention (Eloquent ORM)
- XSS protection
- Encrypted iCloud credentials

## 🧪 Testing

```bash
php artisan test
```

## 📝 Database Schema

### Users Table
- id, name, email, password, phone, company, role, timestamps

### Tasks Table
- id, title, description, client_id, assigned_to, status, priority, due_date, icalendar_uid, timestamps

### iCloudAccounts Table
- id, user_id, icloud_email, app_password, calendar_url, calendar_id, sync_enabled, last_sync_at, sync_status, timestamps

## 🌐 Browser Support

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

- 📖 Check [Documentation](README_PL.md)
- 🐛 Report issues on GitHub
- 💬 Start a discussion

## 🎓 Resources

- [Laravel Documentation](https://laravel.com/docs)
- [FullCalendar Documentation](https://fullcalendar.io/docs)
- [Bootstrap Documentation](https://getbootstrap.com/docs)
- [CalDAV Protocol](https://tools.ietf.org/html/rfc4918)

---

**Version**: 1.0.0  
**Last Updated**: 2024-05-17  
**Status**: ✅ Ready for Production