<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\iCloudSyncController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);

    // Task routes
    Route::apiResource('tasks', TaskController::class);

    // iCloud sync routes
    Route::post('/icloud/connect', [iCloudSyncController::class, 'connectAccount']);
    Route::get('/icloud/accounts', [iCloudSyncController::class, 'getAccounts']);
    Route::post('/icloud/accounts/{account}/sync', [iCloudSyncController::class, 'syncTasks']);
    Route::patch('/icloud/accounts/{account}/toggle-sync', [iCloudSyncController::class, 'toggleSync']);
    Route::delete('/icloud/accounts/{account}', [iCloudSyncController::class, 'disconnectAccount']);
});
