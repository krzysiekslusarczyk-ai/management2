# API Documentation

Dokumentacja kompletnego REST API aplikacji Task Management System.

## Base URL

```
http://localhost:8000/api
```

## Autentykacja

Wszystkie żądania (poza rejestracją i logowaniem) wymagają nagłówka:

```
Authorization: Bearer {TOKEN}
```

Token otrzymujesz po zalogowaniu.

## Response Format

Sukces (200):
```json
{
    "data": { /* ... */ },
    "message": "Operation successful"
}
```

Błąd (400-500):
```json
{
    "error": "Error message",
    "message": "Detailed error description"
}
```

---

## 🔐 Endpoints Autentykacji

### POST /auth/register

Rejestracja nowego użytkownika.

**Request:**
```json
{
    "name": "Jan Kowalski",
    "email": "jan@example.com",
    "password": "securePassword123",
    "password_confirmation": "securePassword123",
    "phone": "+48123456789",
    "company": "ABC Sp. z o.o."
}
```

**Response (201):**
```json
{
    "message": "User registered successfully",
    "user": {
        "id": 1,
        "name": "Jan Kowalski",
        "email": "jan@example.com",
        "phone": "+48123456789",
        "company": "ABC Sp. z o.o.",
        "role": "client"
    }
}
```

### POST /auth/login

Logowanie użytkownika.

**Request:**
```json
{
    "email": "jan@example.com",
    "password": "securePassword123"
}
```

