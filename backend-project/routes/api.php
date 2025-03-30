<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TaskController;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/dashboard', [ProjectController::class, 'dashboard']);
    // to project routes
    Route::apiResource('projects', ProjectController::class);
    Route::delete('/projects/{id}', [ProjectController::class, 'destroy']);
    Route::put('/projects/{id}', [ProjectController::class, 'update']); 
    // Add proper task routes
    Route::get('/projects/{project}/tasks', [TaskController::class, 'index']);    // Get tasks for a project
    Route::post('/projects/{project}/tasks', [TaskController::class, 'store']);   // Create a new task
    Route::put('/projects/{project}/tasks/{id}', [TaskController::class, 'update']); // Update task
    Route::delete('/projects/{project}/tasks/{id}', [TaskController::class, 'destroy']); // Delete task
    // Logout endpoint
    Route::post('/logout', [AuthController::class, 'logout']);
});

// Authentication routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

