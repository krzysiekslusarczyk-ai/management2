# System Zarządzania Zadaniami z Integracją iCloud

Zaawansowana aplikacja webowa do zgłaszania i zarządzania zadaniami z wbudowaną integracją z kalendarzem iCloud.

## 📋 Funkcjonalności

- **Zgłaszanie Zadań**: Klienci mogą łatwo zgłaszać nowe zadania do wykonania
- **Zarządzanie Zadaniami**: Pełny system CRUD (Create, Read, Update, Delete)
- **Kalendarz Interaktywny**: Wyświetlanie zadań na kalendarzu z kolorami priorytetów
- **Integracja iCloud**: Synchronizacja zadań z kalendarzem iCloud poprzez CalDAV
- **Panel Administracyjny**: Zarządzanie użytkownikami i zadaniami
- **Autentykacja JWT**: Bezpieczne logowanie i uwierzytelnianie
- **Filtry i Wyszukiwanie**: Zaawansowane filtry zadań po statusie, priorytecie i terminie
- **Powiadomienia**: System notyfikacji dla zmian statusu zadań

## 🏗️ Architektura

```
/
├── app/
│   ├── Http/
│   │   ├── Controllers/     # Kontrolery API
│   │   └── Middleware/      # Middleware autentykacji
│   ├── Models/              # Modele danych
│   ├── Services/            # Serwisy biznesowe
│   └── Providers/           # Service providers
├── routes/
│   ├── api.php              # API routes
│   └── web.php              # Web routes
├── database/
│   ├── migrations/          # Migracje bazy danych
│   └── seeders/             # Seed'y do testowania
├── resources/
│   ├── views/               # Szablony HTML
│   └── js/                  # Pliki JavaScript
├── public/
│   ├── css/                 # Stylizacja CSS
│   ├── js/                  # Frontend JavaScript
│   └── uploads/             # Pliki przesłane przez użytkowników
└── config/
    └── app.php              # Konfiguracja aplikacji
```

## 🔧 Wymagania

- **PHP**: >= 8.1
- **MySQL**: >= 5.7
- **Node.js**: >= 14 (opcjonalnie, dla narzędzi build)
- **Composer**: >= 2.0

## 📦 Instalacja

### 1. Klonowanie Repozytorium

```bash
git clone https://github.com/yourusername/management2.git
cd management2
```

### 2. Instalacja Zależności

```bash
composer install
```

### 3. Konfiguracja Środowiska

```bash
cp .env.example .env
php artisan key:generate
```

Edytuj plik `.env` i ustawić:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=task_management
DB_USERNAME=root
DB_PASSWORD=
```

### 4. Migracja Bazy Danych

```bash
php artisan migrate
```

### 5. Uruchomienie Aplikacji

```bash
php artisan serve
```

Aplikacja będzie dostępna na: `http://localhost:8000`

## 🔑 Konfiguracja iCloud

### Połączenie Konta iCloud

1. Przejdź do `https://appleid.apple.com/account/manage`
2. W sekcji "Bezpieczeństwo" kliknij "Hasła aplikacji"
3. Wygeneruj nowe hasło aplikacji dla "Innych aplikacji"
4. W ustawieniach aplikacji wprowadź:
   - Email iCloud
   - Wygenerowane hasło aplikacji

### Sync CalDAV

Aplikacja automatycznie:
- Synchronizuje nowe zadania z kalendarzem iCloud
- Aktualizuje status zadań
- Pobiera zdarzenia z kalendarza iCloud

## 👥 Użytkownicy

### Rejestracja Nowego Użytkownika

1. Kliknij "Rejestracja" na stronie głównej
2. Wypełnij formularz rejestracji
3. Potwierdzenie zobaczy się po kliknięciu "Zarejestruj się"

### Logowanie

1. Kliknij "Logowanie" na stronie głównej
2. Wprowadź email i hasło
3. Kliknij "Zaloguj się"

## 📊 Modele Danych

### Task (Zadanie)

