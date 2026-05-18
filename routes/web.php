<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('index');
})->name('home');

Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware('auth')->name('dashboard');

Route::get('/tasks', function () {
    return view('tasks');
})->middleware('auth')->name('tasks');

Route::get('/calendar', function () {
    return view('calendar');
})->middleware('auth')->name('calendar');

Route::get('/settings', function () {
    return view('settings');
})->middleware('auth')->name('settings');
