<?php

namespace App\Http\Controllers;

use App\Models\Project;

class DashboardController extends Controller
{
    public function index()
    {
        $projects = Project::with('tasks')->get();
        return response()->json(['projects' => $projects]);
    }
}
