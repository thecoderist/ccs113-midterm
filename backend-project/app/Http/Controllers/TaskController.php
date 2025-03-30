<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TaskController extends Controller
{
    //Get all tasks for a project
    public function index($projectId)
    {
        $project = Project::find($projectId);

        if (!$project) {
            return response()->json(['error' => 'Project not found'], 404);
        }

        $tasks = $project->tasks;
        return response()->json($tasks);
    }

    // Create a new task
    public function store(Request $request, $projectId)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'status' => 'required|in:pending,in_progress,completed',
        ]);
    
        $project = Project::findOrFail($projectId);
    
        $task = $project->tasks()->create([
            'title' => $validated['title'],
            'status' => $validated['status'],
        ]);
    
        return response()->json(['message' => 'Task created successfully', 'task' => $task], 201);
    }

    // Update a task
    public function update(Request $request, $projectId, $taskId)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'status' => 'required|in:pending,in_progress,completed',
        ]);
    
        $task = Task::where('project_id', $projectId)->findOrFail($taskId);
    
        $task->update([
            'title' => $request->title,
            'status' => $request->status,
        ]);
    
        return response()->json($task);
    }

    // Delete a task
    public function destroy($projectId, $taskId)
    {
        $task = Task::where('project_id', $projectId)->find($taskId);

        if (!$task) {
            return response()->json(['error' => 'Task not found'], 404);
        }

        $task->delete();

        return response()->json(['message' => 'Task deleted successfully']);
    }
}
