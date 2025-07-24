CREATE TABLE task (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITHOUT TIME ZONE,
    completed_at TIMESTAMP WITHOUT TIME ZONE,
    priority VARCHAR(20),
    due_date TIMESTAMP WITHOUT TIME ZONE
);

INSERT INTO task (title, description, completed) VALUES 
    ('Sample Task 1', 'This is a sample task for testing', FALSE),
    ('Sample Task 2', 'Another sample task', FALSE),
    ('Completed Task', 'This task is already completed', TRUE);