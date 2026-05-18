# Contributing Guidelines - Wytyczne Współtwórcy

Dziękujemy za zainteresowanie wsparciem projektu Task Management System!

## Zasady Ogólne

1. **Szacunek** - Traktuj wszystkich uczestników z szacunkiem
2. **Jakość** - Kod musi być wysokiej jakości i dobrze udokumentowany
3. **Testowanie** - Wszystkie zmiany muszą być przetestowane
4. **Dokumentacja** - Aktualizuj dokumentację razem z kodem

## Proces Współpracy

### 1. Forknij Repozytorium

```bash
# Na GitHub: Kliknij "Fork"
git clone https://github.com/YOUR_USERNAME/management2.git
cd management2
```

### 2. Stwórz Branch Feature

```bash
# Aktualizuj main
git checkout main
git pull origin main

# Stwórz nowy branch
git checkout -b feature/your-feature-name
# lub
git checkout -b bugfix/your-bug-fix
```

### Konwencja Nazewnictwa

- `feature/` - Nowa funkcjonalność
- `bugfix/` - Naprawa błędu
- `docs/` - Dokumentacja
- `test/` - Testy
- `refactor/` - Refaktoryzacja

### 3. Commituj Zmiany

```bash
# Commituj małymi krokami
git commit -m "type: Short description

Optional longer description explaining the changes."
```

#### Format Commit Message

```
<type>(<scope>): <subject>

<body>

<footer>
```

##### Types
- `feat` - Nowa funkcjonalność
- `fix` - Naprawa błędu
- `docs` - Dokumentacja
- `test` - Testy
- `refactor` - Zmiana kodu bez nowej funkcjonalności
- `perf` - Optymizacja wydajności
- `style` - Formatowanie kodu

##### Przykład

```
feat(tasks): add task filtering by priority

- Added priority filter dropdown
- Updated TaskController to support filtering
- Added tests for new filter

Closes #123
```

### 4. Push i Pull Request

```bash
# Push do twojego forku
git push origin feature/your-feature-name
```

Na GitHub:
1. Kliknij "Compare & pull request"
2. Opisz zmiany w PR
3. Czekaj na review

## Wytyczne Kodowania

### PHP

```php
// Use namespace and strict types
namespace App\Models;

declare(strict_types=1);

// Type hints for all methods
public function updateTask(int $id, array $data): Task
{
    return $task->update($data);
}

// Use PSR-12 coding standard
class TaskService
{
    public function handle(): void
    {
        // Implementation
    }
}
```

### JavaScript

```javascript
// Use strict mode
'use strict';

// Use const by default
const API_BASE_URL = '/api';

// Use arrow functions
const getTask = async (id) => {
    return await fetchAPI(`/tasks/${id}`);
};

// Add JSDoc comments
/**
 * Fetch task from API
 * @param {number} id - Task ID
 * @returns {Promise<Object>} Task data
 */
async function fetchTask(id) {
    // Implementation
}
```

### CSS

```css
/* Use BEM naming */
.task-card {
    padding: 1rem;
}

.task-card__title {
    font-weight: bold;
}

.task-card--completed {
    opacity: 0.6;
}

/* Use custom properties */
:root {
    --primary-color: #007bff;
    --spacing-unit: 1rem;
}
```

## Testing Requirements

### Backend Tests

```bash
# Uruchom testy
php artisan test

# Uruchom konkretny test
php artisan test --filter=TaskControllerTest

# Z coverage
php artisan test --coverage
```

### Frontend Tests

```bash
# Jeśli używasz Vitest/Jest
npm test
```

Przykład testu:

```php
namespace Tests\Feature;

use App\Models\Task;
use App\Models\User;
use Tests\TestCase;

class TaskControllerTest extends TestCase
{
    public function test_can_create_task()
    {
        $user = User::factory()->create();
        
        $response = $this->actingAs($user)
            ->post('/api/tasks', [
                'title' => 'Test Task',
                'priority' => 'high',
            ]);
        
        $response->assertStatus(201);
        $this->assertDatabaseHas('tasks', ['title' => 'Test Task']);
    }
}
```

## Dokumentacja

### Kiedy Aktualizować Docs

- ✅ Dodajesz nową funkcjonalność
- ✅ Zmieniasz API
- ✅ Dodajesz nową konfigurację
- ✅ Naprawiasz dokumentację

### Struktura Dokumentacji

```markdown
# Nazwa Funkcji

Krótki opis.

## Wymagania

- PHP 8.1+
- MySQL 5.7+

## Instalacja

```bash
composer require package/name
```

## Użycie

```php
$task = new Task();
```

## Parametry

| Parametr | Typ | Opis |
|----------|-----|------|
| title | string | Tytuł |

## Przykład

## Powiqzane Zasoby
- [Dokumentacja](...)
```

## Code Review Checklist

Zanim zgłosisz PR, sprawdzaj:

- [ ] Kod działa lokalnie
- [ ] Testy przechodzą
- [ ] Dokumentacja zaktualizowana
- [ ] Commits są czyste i opisane
- [ ] Brak plików temp/debug
- [ ] Bez zmian niezwiązanych z taskiem
- [ ] PHP Code Sniffer sprawdzony
- [ ] Bez warningów Linteru

## Standardy Jakości

### PHP Code Sniffer

```bash
# Sprawdzenie
vendor/bin/phpcs app/

# Automatyczne naprawienie
vendor/bin/phpcbf app/
```

### PHP Stan

```bash
vendor/bin/phpstan analyse app/
```

### Laravel Pint

```bash
vendor/bin/pint
```

## Komunikacja

### GitHub Issues

- 🐛 Bugs: Opisz kroki do reprodukcji
- 🎨 Features: Wyjaśnij use case
- 📚 Docs: Zasugeruj poprawę
- ❓ Questions: Zacznij Discussion

### GitHub Discussions

- Pytania ogólne
- Dyskusje o architekturze
- Idee na nowe funkcje
- Dzielenie się doświadczeniami

## Branche

Główne branche:

- `main` - Stable production release
- `develop` - Development branch
- Feature branches - `feature/description`

## Release Process

1. Wszystkie zmiany zmerżowane do `develop`
2. Testing i quality checks
3. Merge do `main`
4. Tag wersji: `v1.0.0`
5. Release Notes

## Licencja

Poprzez współtworzenie projektu, zgadzasz się, że Twój kod
będzie objęty licencją MIT.

## Kod Postępowania

Wszyscy uczestnicy muszą:
- Być szanowni i wciągający
- Unikać dyskryminacji
- Szanować prywatność
- Być konstruktywnym

## Pytania?

- 📧 Email: support@example.com
- 💬 GitHub Discussions
- 🐛 GitHub Issues

---

**Dziękujemy za wspóltworzenie!** 🎉