**Response (200):**
```json
{
    "message": "Login successful",
    "user": {
        "id": 1,
        "name": "Jan Kowalski",
        "email": "jan@example.com",
        "role": "client"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### POST /auth/logout

Wylogowanie użytkownika.

**Headers:** `Authorization: Bearer {TOKEN}`

**Response (200):**
```json
{
    "message": "Logged out successfully"
}
```

### GET /auth/me

Pobierz dane bieżącego użytkownika.

**Headers:** `Authorization: Bearer {TOKEN}`

**Response (200):**
```json
{
    "id": 1,
    "name": "Jan Kowalski",
    "email": "jan@example.com",
    "phone": "+48123456789",
    "company": "ABC Sp. z o.o.",
    "role": "client",
    "created_at": "2024-05-17T12:00:00.000000Z",
    "updated_at": "2024-05-17T12:00:00.000000Z"
}
```

---

## 📋 Endpoints Zadań

### GET /tasks

Pobierz listę zadań.

**Query Parameters:**
- `page` (int, default: 1) - Numer strony
- `limit` (int, default: 15) - Ilość zadań na stronę
- `status` (string) - Filtr: pending, in_progress, completed, cancelled
- `priority` (string) - Filtr: low, medium, high, urgent
- `search` (string) - Wyszukiwanie po tytule

**Headers:** `Authorization: Bearer {TOKEN}`

**Response (200):**
```json
{
    "data": [
        {
            "id": 1,
            "title": "Przygotować raport",
            "description": "Raport z projektu X",
            "client_id": 1,
            "assigned_to": 2,
            "status": "in_progress",
            "priority": "high",
            "due_date": "2024-05-20T17:00:00.000000Z",
            "icalendar_uid": "uuid-1234",
            "created_at": "2024-05-17T12:00:00.000000Z",
            "updated_at": "2024-05-17T12:00:00.000000Z"
        }
    ],
    "current_page": 1,
    "last_page": 5,
    "per_page": 15,
    "total": 75
}
```

### POST /tasks

Utwórz nowe zadanie.

**Headers:** `Authorization: Bearer {TOKEN}`

**Request:**
```json
{
    "title": "Nowe zadanie",
    "description": "Opis zadania",
    "priority": "high",
    "due_date": "2024-05-20T17:00:00"
}
```

**Response (201):**
```json
{
    "id": 2,
    "title": "Nowe zadanie",
    "description": "Opis zadania",
    "client_id": 1,
    "assigned_to": null,
    "status": "pending",
    "priority": "high",
    "due_date": "2024-05-20T17:00:00.000000Z",
    "created_at": "2024-05-17T12:30:00.000000Z",
    "updated_at": "2024-05-17T12:30:00.000000Z"
}
```

### GET /tasks/{id}

Pobierz szczegóły zadania.

**Headers:** `Authorization: Bearer {TOKEN}`

**Response (200):**
```json
{
    "id": 1,
    "title": "Przygotować raport",
    "description": "Raport z projektu X",
    "client": {
        "id": 1,
        "name": "Jan Kowalski",
        "email": "jan@example.com"
    },
    "assignee": {
        "id": 2,
        "name": "Adam Nowak",
        "email": "adam@example.com"
    },
    "comments": [
        {
            "id": 1,
            "user_id": 1,
            "comment": "Sprawdzam postęp",
            "created_at": "2024-05-17T13:00:00.000000Z"
        }
    ],
    "attachments": [
        {
            "id": 1,
            "file_name": "raport.pdf",
            "file_path": "/uploads/tasks/1/raport.pdf",
            "file_size": 204800,
            "mime_type": "application/pdf"
        }
    ],
    "status": "in_progress",
    "priority": "high",
    "due_date": "2024-05-20T17:00:00.000000Z"
}
```

### PATCH /tasks/{id}

Zaktualizuj zadanie.

**Headers:** `Authorization: Bearer {TOKEN}`

**Request:**
```json
{
    "title": "Zaktualizowany tytuł",
    "status": "completed",
    "priority": "medium",
    "assigned_to": 2
}
```

**Response (200):**
```json
{
    "id": 1,
    "title": "Zaktualizowany tytuł",
    "status": "completed",
    "priority": "medium",
    "assigned_to": 2,
    "updated_at": "2024-05-17T14:00:00.000000Z"
}
```

### DELETE /tasks/{id}

Usuń zadanie.

**Headers:** `Authorization: Bearer {TOKEN}`

**Response (204):** Brak zawartości

---

## ☁️ Endpoints iCloud

### POST /icloud/connect

Połącz konto iCloud.

**Headers:** `Authorization: Bearer {TOKEN}`

**Request:**
```json
{
    "icloud_email": "user@icloud.com",
    "app_password": "xxxx-xxxx-xxxx-xxxx"
}
```

**Response (201):**
```json
{
    "message": "iCloud account connected successfully",
    "account": {
        "id": 1,
        "user_id": 1,
        "icloud_email": "user@icloud.com",
        "calendar_id": "calendar-primary",
        "sync_enabled": true,
        "last_sync_at": null,
        "sync_status": "idle"
    }
}
```

### GET /icloud/accounts

Pobierz połączone konta iCloud.

**Headers:** `Authorization: Bearer {TOKEN}`

**Response (200):**
```json
[
    {
        "id": 1,
        "icloud_email": "user@icloud.com",
        "calendar_id": "calendar-primary",
        "sync_enabled": true,
        "last_sync_at": "2024-05-17T13:00:00.000000Z",
        "sync_status": "success"
    }
]
```

### POST /icloud/accounts/{id}/sync

Synchronizuj zadania z iCloud.

**Headers:** `Authorization: Bearer {TOKEN}`

**Response (200):**
```json
{
    "message": "Tasks synced successfully",
    "last_sync_at": "2024-05-17T14:30:00.000000Z"
}
```

### PATCH /icloud/accounts/{id}/toggle-sync

Włącz/wyłącz automatyczną synchronizację.

**Headers:** `Authorization: Bearer {TOKEN}`

**Response (200):**
```json
{
    "message": "Sync enabled",
    "sync_enabled": true
}
```

### DELETE /icloud/accounts/{id}

Rozłącz konto iCloud.

**Headers:** `Authorization: Bearer {TOKEN}`

**Response (200):**
```json
{
    "message": "iCloud account disconnected"
}
```

---

## 🔍 Kody Błędów

| Kod | Znaczenie |
|-----|-----------|
| 200 | OK - Sukces |
| 201 | Created - Zasób utworzony |
| 204 | No Content - Sukces, brak zawartości |
| 400 | Bad Request - Błąd żądania |
| 401 | Unauthorized - Brak autentykacji |
| 403 | Forbidden - Brak uprawnień |
| 404 | Not Found - Zasób nie znaleziony |
| 422 | Unprocessable Entity - Błędy walidacji |
| 500 | Internal Server Error - Błąd serwera |

---

## 📊 Statusy Zadań

| Status | Opis |
|--------|------|
| `pending` | Nowe zadanie |
| `in_progress` | Zadanie w trakcie |
| `completed` | Zadanie ukończone |
| `cancelled` | Zadanie anulowane |

## 🎯 Priorytety

| Priorytet | Opis |
|-----------|------|
| `low` | Niski priorytet |
| `medium` | Średni priorytet |
| `high` | Wysoki priorytet |
| `urgent` | Nadzwyczajny priorytet |

---

## 🧪 Testowanie z cURL

```bash
# Rejestracja
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "password_confirmation": "password123"
  }'

# Logowanie
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Utwórz zadanie
curl -X POST http://localhost:8000/api/tasks \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Task",
    "priority": "high",
    "due_date": "2024-05-20T17:00:00"
  }'

# Pobierz zadania
curl -X GET http://localhost:8000/api/tasks \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

**Ostatnia aktualizacja**: 2024-05-17
