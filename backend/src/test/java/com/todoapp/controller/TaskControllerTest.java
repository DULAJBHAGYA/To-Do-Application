package com.todoapp.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.todoapp.model.Task;
import com.todoapp.service.TaskService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(TaskController.class)
class TaskControllerTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @MockBean
    private TaskService taskService;
    
    @Autowired
    private ObjectMapper objectMapper;
    
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
    void getTasks_ShouldReturnListOfTasks() throws Exception {
        // Given
        List<Task> tasks = Arrays.asList(testTask);
        when(taskService.getRecentTasks()).thenReturn(tasks);
        
        // When & Then
        mockMvc.perform(get("/api/tasks"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].title").value("Test Task"))
                .andExpect(jsonPath("$[0].description").value("Test Description"))
                .andExpect(jsonPath("$[0].completed").value(false));
        
        verify(taskService).getRecentTasks();
    }
    
    @Test
    void createTask_WithValidTask_ShouldReturnCreatedTask() throws Exception {
        // Given
        Task newTask = new Task("New Task", "New Description");
        when(taskService.createTask(any(Task.class))).thenReturn(testTask);
        
        // When & Then
        mockMvc.perform(post("/api/tasks")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(newTask)))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.title").value("Test Task"));
        
        verify(taskService).createTask(any(Task.class));
    }
    
    @Test
    void createTask_WithInvalidTask_ShouldReturnBadRequest() throws Exception {
        // Given
        Task invalidTask = new Task("", "Description");
        when(taskService.createTask(any(Task.class)))
                .thenThrow(new IllegalArgumentException("Task title cannot be empty"));
        
        // When & Then
        mockMvc.perform(post("/api/tasks")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidTask)))
                .andExpect(status().isBadRequest());
        
        verify(taskService).createTask(any(Task.class));
    }
    
    @Test
    void completeTask_WithValidId_ShouldReturnCompletedTask() throws Exception {
        // Given
        Long taskId = 1L;
        testTask.setCompleted(true);
        when(taskService.completeTask(taskId)).thenReturn(testTask);
        
        // When & Then
        mockMvc.perform(put("/api/tasks/{id}/complete", taskId))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.completed").value(true));
        
        verify(taskService).completeTask(taskId);
    }
    
    @Test
    void completeTask_WithInvalidId_ShouldReturnNotFound() throws Exception {
        // Given
        Long invalidId = 999L;
        when(taskService.completeTask(invalidId))
                .thenThrow(new IllegalArgumentException("Task not found"));
        
        // When & Then
        mockMvc.perform(put("/api/tasks/{id}/complete", invalidId))
                .andExpect(status().isNotFound());
        
        verify(taskService).completeTask(invalidId);
    }
    
    @Test
    void deleteTask_WithValidId_ShouldReturnNoContent() throws Exception {
        // Given
        Long taskId = 1L;
        doNothing().when(taskService).deleteTask(taskId);
        
        // When & Then
        mockMvc.perform(delete("/api/tasks/{id}", taskId))
                .andExpect(status().isNoContent());
        
        verify(taskService).deleteTask(taskId);
    }
    
    @Test
    void deleteTask_WithInvalidId_ShouldReturnNotFound() throws Exception {
        // Given
        Long invalidId = 999L;
        doThrow(new IllegalArgumentException("Task not found"))
                .when(taskService).deleteTask(invalidId);
        
        // When & Then
        mockMvc.perform(delete("/api/tasks/{id}", invalidId))
                .andExpect(status().isNotFound());
        
        verify(taskService).deleteTask(invalidId);
    }
    
    @Test
    void getTaskById_WithValidId_ShouldReturnTask() throws Exception {
        // Given
        Long taskId = 1L;
        when(taskService.getTaskById(taskId)).thenReturn(Optional.of(testTask));
        
        // When & Then
        mockMvc.perform(get("/api/tasks/{id}", taskId))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.title").value("Test Task"));
        
        verify(taskService).getTaskById(taskId);
    }
    
    @Test
    void getTaskById_WithInvalidId_ShouldReturnNotFound() throws Exception {
        // Given
        Long invalidId = 999L;
        when(taskService.getTaskById(invalidId)).thenReturn(Optional.empty());
        
        // When & Then
        mockMvc.perform(get("/api/tasks/{id}", invalidId))
                .andExpect(status().isNotFound());
        
        verify(taskService).getTaskById(invalidId);
    }
}