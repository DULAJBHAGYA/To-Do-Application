package com.todoapp.controller;

import com.todoapp.model.Task;
import com.todoapp.model.User;
import com.todoapp.repository.UserRepository;
import com.todoapp.service.TaskService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*")
public class TaskController {
    
    private static final Logger logger = LoggerFactory.getLogger(TaskController.class);
    
    private final TaskService taskService;
    private final UserRepository userRepository;
    
    @Autowired
    public TaskController(TaskService taskService, UserRepository userRepository) {
        this.taskService = taskService;
        this.userRepository = userRepository;
    }
    
    /**
     * Get tasks for the current user
     */
    @GetMapping
    public ResponseEntity<List<Task>> getTasks(@RequestHeader(value = "X-User-ID", required = false) Long userId) {
        logger.debug("GET /api/tasks - Fetching tasks for user: {}", userId);
        
        if (userId == null) {
            // For backward compatibility, return all tasks
            List<Task> tasks = taskService.getRecentTasks();
            return ResponseEntity.ok(tasks);
        }
        
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        List<Task> tasks = taskService.getRecentTasksByUser(userOpt.get());
        return ResponseEntity.ok(tasks);
    }
    
    /**
     * Create a new task for the current user
     */
    @PostMapping
    public ResponseEntity<Task> createTask(@Valid @RequestBody Task task, 
                                         @RequestHeader(value = "X-User-ID", required = false) Long userId) {
        logger.debug("POST /api/tasks - Creating new task: {} for user: {}", task.getTitle(), userId);
        
        try {
            Task createdTask;
            if (userId != null) {
                Optional<User> userOpt = userRepository.findById(userId);
                if (userOpt.isEmpty()) {
                    return ResponseEntity.badRequest().build();
                }
                createdTask = taskService.createTaskForUser(task, userOpt.get());
            } else {
                createdTask = taskService.createTask(task);
            }
            return ResponseEntity.status(HttpStatus.CREATED).body(createdTask);
        } catch (IllegalArgumentException e) {
            logger.error("Error creating task: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Mark a task as completed
     */
    @PutMapping("/{id}/complete")
    public ResponseEntity<Task> completeTask(@PathVariable Long id,
                                           @RequestHeader(value = "X-User-ID", required = false) Long userId) {
        logger.debug("PUT /api/tasks/{}/complete - Marking task as completed for user: {}", id, userId);
        
        try {
            Task completedTask;
            if (userId != null) {
                Optional<User> userOpt = userRepository.findById(userId);
                if (userOpt.isEmpty()) {
                    return ResponseEntity.badRequest().build();
                }
                completedTask = taskService.completeTask(id, userOpt.get());
            } else {
                completedTask = taskService.completeTask(id);
            }
            return ResponseEntity.ok(completedTask);
        } catch (IllegalArgumentException e) {
            logger.error("Error completing task {}: {}", id, e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Delete a task
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id,
                                         @RequestHeader(value = "X-User-ID", required = false) Long userId) {
        logger.debug("DELETE /api/tasks/{} - Deleting task for user: {}", id, userId);
        
        try {
            if (userId != null) {
                Optional<User> userOpt = userRepository.findById(userId);
                if (userOpt.isEmpty()) {
                    return ResponseEntity.badRequest().build();
                }
                taskService.deleteTask(id, userOpt.get());
            } else {
                taskService.deleteTask(id);
            }
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            logger.error("Error deleting task {}: {}", id, e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Get a specific task by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable Long id,
                                          @RequestHeader(value = "X-User-ID", required = false) Long userId) {
        logger.debug("GET /api/tasks/{} - Fetching task by ID for user: {}", id, userId);
        
        Optional<Task> task;
        if (userId != null) {
            Optional<User> userOpt = userRepository.findById(userId);
            if (userOpt.isEmpty()) {
                return ResponseEntity.badRequest().build();
            }
            task = taskService.getTaskById(id, userOpt.get());
        } else {
            task = taskService.getTaskById(id);
        }
        
        return task.map(ResponseEntity::ok)
                  .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * Get completed tasks for the current user
     */
    @GetMapping("/completed")
    public ResponseEntity<List<Task>> getCompletedTasks(@RequestHeader(value = "X-User-ID", required = false) Long userId) {
        logger.debug("GET /api/tasks/completed - Fetching completed tasks for user: {}", userId);
        
        List<Task> tasks;
        if (userId != null) {
            Optional<User> userOpt = userRepository.findById(userId);
            if (userOpt.isEmpty()) {
                return ResponseEntity.badRequest().build();
            }
            tasks = taskService.getRecentCompletedTasksByUser(userOpt.get());
        } else {
            tasks = taskService.getRecentCompletedTasks();
        }
        
        return ResponseEntity.ok(tasks);
    }
    
    /**
     * Get all tasks for the current user
     */
    @GetMapping("/all")
    public ResponseEntity<List<Task>> getAllTasks(@RequestHeader(value = "X-User-ID", required = false) Long userId) {
        logger.debug("GET /api/tasks/all - Fetching all tasks for user: {}", userId);
        
        if (userId == null) {
            return ResponseEntity.badRequest().build();
        }
        
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        List<Task> tasks = taskService.getAllTasksByUser(userOpt.get());
        return ResponseEntity.ok(tasks);
    }
}