-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create task table with user relationship
CREATE TABLE task (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITHOUT TIME ZONE,
    completed_at TIMESTAMP WITHOUT TIME ZONE,
    priority VARCHAR(20),
    due_date TIMESTAMP WITHOUT TIME ZONE,
    user_id INTEGER REFERENCES users(id)
);

-- Insert sample user (password: password123)
INSERT INTO users (username, email, password) VALUES 
    ('demo', 'demo@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

-- Insert sample tasks for the demo user
INSERT INTO task (title, description, completed, user_id) VALUES 
    ('Sample Task 1', 'This is a sample task for testing', FALSE, 1),
    ('Sample Task 2', 'Another sample task', FALSE, 1),
    ('Completed Task', 'This task is already completed', TRUE, 1);