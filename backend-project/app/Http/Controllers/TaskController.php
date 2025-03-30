<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

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
        $task = Task::findOrFail($taskId);
    
        // Normalize the status casing
        $statusMap = [
            "pending" => "Pending",
            "in_progress" => "In Progress",
            "completed" => "Completed"
        ];
        $status = $statusMap[strtolower(str_replace("_", " ", $request->input('status')))] ?? $request->input('status');
    
        $task->update([
            'title' => $request->input('title'),
            'status' => $status,  
        ]);
    
        return response()->json([
            'message' => 'Task updated successfully',
            'task' => $task
        ]);
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
