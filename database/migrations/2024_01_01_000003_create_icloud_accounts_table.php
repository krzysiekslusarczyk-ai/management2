<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('icloud_accounts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('icloud_email');
            $table->text('app_password');
            $table->string('calendar_url')->nullable();
            $table->string('calendar_id')->nullable();
            $table->boolean('sync_enabled')->default(false);
            $table->dateTime('last_sync_at')->nullable();
            $table->enum('sync_status', ['idle', 'syncing', 'success', 'error'])->default('idle');
            $table->timestamps();
            
            $table->unique(['user_id', 'icloud_email']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('icloud_accounts');
    }
};
