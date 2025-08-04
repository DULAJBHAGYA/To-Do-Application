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
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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
     * Get current authenticated user
     */
    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }
        
        String username = authentication.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
    
    /**
     * Get tasks for the current user
     */
    @GetMapping
    public ResponseEntity<List<Task>> getTasks() {
        try {
            User currentUser = getCurrentUser();
            logger.debug("GET /api/tasks - Fetching tasks for user: {}", currentUser.getUsername());
            
            List<Task> tasks = taskService.getRecentTasksByUser(currentUser);
            return ResponseEntity.ok(tasks);
        } catch (Exception e) {
            logger.error("Error fetching tasks: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
    
    /**
     * Create a new task for the current user
     */
    @PostMapping
    public ResponseEntity<Task> createTask(@Valid @RequestBody Task task) {
        try {
            User currentUser = getCurrentUser();
            logger.debug("POST /api/tasks - Creating new task: {} for user: {}", task.getTitle(), currentUser.getUsername());
            
            Task createdTask = taskService.createTaskForUser(task, currentUser);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdTask);
        } catch (IllegalArgumentException e) {
            logger.error("Error creating task: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            logger.error("Error creating task: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
    
    /**
     * Mark a task as completed
     */
    @PutMapping("/{id}/complete")
    public ResponseEntity<Task> completeTask(@PathVariable Long id) {
        try {
            User currentUser = getCurrentUser();
            logger.debug("PUT /api/tasks/{}/complete - Marking task as completed for user: {}", id, currentUser.getUsername());
            
            Task completedTask = taskService.completeTask(id, currentUser);
            return ResponseEntity.ok(completedTask);
        } catch (IllegalArgumentException e) {
            logger.error("Error completing task {}: {}", id, e.getMessage());
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            logger.error("Error completing task: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
    
    /**
     * Delete a task
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        try {
            User currentUser = getCurrentUser();
            logger.debug("DELETE /api/tasks/{} - Deleting task for user: {}", id, currentUser.getUsername());
            
            taskService.deleteTask(id, currentUser);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            logger.error("Error deleting task {}: {}", id, e.getMessage());
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            logger.error("Error deleting task: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
    
    /**
     * Get a specific task by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable Long id) {
        try {
            User currentUser = getCurrentUser();
            logger.debug("GET /api/tasks/{} - Fetching task by ID for user: {}", id, currentUser.getUsername());
            
            Optional<Task> task = taskService.getTaskById(id, currentUser);
            return task.map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            logger.error("Error fetching task: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
    
    /**
     * Get completed tasks for the current user
     */
    @GetMapping("/completed")
    public ResponseEntity<List<Task>> getCompletedTasks() {
        try {
            User currentUser = getCurrentUser();
            logger.debug("GET /api/tasks/completed - Fetching completed tasks for user: {}", currentUser.getUsername());
            
            List<Task> tasks = taskService.getRecentCompletedTasksByUser(currentUser);
            return ResponseEntity.ok(tasks);
        } catch (Exception e) {
            logger.error("Error fetching completed tasks: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
    
    /**
     * Get all tasks for the current user
     */
    @GetMapping("/all")
    public ResponseEntity<List<Task>> getAllTasks() {
        try {
            User currentUser = getCurrentUser();
            logger.debug("GET /api/tasks/all - Fetching all tasks for user: {}", currentUser.getUsername());
            
            List<Task> tasks = taskService.getAllTasksByUser(currentUser);
            return ResponseEntity.ok(tasks);
        } catch (Exception e) {
            logger.error("Error fetching all tasks: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
}