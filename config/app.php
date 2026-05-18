<?php

return [
    'name' => env('APP_NAME', 'Task Management'),
    'env' => env('APP_ENV', 'production'),
    'debug' => env('APP_DEBUG', false),
    'url' => env('APP_URL', 'http://localhost'),

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
