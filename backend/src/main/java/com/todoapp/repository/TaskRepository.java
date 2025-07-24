package com.todoapp.repository;

import com.todoapp.model.Task;
import com.todoapp.model.User;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    
    /**
     * Find the most recent 5 incomplete tasks
     */
    @Query("SELECT t FROM Task t WHERE t.completed = false ORDER BY t.createdAt DESC")
    List<Task> findTop5IncompleteTasks(Pageable pageable);
    
    /**
     * Find the most recent 5 incomplete tasks for a specific user
     */
    @Query("SELECT t FROM Task t WHERE t.completed = false AND t.user = :user ORDER BY t.createdAt DESC")
    List<Task> findTop5IncompleteTasksByUser(@Param("user") User user, Pageable pageable);
    
    /**
     * Count incomplete tasks
     */
    @Query("SELECT COUNT(t) FROM Task t WHERE t.completed = false")
    long countIncompleteTasks();
    
    /**
     * Count incomplete tasks for a specific user
     */
    @Query("SELECT COUNT(t) FROM Task t WHERE t.completed = false AND t.user = :user")
    long countIncompleteTasksByUser(@Param("user") User user);
    
    /**
     * Find all incomplete tasks
     */
    @Query("SELECT t FROM Task t WHERE t.completed = false ORDER BY t.createdAt DESC")
    List<Task> findAllIncompleteTasks();
    
    /**
     * Find all incomplete tasks for a specific user
     */
    @Query("SELECT t FROM Task t WHERE t.completed = false AND t.user = :user ORDER BY t.createdAt DESC")
    List<Task> findAllIncompleteTasksByUser(@Param("user") User user);
    
    /**
     * Find the most recent 5 completed tasks
     */
    @Query("SELECT t FROM Task t WHERE t.completed = true ORDER BY t.completedAt DESC")
    List<Task> findTop5CompletedTasks(Pageable pageable);
    
    /**
     * Find the most recent 5 completed tasks for a specific user
     */
    @Query("SELECT t FROM Task t WHERE t.completed = true AND t.user = :user ORDER BY t.completedAt DESC")
    List<Task> findTop5CompletedTasksByUser(@Param("user") User user, Pageable pageable);
    
    /**
     * Find all tasks for a specific user
     */
    @Query("SELECT t FROM Task t WHERE t.user = :user ORDER BY t.createdAt DESC")
    List<Task> findAllTasksByUser(@Param("user") User user);
}