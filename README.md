# To-Do Application

A full-stack task management application with user authentication, built with modern technologies and containerized with Docker.

## 🚀 Technologies Used

### Frontend
- **React 18** - Modern UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **React Beautiful DnD** - Drag and drop functionality
- **Axios** - HTTP client for API calls

### Backend
- **Spring Boot 3.2.0** - Java-based REST API framework
- **Spring Data JPA** - Database abstraction layer
- **Spring Web** - RESTful web services
- **Spring Security** - Authentication and authorization
- **Java 17** - Modern Java runtime
- **Maven** - Build tool and dependency management

### Database
- **PostgreSQL 15.3** - Relational database
- **H2 Database** - In-memory database for testing

### DevOps & Containerization
- **Docker** - Containerization platform
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Web server and reverse proxy

## 📋 Features

### Authentication
- ✅ User registration with email validation
- ✅ User login with username/email
- ✅ Secure password hashing (BCrypt)
- ✅ Session-based authentication
- ✅ Protected routes and user-specific data

### Task Management
- ✅ Create, read, update, and delete tasks
- ✅ Mark tasks as complete/incomplete
- ✅ Set task priorities (High, Medium, Low)
- ✅ Add due dates to tasks
- ✅ Drag and drop task reordering
- ✅ Task statistics dashboard
- ✅ User-specific task ownership
- ✅ Responsive design
- ✅ Real-time updates
- ✅ Persistent data storage

## 🏗️ Project Structure

```
To-Do-Application/
├── backend/                 # Spring Boot application
│   ├── src/
│   │   ├── main/java/com/todoapp/
│   │   │   ├── controller/  # REST controllers
│   │   │   ├── model/       # Entity classes
│   │   │   ├── repository/  # Data access layer
│   │   │   ├── service/     # Business logic
│   │   │   ├── dto/         # Data Transfer Objects
│   │   │   ├── config/      # Configuration classes
│   │   │   └── TodoAppApplication.java
│   │   └── resources/
│   │       └── application.yml
│   ├── Dockerfile
│   └── pom.xml
├── frontend/                # React application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── services/        # API services
│   │   ├── hooks/          # Custom React hooks
│   │   └── contexts/       # React contexts
│   ├── Dockerfile
│   ├── nginx.conf          # Nginx configuration
│   ├── vite.config.ts
│   └── package.json
├── database/
│   └── init.sql            # Database initialization
├── docker-compose.yml      # Docker orchestration
└── README.md
```

## 🛠️ Prerequisites

Before running this application, make sure you have the following installed:

- **Docker** (version 20.10 or higher)
- **Docker Compose** (version 2.0 or higher)
- **Git** (for cloning the repository)

## 📦 Installation & Setup

### 1. Clone the Repository

```bash
cd To-Do-Application
```

### 2. Run with Docker Compose

The easiest way to run the application is using Docker Compose, which will build and start all services automatically:

```bash
# Build and start all services
docker-compose up --build -d

# Or run in foreground to see logs
docker-compose up --build
```

### 3. Access the Application

Once all containers are running, you can access the application at:

- **Frontend (Main App)**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **Database**: localhost:5432

## 🔐 Authentication

### Demo Account
The application comes with a pre-configured demo account:

- **Username**: `demo`
- **Password**: `password123`

### Registration
New users can create accounts with:
- Username (3-50 characters)
- Email (valid email format)
- Password (minimum 6 characters)
- Password confirmation

### Login
Users can log in using either:
- Username
- Email address

## 🐳 Docker Commands

### Basic Commands

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View running containers
docker-compose ps

# View logs
docker-compose logs

# Rebuild and restart
docker-compose up --build -d
```

### Service-Specific Commands

```bash
# View logs for specific service
docker-compose logs frontend
docker-compose logs backend
docker-compose logs database

# Restart specific service
docker-compose restart frontend
docker-compose restart backend