```php
- id: integer (primary key)
- title: string
- description: text (nullable)
- client_id: integer (foreign key -> users)
- assigned_to: integer (foreign key -> users, nullable)
- status: enum (pending, in_progress, completed, cancelled)
- priority: enum (low, medium, high, urgent)
- due_date: datetime (nullable)
- icalendar_uid: string (nullable, unique)
- created_at: timestamp
- updated_at: timestamp
```

### User (Użytkownik)

```php
- id: integer (primary key)
- name: string
- email: string (unique)
- password: string
- phone: string (nullable)
- company: string (nullable)
- role: enum (client, admin, operator)
- created_at: timestamp
- updated_at: timestamp
```

### iCloudAccount (Konto iCloud)

```php
- id: integer (primary key)
- user_id: integer (foreign key -> users)
- icloud_email: string
- app_password: encrypted text
- calendar_url: string (nullable)
- calendar_id: string (nullable)
- sync_enabled: boolean
- last_sync_at: timestamp (nullable)
- sync_status: enum (idle, syncing, success, error)
- created_at: timestamp
- updated_at: timestamp
```

## 🔌 API Endpoints

### Autentykacja

- `POST /api/auth/register` - Rejestracja
- `POST /api/auth/login` - Logowanie
- `POST /api/auth/logout` - Wylogowanie
- `GET /api/auth/me` - Dane bieżącego użytkownika

### Zadania

- `GET /api/tasks` - Lista zadań
- `POST /api/tasks` - Utworzenie nowego zadania
- `GET /api/tasks/{id}` - Szczegóły zadania
- `PATCH /api/tasks/{id}` - Aktualizacja zadania
- `DELETE /api/tasks/{id}` - Usunięcie zadania

### iCloud Sync

- `POST /api/icloud/connect` - Połączenie konta iCloud
- `GET /api/icloud/accounts` - Lista połączonych kont
- `POST /api/icloud/accounts/{id}/sync` - Synchronizacja zadań
- `PATCH /api/icloud/accounts/{id}/toggle-sync` - Włączanie/wyłączanie sync
- `DELETE /api/icloud/accounts/{id}` - Rozłączanie konta

## 🧪 Testowanie

```bash
php artisan test
```

## 📝 Struktura Frontendu

### Strony

1. **index.html** - Strona główna z logowaniem/rejestracją
2. **dashboard.html** - Panel główny ze statystykami
3. **tasks.html** - Lista i zarządzanie zadaniami
4. **calendar.html** - Widok kalendarza zadań
5. **settings.html** - Ustawienia użytkownika i iCloud

### Biblioteki JavaScript

- **FullCalendar 6.1.8** - Interaktywny kalendarz
- **Bootstrap 5.3.0** - Framework CSS
- **Fetch API** - Komunikacja z API

## 🔒 Bezpieczeństwo

- Hasła przechowywane z użyciem `bcrypt`
- Hasła aplikacji iCloud szyfrowane
- Autentykacja JWT dla API
- Middleware CSRF protection
- SQL Injection Prevention (Eloquent ORM)
- XSS Protection (Blade templating)

## 🐛 Troubleshooting

### Problem: "SQLSTATE[HY000]: General error"
**Rozwiązanie**: Sprawdzić połączenie z bazą danych w `.env`

### Problem: "Unauthorized" przy API
**Rozwiązanie**: Sprawdzić czy token JWT jest poprawnie ustawiony w nagłówku Authorization

### Problem: iCloud sync nie działa
**Rozwiązanie**: 
1. Sprawdzić czy hasło aplikacji iCloud jest prawidłowe
2. Sprawdzić czy email iCloud jest poprawny
3. Sprawdzić logi w `storage/logs/laravel.log`

## 📚 Dokumentacja

- [Laravel Documentation](https://laravel.com/docs)
- [FullCalendar Documentation](https://fullcalendar.io/docs)
- [CalDAV Protocol](https://tools.ietf.org/html/rfc4918)

## 📄 Licencja

MIT License - Patrz plik LICENSE

## 👨‍💻 Autor

Stworzono dla projektu zarządzania zadaniami.

## 🤝 Wsparcie

W przypadku pytań lub problemów, proszę otworzyć Issue w repozytorium.

---

**Ostatnia aktualizacja**: 2024-05-17
