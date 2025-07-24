package com.todoapp.controller;

import com.todoapp.model.Task;
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
@CrossOrigin(origins = "http://localhost:3000")
public class TaskController {
    
    private static final Logger logger = LoggerFactory.getLogger(TaskController.class);
    
    private final TaskService taskService;
    
    @Autowired
    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }
    
    /**
     * Get the most recent 5 incomplete tasks
     */
    @GetMapping
    public ResponseEntity<List<Task>> getTasks() {
        logger.debug("GET /api/tasks - Fetching recent tasks");
        List<Task> tasks = taskService.getRecentTasks();
        return ResponseEntity.ok(tasks);
    }
    
    /**
     * Create a new task
     */
    @PostMapping
    public ResponseEntity<Task> createTask(@Valid @RequestBody Task task) {
        logger.debug("POST /api/tasks - Creating new task: {}", task.getTitle());
        try {
            Task createdTask = taskService.createTask(task);
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
    public ResponseEntity<Task> completeTask(@PathVariable Long id) {
        logger.debug("PUT /api/tasks/{}/complete - Marking task as completed", id);
        try {
            Task completedTask = taskService.completeTask(id);
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
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        logger.debug("DELETE /api/tasks/{} - Deleting task", id);
        try {
            taskService.deleteTask(id);
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
    public ResponseEntity<Task> getTaskById(@PathVariable Long id) {
        logger.debug("GET /api/tasks/{} - Fetching task by ID", id);
        Optional<Task> task = taskService.getTaskById(id);
        return task.map(ResponseEntity::ok)
                  .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * Get the most recent 5 completed tasks
     */
    @GetMapping("/completed")
    public ResponseEntity<List<Task>> getCompletedTasks() {
        logger.debug("GET /api/tasks/completed - Fetching recent completed tasks");
        List<Task> tasks = taskService.getRecentCompletedTasks();
        return ResponseEntity.ok(tasks);
    }
}