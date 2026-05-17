<?php

namespace App\Helpers;

use App\Models\Task;

class TaskHelper
{
    /**
     * Get color code for priority
     */
    public static function getPriorityColor(string $priority): string
    {
        $colors = [
            'low' => '#6c757d',
            'medium' => '#17a2b8',
            'high' => '#ffc107',
            'urgent' => '#dc3545',
        ];

        return $colors[$priority] ?? '#007bff';
    }

    /**
     * Get color code for status
     */
    public static function getStatusColor(string $status): string
    {
        $colors = [
            'pending' => '#ffc107',
            'in_progress' => '#007bff',
            'completed' => '#28a745',
            'cancelled' => '#6c757d',
        ];

        return $colors[$status] ?? '#007bff';
    }

    /**
     * Get localized status label
     */
    public static function getStatusLabel(string $status): string
    {
        $labels = [
            'pending' => 'Nowe',
            'in_progress' => 'W trakcie',
            'completed' => 'Ukończone',
            'cancelled' => 'Anulowane',
        ];

        return $labels[$status] ?? $status;
    }

    /**
     * Get localized priority label
     */
    public static function getPriorityLabel(string $priority): string
    {
        $labels = [
            'low' => 'Niski',
            'medium' => 'Średni',
            'high' => 'Wysoki',
            'urgent' => 'Nadzwyczajny',
        ];

        return $labels[$priority] ?? $priority;
    }

    /**
     * Check if task is overdue
     */
    public static function isOverdue(Task $task): bool
    {
        if (!$task->due_date) {
            return false;
        }

        return $task->due_date < now() && $task->status !== Task::STATUS_COMPLETED;
    }

    /**
     * Get days remaining
     */
    public static function getDaysRemaining(Task $task): ?int
    {
        if (!$task->due_date) {
            return null;
        }

        return $task->due_date->diffInDays(now());
    }

    /**
     * Format task duration for calendar
     */
    public static function formatTaskForCalendar(Task $task): array
    {
        return [
            'id' => $task->id,
            'title' => $task->title,
            'start' => $task->due_date?->format('Y-m-d'),
            'end' => $task->due_date?->format('Y-m-d'),
            'backgroundColor' => static::getPriorityColor($task->priority),
            'borderColor' => static::getPriorityColor($task->priority),
            'extendedProps' => [
                'description' => $task->description,
                'status' => $task->status,
                'priority' => $task->priority,
            ],
        ];
    }
}
