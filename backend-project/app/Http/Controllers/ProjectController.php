<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProjectController extends Controller
{
    // Fetch Projects with Cross-Account Support
    public function index(Request $request)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // Allow admin or authorized users to view all projects
        $userId = $request->query('user_id', $user->id);
        
        $projects = Project::where('user_id', $userId)
                        ->with('tasks')
                        ->get();

        return response()->json($projects);
    }

    //  Create Project with Cross-Account Support
    public function store(Request $request)
    {
        $validated = $request->validate([
            'project_name' => 'required|string|max:255',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'status' => 'required|in:Pending,In Progress,Completed',
            'user_id' => 'nullable|exists:users,id', // Allow specifying user_id
        ]);

        // Use the specified user_id or fallback to the authenticated user
        $userId = $validated['user_id'] ?? Auth::id();

        $project = Project::create([
            'user_id' => $userId,
            'project_name' => $validated['project_name'],
            'title' => $validated['title'],
            'description' => $validated['description'],
            'status' => $validated['status'],
        ]);

        return response()->json($project, 201);
    }

    public function update(Request $request, $id)
    {
        //  Log the token and user_id for debugging
        \Log::info('Received token:', ['token' => $request->bearerToken()]);
        \Log::info('Received user_id:', ['user_id' => $request->user_id]);
    
        try {
            $user = Auth::user();  // Authenticate the current user
            if (!$user) {
                return response()->json(['error' => 'Unauthorized'], 401);
            }
    
            $userId = $user->id;  // Use authenticated user ID
            \Log::info('Authenticated User ID:', ['user_id' => $userId]);
    
            $project = Project::where('id', $id)
                              ->where('user_id', $userId)
                              ->first();
    
            if (!$project) {
                return response()->json(['error' => 'Project not found or unauthorized'], 404);
            }
    
            // Validate the request
            $validated = $request->validate([
                'project_name' => 'required|string|max:255',
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'status' => 'required|in:Pending,In Progress,Completed',
            ]);
    
            $project->update($validated);
    
            return response()->json([
                'message' => 'Project updated successfully',
                'project' => $project
            ]);
    
        } catch (\Exception $e) {
            \Log::error('Error updating project:', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    }

    //Delete Project with Cross-Account Support
    public function destroy(Request $request, $id)
    {
        $userId = $request->query('user_id') ?? Auth::id();

        $project = Project::where('id', $id)
                          ->where('user_id', $userId)
                          ->first();

        if (!$project) {
            return response()->json(['error' => 'Project not found or unauthorized'], 404);
        }

        $project->delete();

        return response()->json(['message' => 'Project deleted successfully']);
    }

    //Dashboard Overview
    public function dashboard(Request $request)
    {
        $userId = $request->query('user_id', Auth::id());

        $projects = Project::where('user_id', $userId)->get();

        return response()->json([
            'total_projects' => $projects->count(),
            'completed_projects' => $projects->where('status', 'Completed')->count(),
            'pending_projects' => $projects->where('status', 'Pending')->count(),
            'in_progress_projects' => $projects->where('status', 'In Progress')->count(),
            'projects' => $projects,
        ]);
    }
}

