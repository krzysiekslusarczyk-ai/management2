# 🚀 QUICKSTART - Szybki Start

Przewodnik szybkiego uruchomienia aplikacji Task Management System.

## Wymagania Wstępne

```bash
# Sprawdzenie PHP
php -v  # >= 8.1

# Sprawdzenie Composera
composer -V

# Sprawdzenie MySQL
mysql --version
```

## Instalacja w 5 minut

### 1. Klonowanie i Instalacja Zależności

```bash
git clone https://github.com/yourusername/management2.git
cd management2
composer install
```

### 2. Konfiguracja Środowiska

```bash
# Skopiuj plik konfiguracyjny
cp .env.example .env

# Edytuj .env - ustaw bazę danych
nano .env
```

Zmień te wartości w `.env`:
```env
DB_HOST=127.0.0.1
DB_DATABASE=task_management
DB_USERNAME=root
DB_PASSWORD=
```

### 3. Migracja Bazy Danych

```bash
# Utwórz bazę danych
mysql -u root -p -e "CREATE DATABASE task_management CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Uruchom migracje
php artisan migrate
```

### 4. Uruchomienie Serwera

```bash
php artisan serve
```

Otwórz przeglądarkę: `http://localhost:8000`

## 🎯 Pierwsze Kroki

### Rejestracja Użytkownika

1. Kliknij "Rejestracja" na stronie głównej
2. Wypełnij formularz:
   - Imię i Nazwisko
   - Email
   - Hasło (min 8 znaków)
   - Potwierdzenie hasła
3. Kliknij "Zarejestruj się"

### Logowanie

1. Kliknij "Logowanie"
2. Wprowadź email i hasło
3. Kliknij "Zaloguj się"

### Dodanie Pierwszego Zadania

1. W panelu głównym kliknij "+ Nowe zadanie"
2. Wpisz:
   - **Tytuł**: np. "Przygotować raport"
   - **Opis**: np. "Raport z projektu X"
   - **Priorytet**: Średni
   - **Termin**: Jutro o 17:00
3. Kliknij "Dodaj zadanie"

### Widok Kalendarza

1. Przejdź do "Kalendarz"
2. Widzisz wszystkie zadania na kalendarzu
3. Kliknij na zadanie, aby zobaczyć szczegóły
4. Zadania zaległe oznaczone są kolorem ⚠️

## ☁️ Integracja z iCloud

### Konfiguracja

1. Przejdź do "Ustawienia" → "iCloud"
2. Kliknij "Połącz konto"
3. Wprowadź:
   - Email iCloud
   - Hasło aplikacji (wygeneruj na appleid.apple.com)

### Gdzie Wygenerować Hasło Aplikacji?

1. Przejdź: https://appleid.apple.com/account/manage
2. Sekcja "Bezpieczeństwo" → "Hasła aplikacji"
3. Wybierz "Inne aplikacje"
4. Wygeneruj nowe hasło
5. Skopiuj 16-znakowe hasło
6. Wróć do aplikacji i wklej hasło

### Synchronizacja

Po połączeniu konta:
- ✅ Zadania automatycznie synchronizują się z iCloud
- ✅ Możesz wyłączyć/włączyć synchronizację
- ✅ Kliknij "Synchronizuj teraz" do ręcznej synchronizacji

## 📝 Menu Aplikacji

### Panel Główny (Dashboard)
- Statystyki zadań (Nowe, W trakcie, Ukończone, Zaległe)
- Ostatnie zadania
- Szybkie akcje

### Moje Zadania
- Lista wszystkich zadań
- Filtry (Status, Priorytet)
- Wyszukiwanie
- Edycja/Usuwanie
- Paginacja

### Kalendarz
- Widok miesięczny/tygodniowy/dzienny
- Kolor po priorytecie
- Szczegóły zadania
- Licznik dni pozostałych

### Ustawienia
- **Profil**: Edycja danych
- **iCloud**: Zarządzanie kontami
- **Bezpieczeństwo**: Zmiana hasła

## 🎨 Znaczenie Kolorów

### Priorytety
- 🔴 **Nadzwyczajny** - Czerwony
- 🟡 **Wysoki** - Żółty
- 🔵 **Średni** - Niebieski
- ⚫ **Niski** - Szary

### Status
- 🟡 **Nowe** - Żółty
- 🔵 **W trakcie** - Niebieski
- 🟢 **Ukończone** - Zielony
- ⚫ **Anulowane** - Szary

## 🐛 Rozwiązywanie Problemów

### Problem: "Connection refused"
```bash
# Sprawdź czy MySQL jest uruchomiony
sudo service mysql status

# Jeśli nie, uruchom
sudo service mysql start
```

### Problem: "Migrations not found"
```bash
# Sprawdź czy migracje się wgrały
php artisan migrate:status

# Jeśli nie, spróbuj ponownie
php artisan migrate:fresh
```

### Problem: "Port 8000 już w użyciu"
```bash
# Użyj innego portu
php artisan serve --port=8001
```

## 📚 Przydatne Komendy

```bash
# Sprawdzenie statusu migracji
php artisan migrate:status

# Reset bazy danych (UWAGA: usuwa wszystkie dane!)
php artisan migrate:fresh

# Czyszczenie cache
php artisan cache:clear

# Wczytanie seedów
php artisan db:seed

# Uruchomienie testów
php artisan test
```

## 🔧 Konfiguracja Zaawansowana

### Zmiana Portu Serwera

W `.env`:
```env
APP_PORT=8001
```

Lub przy uruchomieniu:
```bash
php artisan serve --port=8001
```

### Zmiana Strefa Czasowa

W `config/app.php`:
```php
'timezone' => 'Europe/Warsaw',
```

### Zmiana Limitu Danych

W `composer.json` i `.env`:
- Max upload size
- Session timeout
- API rate limit

## 📞 Wsparcie

- 📖 Dokumentacja: `README_PL.md`
- 🐛 Raporty błędów: GitHub Issues
- 💬 Dyskusje: GitHub Discussions

## 🎓 Następne Kroki

1. ✅ Zaloguj się i dodaj kilka zadań
2. ✅ Sprawdź widok kalendarza
3. ✅ Połącz konto iCloud
4. ✅ Zsynchronizuj zadania
5. ✅ Zmień statusy zadań

Powodzenia! 🚀