# Stop specific service
docker-compose stop frontend
```

### Development Commands

```bash
# Run only backend and database (for frontend development)
docker-compose up -d database backend

# Run frontend in development mode
cd frontend
npm install
npm run dev
```

## 🔧 Configuration

### Environment Variables

The application uses the following environment variables (configured in docker-compose.yml):

```yaml
# Database
POSTGRES_DB: todoapp
POSTGRES_USER: todouser
POSTGRES_PASSWORD: todopass

# Backend
SPRING_DATASOURCE_URL: jdbc:postgresql://database:5432/todoapp
SPRING_DATASOURCE_USERNAME: todouser
SPRING_DATASOURCE_PASSWORD: todopass
```

### Port Configuration

- **Frontend**: 3000 (mapped to nginx port 80)
- **Backend**: 8080
- **Database**: 5432

## 🧪 Testing the Application

### 1. Frontend Testing

Open your browser and navigate to http://localhost:3000

You should see:
- Login/Register page
- Task Manager interface (after authentication)
- User-specific tasks
- Logout functionality

### 2. Backend API Testing

Test the REST API endpoints:

```bash
# Test authentication endpoint
curl http://localhost:8080/api/auth/test

# Login with demo account
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"usernameOrEmail":"demo","password":"password123"}'

# Register new user
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123","confirmPassword":"password123"}'

# Get all tasks
curl http://localhost:8080/api/tasks

# Create a new task
curl -X POST http://localhost:8080/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Task","description":"Testing","priority":"high"}'

# Get task statistics
curl http://localhost:8080/api/tasks/stats
```

### 3. Database Testing

Connect to the PostgreSQL database:

```bash
# Connect using Docker
docker exec -it todo-db psql -U todouser -d todoapp

# Or connect from host (if you have psql installed)
psql -h localhost -p 5432 -U todouser -d todoapp
```

## 🚀 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/test` - Test authentication endpoint

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/{id}` - Update a task
- `DELETE /api/tasks/{id}` - Delete a task
- `PUT /api/tasks/{id}/complete` - Mark task as complete

### Statistics
- `GET /api/tasks/stats` - Get task statistics
- `GET /api/tasks/completed` - Get completed tasks
- `GET /api/tasks/pending` - Get pending tasks
- `GET /api/tasks/high-priority` - Get high priority tasks

## 🔍 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Check what's using the port
   lsof -i :3000
   lsof -i :8080
   
   # Stop conflicting services or change ports in docker-compose.yml
   ```

2. **Docker daemon not running**
   ```bash
   # Start Docker Desktop or Docker daemon
   sudo systemctl start docker  # Linux
   # Or start Docker Desktop on macOS/Windows
   ```

3. **Database connection issues**
   ```bash
   # Check database logs
   docker-compose logs database
   
   # Restart database
   docker-compose restart database
   ```

4. **Authentication issues**
   ```bash
   # Check backend logs
   docker-compose logs backend
   
   # Test authentication endpoint
   curl http://localhost:3000/api/auth/test
   ```

5. **Frontend not loading**
   ```bash
   # Check frontend logs
   docker-compose logs frontend
   
   # Rebuild frontend
   docker-compose up --build -d frontend
   ```

### Logs and Debugging

```bash
# View all logs
docker-compose logs

# Follow logs in real-time
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
```

## 📝 Development

### Running in Development Mode

For development, you can run the frontend separately:

```bash
# Start backend and database
docker-compose up -d database backend

# Run frontend in development mode
cd frontend
npm install
npm run dev
```

### Building for Production

```bash
# Build frontend for production
cd frontend
npm run build

# Build and run with Docker
docker-compose up --build -d
```

## 🔒 Security Features

- **Password Hashing**: All passwords are hashed using BCrypt
- **Input Validation**: Server-side validation for all inputs
- **CORS Configuration**: Proper CORS setup for cross-origin requests
- **SQL Injection Protection**: Using JPA/Hibernate with parameterized queries
- **XSS Protection**: Input sanitization and proper content types

