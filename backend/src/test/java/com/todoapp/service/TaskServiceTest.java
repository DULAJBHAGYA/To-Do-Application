package com.todoapp.service;

import com.todoapp.model.Task;
import com.todoapp.repository.TaskRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TaskServiceTest {
    
    @Mock
    private TaskRepository taskRepository;
    
    @InjectMocks
    private TaskServiceImpl taskService;
    
    private Task testTask;
    
    @BeforeEach
    void setUp() {
        testTask = new Task();
        testTask.setId(1L);
        testTask.setTitle("Test Task");
        testTask.setDescription("Test Description");
        testTask.setCompleted(false);
        testTask.setCreatedAt(LocalDateTime.now());
    }
    
    @Test
    void getRecentTasks_ShouldReturnTop5IncompleteTasks() {
        // Given
        List<Task> expectedTasks = Arrays.asList(testTask);
        when(taskRepository.findTop5IncompleteTasks(any(Pageable.class))).thenReturn(expectedTasks);
        
        // When
        List<Task> actualTasks = taskService.getRecentTasks();
        
        // Then
        assertEquals(expectedTasks, actualTasks);
        verify(taskRepository).findTop5IncompleteTasks(PageRequest.of(0, 5));
    }
    
    @Test
    void createTask_WithValidTask_ShouldSaveAndReturnTask() {
        // Given
        Task newTask = new Task("New Task", "New Description");
        when(taskRepository.save(any(Task.class))).thenReturn(testTask);
        
        // When
        Task createdTask = taskService.createTask(newTask);
        
        // Then
        assertEquals(testTask, createdTask);
        verify(taskRepository).save(newTask);
        assertFalse(newTask.getCompleted());
    }
    
    @Test
    void createTask_WithEmptyTitle_ShouldThrowException() {
        // Given
        Task taskWithEmptyTitle = new Task("", "Description");
        
        // When & Then
        assertThrows(IllegalArgumentException.class, () -> taskService.createTask(taskWithEmptyTitle));
        verify(taskRepository, never()).save(any(Task.class));
    }
    
    @Test
    void createTask_WithNullTitle_ShouldThrowException() {
        // Given
        Task taskWithNullTitle = new Task(null, "Description");
        
        // When & Then
        assertThrows(IllegalArgumentException.class, () -> taskService.createTask(taskWithNullTitle));
        verify(taskRepository, never()).save(any(Task.class));
    }
    
    @Test
    void completeTask_WithValidId_ShouldMarkAsCompleted() {
        // Given
        Long taskId = 1L;
        when(taskRepository.findById(taskId)).thenReturn(Optional.of(testTask));
        when(taskRepository.save(any(Task.class))).thenReturn(testTask);
        
        // When
        Task completedTask = taskService.completeTask(taskId);
        
        // Then
        assertTrue(testTask.getCompleted());
        assertEquals(testTask, completedTask);
        verify(taskRepository).findById(taskId);
        verify(taskRepository).save(testTask);
    }
    
    @Test
    void completeTask_WithInvalidId_ShouldThrowException() {
        // Given
        Long invalidId = 999L;
        when(taskRepository.findById(invalidId)).thenReturn(Optional.empty());
        
        // When & Then
        assertThrows(IllegalArgumentException.class, () -> taskService.completeTask(invalidId));
        verify(taskRepository).findById(invalidId);
        verify(taskRepository, never()).save(any(Task.class));
    }
    
    @Test
    void deleteTask_WithValidId_ShouldDeleteTask() {
        // Given
        Long taskId = 1L;
        when(taskRepository.existsById(taskId)).thenReturn(true);
        
        // When
        taskService.deleteTask(taskId);
        
        // Then
        verify(taskRepository).existsById(taskId);
        verify(taskRepository).deleteById(taskId);
    }
    
    @Test
    void deleteTask_WithInvalidId_ShouldThrowException() {
        // Given
        Long invalidId = 999L;
        when(taskRepository.existsById(invalidId)).thenReturn(false);
        
        // When & Then
        assertThrows(IllegalArgumentException.class, () -> taskService.deleteTask(invalidId));
        verify(taskRepository).existsById(invalidId);
        verify(taskRepository, never()).deleteById(any(Long.class));
    }
    
    @Test
    void getTaskById_WithValidId_ShouldReturnTask() {
        // Given
        Long taskId = 1L;
        when(taskRepository.findById(taskId)).thenReturn(Optional.of(testTask));
        
        // When
        Optional<Task> foundTask = taskService.getTaskById(taskId);
        
        // Then
        assertTrue(foundTask.isPresent());
        assertEquals(testTask, foundTask.get());
        verify(taskRepository).findById(taskId);
    }
    
    @Test
    void getTaskById_WithInvalidId_ShouldReturnEmpty() {
        // Given
        Long invalidId = 999L;
        when(taskRepository.findById(invalidId)).thenReturn(Optional.empty());
        
        // When
        Optional<Task> foundTask = taskService.getTaskById(invalidId);
        
        // Then
        assertFalse(foundTask.isPresent());
        verify(taskRepository).findById(invalidId);
    }
    
    @Test
    void getAllIncompleteTasks_ShouldReturnAllIncompleteTasks() {
        // Given
        List<Task> expectedTasks = Arrays.asList(testTask);
        when(taskRepository.findAllIncompleteTasks()).thenReturn(expectedTasks);
        
        // When
        List<Task> actualTasks = taskService.getAllIncompleteTasks();
        
        // Then
        assertEquals(expectedTasks, actualTasks);
        verify(taskRepository).findAllIncompleteTasks();
    }
}