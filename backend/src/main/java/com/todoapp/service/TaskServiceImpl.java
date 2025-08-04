package com.todoapp.service;

import com.todoapp.model.Task;
import com.todoapp.model.User;
import com.todoapp.repository.TaskRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class TaskServiceImpl implements TaskService {
    
    private static final Logger logger = LoggerFactory.getLogger(TaskServiceImpl.class);
    
    private final TaskRepository taskRepository;
    
    @Autowired
    public TaskServiceImpl(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<Task> getRecentTasks() {
        logger.debug("Fetching the most recent 5 incomplete tasks");
        Pageable pageable = PageRequest.of(0, 5);
        return taskRepository.findTop5IncompleteTasks(pageable);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<Task> getRecentTasksByUser(User user) {
        logger.debug("Fetching the most recent 5 incomplete tasks for user: {}", user.getUsername());
        Pageable pageable = PageRequest.of(0, 5);
        return taskRepository.findTop5IncompleteTasksByUser(user, pageable);
    }
    
    @Override
    public Task createTask(Task task) {
        logger.debug("Creating new task: {}", task.getTitle());
        
        if (task.getTitle() == null || task.getTitle().trim().isEmpty()) {
            throw new IllegalArgumentException("Task title cannot be empty");
        }
        
        task.setCompleted(false);
        Task savedTask = taskRepository.save(task);
        logger.info("Created new task with ID: {}", savedTask.getId());
        return savedTask;
    }
    
    @Override
    public Task createTaskForUser(Task task, User user) {
        logger.debug("Creating new task: {} for user: {}", task.getTitle(), user.getUsername());
        
        if (task.getTitle() == null || task.getTitle().trim().isEmpty()) {
            throw new IllegalArgumentException("Task title cannot be empty");
        }
        
        task.setCompleted(false);
        task.setUser(user);
        Task savedTask = taskRepository.save(task);
        logger.info("Created new task with ID: {} for user: {}", savedTask.getId(), user.getUsername());
        return savedTask;
    }
    
    @Override
    public Task completeTask(Long id) {
        logger.debug("Marking task {} as completed", id);
        
        Optional<Task> taskOpt = taskRepository.findById(id);
        if (taskOpt.isEmpty()) {
            throw new IllegalArgumentException("Task with ID " + id + " not found");
        }
        
        Task task = taskOpt.get();
        task.setCompleted(true);
        task.setCompletedAt(LocalDateTime.now());
        Task updatedTask = taskRepository.save(task);
        logger.info("Task {} marked as completed", id);
        return updatedTask;
    }
    
    @Override
    public Task completeTask(Long id, User user) {
        logger.debug("Marking task {} as completed for user: {}", id, user.getUsername());
        
        Optional<Task> taskOpt = taskRepository.findById(id);
        if (taskOpt.isEmpty()) {
            throw new IllegalArgumentException("Task with ID " + id + " not found");
        }
        
        Task task = taskOpt.get();
        if (!task.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Task does not belong to user: " + user.getUsername());
        }
        
        task.setCompleted(true);
        task.setCompletedAt(LocalDateTime.now());
        Task updatedTask = taskRepository.save(task);
        logger.info("Task {} marked as completed for user: {}", id, user.getUsername());
        return updatedTask;
    }
    
    @Override
    public void deleteTask(Long id) {
        logger.debug("Deleting task {}", id);
        
        if (!taskRepository.existsById(id)) {
            throw new IllegalArgumentException("Task with ID " + id + " not found");
        }
        
        taskRepository.deleteById(id);
        logger.info("Task {} deleted", id);
    }
    
    @Override
    public void deleteTask(Long id, User user) {
        logger.debug("Deleting task {} for user: {}", id, user.getUsername());
        
        Optional<Task> taskOpt = taskRepository.findById(id);
        if (taskOpt.isEmpty()) {
            throw new IllegalArgumentException("Task with ID " + id + " not found");
        }
        
        Task task = taskOpt.get();
        if (!task.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Task does not belong to user: " + user.getUsername());
        }
        
        taskRepository.deleteById(id);
        logger.info("Task {} deleted for user: {}", id, user.getUsername());
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<Task> getTaskById(Long id) {
        logger.debug("Fetching task by ID: {}", id);
        return taskRepository.findById(id);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<Task> getTaskById(Long id, User user) {
        logger.debug("Fetching task by ID: {} for user: {}", id, user.getUsername());
        Optional<Task> taskOpt = taskRepository.findById(id);
        if (taskOpt.isPresent() && taskOpt.get().getUser().getId().equals(user.getId())) {
            return taskOpt;
        }
        return Optional.empty();
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<Task> getAllIncompleteTasks() {
        logger.debug("Fetching all incomplete tasks");
        return taskRepository.findAllIncompleteTasks();
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<Task> getAllIncompleteTasksByUser(User user) {
        logger.debug("Fetching all incomplete tasks for user: {}", user.getUsername());
        return taskRepository.findAllIncompleteTasksByUser(user);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<Task> getRecentCompletedTasks() {
        logger.debug("Fetching the most recent 5 completed tasks");
        Pageable pageable = PageRequest.of(0, 5);
        return taskRepository.findTop5CompletedTasks(pageable);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<Task> getRecentCompletedTasksByUser(User user) {
        logger.debug("Fetching the most recent 5 completed tasks for user: {}", user.getUsername());
        Pageable pageable = PageRequest.of(0, 5);
        return taskRepository.findTop5CompletedTasksByUser(user, pageable);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<Task> getAllTasksByUser(User user) {
        logger.debug("Fetching all tasks for user: {}", user.getUsername());
        return taskRepository.findAllTasksByUser(user);
    }
}