<?php

namespace App\Services;

use App\Models\iCloudAccount;
use App\Models\Task;
use App\Models\User;
use Illuminate\Support\Str;

class iCloudSyncService
{
    private $caldavClient;

    public function validateAndCreateAccount(User $user, string $email, string $appPassword): iCloudAccount
    {
        // Validate iCloud credentials
        $calendars = $this->getCalendarsFromiCloud($email, $appPassword);

        if (empty($calendars)) {
            throw new \Exception('No calendars found or invalid credentials');
        }

        // Find or create account
        $account = iCloudAccount::updateOrCreate(
            [
                'user_id' => $user->id,
                'icloud_email' => $email,
            ],
            [
                'app_password' => $appPassword,
                'calendar_url' => $calendars[0]['url'] ?? null,
                'calendar_id' => $calendars[0]['id'] ?? null,
                'sync_enabled' => true,
            ]
        );

        return $account;
    }

    public function syncTasksToiCloud(iCloudAccount $account): void
    {
        try {
            $account->update(['sync_status' => 'syncing']);

            // Get all pending tasks for this user
            $tasks = Task::where('client_id', $account->user_id)
                ->where('status', '!=', Task::STATUS_CANCELLED)
                ->get();

            foreach ($tasks as $task) {
                $this->pushTaskToiCloud($account, $task);
            }

            $account->update([
                'sync_status' => 'success',
                'last_sync_at' => now(),
            ]);
        } catch (\Exception $e) {
            $account->update(['sync_status' => 'error']);
            throw $e;
        }
    }

    public function pushTaskToiCloud(iCloudAccount $account, Task $task): void
    {
        // Create or update event in iCloud calendar
        $icalData = $this->generateiCalendarData($task);

        // Implementation would use CalDAV protocol
        // For now, this is a placeholder
        if (!$task->icalendar_uid) {
            $task->update(['icalendar_uid' => (string) Str::uuid()]);
        }
    }

    public function pullTasksFromiCloud(iCloudAccount $account): void
    {
        // Fetch events from iCloud calendar and create/update tasks
        try {
            $events = $this->getEventsFromiCloud($account);

            foreach ($events as $event) {
                $this->createOrUpdateTaskFromiCalendar($account->user_id, $event);
            }
        } catch (\Exception $e) {
            \Log::error('Failed to pull tasks from iCloud: ' . $e->getMessage());
        }
    }

    private function generateiCalendarData(Task $task): string
    {
        $uid = $task->icalendar_uid ?? (string) Str::uuid();
        $startTime = $task->due_date?->format('Ymd\THis\Z') ?? now()->format('Ymd\THis\Z');

        return <<<ICAL
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Task Management//EN
BEGIN:VEVENT
UID:{$uid}
DTSTAMP:${startTime}
DTSTART:{$startTime}
SUMMARY:{$task->title}
DESCRIPTION:{$task->description}
PRIORITY:5
STATUS:TENTATIVE
END:VEVENT
END:VCALENDAR
ICAL;
    }

    private function getCalendarsFromiCloud(string $email, string $appPassword): array
    {
        // This would use Sabre\DAV client to fetch calendars
        // Placeholder implementation
        return [
            [
                'id' => 'calendar-primary',
                'url' => 'https://p0X-caldav.icloud.com/calendars/calendar/calendar/',
                'name' => 'Primary Calendar',
            ],
        ];
    }

    private function getEventsFromiCloud(iCloudAccount $account): array
    {
        // This would use CalDAV protocol to fetch events
        // Placeholder implementation
        return [];
    }

    private function createOrUpdateTaskFromiCalendar(int $userId, array $event): void
    {
        Task::updateOrCreate(
            ['icalendar_uid' => $event['uid'] ?? null],
            [
                'title' => $event['summary'] ?? 'Imported Task',
                'description' => $event['description'] ?? null,
                'client_id' => $userId,
                'due_date' => $event['dtstart'] ?? null,
                'status' => Task::STATUS_PENDING,
                'priority' => Task::PRIORITY_MEDIUM,
            ]
        );
    }
}
