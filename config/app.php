<?php

return [
    'app_name' => env('APP_NAME', 'Task Management'),
    'app_env' => env('APP_ENV', 'production'),
    'app_debug' => env('APP_DEBUG', false),
    'app_url' => env('APP_URL', 'http://localhost'),

    'database' => [
        'driver' => env('DB_CONNECTION', 'mysql'),
        'host' => env('DB_HOST', '127.0.0.1'),
        'port' => env('DB_PORT', 3306),
        'database' => env('DB_DATABASE', 'task_management'),
        'username' => env('DB_USERNAME', 'root'),
        'password' => env('DB_PASSWORD', ''),
    ],

    'jwt' => [
        'secret' => env('JWT_SECRET', 'your-secret-key'),
        'algorithm' => 'HS256',
        'expiry' => 3600 * 24, // 24 hours
    ],

    'icloud' => [
        'caldav_base_url' => env('ICALENDAR_URL', 'https://p0X-caldav.icloud.com/'),
        'sync_interval' => 3600, // 1 hour in seconds
    ],

    'file_upload' => [
        'max_size' => 10 * 1024 * 1024, // 10 MB
        'allowed_types' => ['image/jpeg', 'image/png', 'application/pdf', 'text/plain'],
    ],
];
