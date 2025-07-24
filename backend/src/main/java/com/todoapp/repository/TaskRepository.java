package com.todoapp.repository;

import com.todoapp.model.Task;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
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
     * Count incomplete tasks
     */
    @Query("SELECT COUNT(t) FROM Task t WHERE t.completed = false")
    long countIncompleteTasks();
    
    /**
     * Find all incomplete tasks
     */
    @Query("SELECT t FROM Task t WHERE t.completed = false ORDER BY t.createdAt DESC")
    List<Task> findAllIncompleteTasks();
    
    /**
     * Find the most recent 5 completed tasks
     */
    @Query("SELECT t FROM Task t WHERE t.completed = true ORDER BY t.completedAt DESC")
    List<Task> findTop5CompletedTasks(Pageable pageable);
}