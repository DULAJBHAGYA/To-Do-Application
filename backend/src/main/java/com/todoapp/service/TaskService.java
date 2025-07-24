package com.todoapp.service;

import com.todoapp.model.Task;
import java.util.List;
import java.util.Optional;

public interface TaskService {
    
    /**
     * Get the most recent 5 incomplete tasks
     */
    List<Task> getRecentTasks();
    
    /**
     * Create a new task
     */
    Task createTask(Task task);
    
    /**
     * Mark a task as completed
     */
    Task completeTask(Long id);
    
    /**
     * Delete a task
     */
    void deleteTask(Long id);
    
    /**
     * Get a task by ID
     */
    Optional<Task> getTaskById(Long id);
    
    /**
     * Get all incomplete tasks
     */
    List<Task> getAllIncompleteTasks();
    
    /**
     * Get the most recent 5 completed tasks
     */
    List<Task> getRecentCompletedTasks();
}