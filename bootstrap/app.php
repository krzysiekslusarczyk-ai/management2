<?php

/*
|--------------------------------------------------------------------------
| Create The Application
|--------------------------------------------------------------------------
|
| The first thing we will do is create a new Laravel application instance
| which serves as the "glue" for all the components of Laravel, and is
| the IoC container for the system binding all of the various parts.
|
*/

$app = new Illuminate\Foundation\Application(
    $_ENV['APP_BASE_PATH'] ?? dirname(__DIR__)
);

/*
|--------------------------------------------------------------------------
| Bind Important Interfaces
|--------------------------------------------------------------------------
|
| Next, we need to bind some important interfaces into the container so
| we will be able to resolve them when needed. The kernel serves the
| incoming requests to this application from both the web and CLI.
|
*/

$app->singleton(
    Illuminate\Contracts\Http\Kernel::class,
    App\Http\Kernel::class
);

$app->singleton(
    Illuminate\Contracts\Console\Kernel::class,
    App\Console\Kernel::class
);

$app->singleton(
    Illuminate\Contracts\Debug\ExceptionHandler::class,
    App\Exceptions\Handler::class
);

/*
|--------------------------------------------------------------------------
| Register Maintenance Mode Service
|--------------------------------------------------------------------------
|
| Register the maintenance mode service which handles application
| maintenance mode checks and responses.
|
*/

$app->singleton(
    Illuminate\Contracts\Foundation\MaintenanceMode::class,
    Illuminate\Foundation\MaintenanceMode\FileBasedMaintenanceMode::class
);

/*
|--------------------------------------------------------------------------
| Register File System Service
|--------------------------------------------------------------------------
|
| Register the files service which is used for filesystem operations
| throughout the application.
|
*/

$app->singleton('files', function () {
    return new Illuminate\Filesystem\Filesystem();
});

$app->singleton('composer', function ($app) {
    return new Illuminate\Support\Composer($app['files']);
});

/*
|--------------------------------------------------------------------------
| Register Configuration Service
|--------------------------------------------------------------------------
|
| Register the configuration repository for loading configuration files.
|
*/

$app->singleton('config', function () {
    return new Illuminate\Config\Repository([
        'app' => require __DIR__ . '/../config/app.php',
        'view' => require __DIR__ . '/../config/view.php',
    ]);
});

/*
|--------------------------------------------------------------------------
| Register Event Dispatcher Service
|--------------------------------------------------------------------------
|
| Register the event dispatcher for handling events throughout the app.
|
*/

$app->singleton('events', function ($app) {
    return new Illuminate\Events\Dispatcher($app);
});

/*
|--------------------------------------------------------------------------
| Register Translator Service
|--------------------------------------------------------------------------
|
| Register the translator for localization support.
|
*/

$app->singleton('translator', function ($app) {
    $loader = new Illuminate\Translation\FileLoader(
        $app['files'],
        resource_path('lang')
    );
    
    $locale = 'en';
    
    return new Illuminate\Translation\Translator($loader, $locale);
});

/*
|--------------------------------------------------------------------------
| Register The Command Loader
|--------------------------------------------------------------------------
|
| We'll register the command loader which loads commands from the
| application's console commands directory and external command files.
|
*/

// Register key:generate command directly
$app->singleton(\Illuminate\Foundation\Console\KeyGenerateCommand::class, function ($app) {
    return new \Illuminate\Foundation\Console\KeyGenerateCommand();
});

/*
|--------------------------------------------------------------------------
| Service Provider Registration
|--------------------------------------------------------------------------
|
| Register the service providers for the application.
|
*/

$app->register(Illuminate\Database\DatabaseServiceProvider::class);
$app->register(Illuminate\Database\MigrationServiceProvider::class);
$app->register(Illuminate\Events\EventServiceProvider::class);
$app->register(Illuminate\View\ViewServiceProvider::class);
$app->register(App\Providers\ArtisanServiceProvider::class);

/*
|--------------------------------------------------------------------------
| Return The Application
|--------------------------------------------------------------------------
|
| This script returns the application instance. The instance is given to
| the calling script so we can separate the building of the instances
| from the actual running of the application and sending responses.
|
*/

return $app;
