package com.todoapp.service;

import com.todoapp.model.Task;
import com.todoapp.model.User;
import java.util.List;
import java.util.Optional;

public interface TaskService {
    
    /**
     * Get the most recent 5 incomplete tasks
     */
    List<Task> getRecentTasks();
    
    /**
     * Get the most recent 5 incomplete tasks for a specific user
     */
    List<Task> getRecentTasksByUser(User user);
    
    /**
     * Create a new task
     */
    Task createTask(Task task);
    
    /**
     * Create a new task for a specific user
     */
    Task createTaskForUser(Task task, User user);
    
    /**
     * Mark a task as completed
     */
    Task completeTask(Long id);
    
    /**
     * Mark a task as completed (with user validation)
     */
    Task completeTask(Long id, User user);
    
    /**
     * Delete a task
     */
    void deleteTask(Long id);
    
    /**
     * Delete a task (with user validation)
     */
    void deleteTask(Long id, User user);
    
    /**
     * Get a task by ID
     */
    Optional<Task> getTaskById(Long id);
    
    /**
     * Get a task by ID (with user validation)
     */
    Optional<Task> getTaskById(Long id, User user);
    
    /**
     * Get all incomplete tasks
     */
    List<Task> getAllIncompleteTasks();
    
    /**
     * Get all incomplete tasks for a specific user
     */
    List<Task> getAllIncompleteTasksByUser(User user);
    
    /**
     * Get the most recent 5 completed tasks
     */
    List<Task> getRecentCompletedTasks();
    
    /**
     * Get the most recent 5 completed tasks for a specific user
     */
    List<Task> getRecentCompletedTasksByUser(User user);
    
    /**
     * Get all tasks for a specific user
     */
    List<Task> getAllTasksByUser(User user);
}