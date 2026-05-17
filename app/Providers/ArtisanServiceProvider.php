<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Foundation\Console\KeyGenerateCommand;
use Illuminate\Foundation\Console\ServeCommand;
use Illuminate\Database\Console\Migrations\MigrateCommand;
use Illuminate\Database\Console\Migrations\FreshCommand;
use Illuminate\Database\Console\Migrations\InstallCommand;
use Illuminate\Database\Console\Migrations\RefreshCommand;
use Illuminate\Database\Console\Migrations\ResetCommand;
use Illuminate\Database\Console\Migrations\RollbackCommand;
use Illuminate\Database\Console\Migrations\StatusCommand;
use Illuminate\Database\Console\Seeds\SeedCommand;
use Illuminate\Database\Console\Migrations\MigrateMakeCommand;

class ArtisanServiceProvider extends ServiceProvider
{
    /**
     * Register services in the container.
     */
    public function register(): void
    {
        // Register the key:generate command
        // Register migration commands
        // Register serve command
        $this->commands([
            KeyGenerateCommand::class,
            MigrateCommand::class,
            FreshCommand::class,
            InstallCommand::class,
            RefreshCommand::class,
            ResetCommand::class,
            RollbackCommand::class,
            StatusCommand::class,
            SeedCommand::class,
            MigrateMakeCommand::class,
            ServeCommand::class,
        ]);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
