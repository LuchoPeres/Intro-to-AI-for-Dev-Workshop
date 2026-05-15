# Design: Task Management Feature

## Data Model

### Task Interface
```typescript
interface Task {
  id: number;                          // Unique identifier (auto-incremented)
  title: string;                       // Task title, max 100 characters, required
  description?: string;                // Optional description, max 500 characters
  status: 'todo' | 'in-progress' | 'done';  // Task status
  priority: 'low' | 'medium' | 'high';     // Task priority
  createdAt: string;                   // ISO 8601 timestamp
  updatedAt: string;                   // ISO 8601 timestamp
}
```

### Storage
- In-memory array in backend for task persistence
- Auto-incrementing ID counter starting from 1
- Data resets on server restart (acceptable for workshop)

## Backend API Design

### Endpoints
Base URL: `http://localhost:3001/api`

| Method | Path            | Description                      | Request Body                          | Response                          |
|--------|-----------------|----------------------------------|---------------------------------------|-----------------------------------|
| GET    | /tasks          | List all tasks                   | Query params: `status`, `priority`    | `Task[]`                          |
| GET    | /tasks/:id      | Get single task by ID            | -                                     | `Task`                            |
| POST   | /tasks          | Create new task                  | `{ title, description?, priority? }` | `Task` (with generated fields)    |
| PUT    | /tasks/:id      | Full update of task              | `{ title, description?, status, priority }` | `Task`                            |
| PATCH  | /tasks/:id      | Partial update of task           | Partial `Task` object                 | `Task`                            |
| DELETE | /tasks/:id      | Delete task by ID                | -                                     | `204 No Content`                  |

### Validation Rules
- **title**: Required, string, 1-100 characters
- **description**: Optional, string, max 500 characters
- **status**: Required, one of: 'todo', 'in-progress', 'done'
- **priority**: Required, one of: 'low', 'medium', 'high'
- **createdAt/updatedAt**: Auto-generated, ISO 8601 format

### Error Responses
- `400 Bad Request`: Invalid input data with validation details
- `404 Not Found`: Task ID does not exist
- `500 Internal Server Error`: Unexpected server errors

### Route Handler Structure
- Route registration in `backend/src/routes/api.ts`
- Task-specific routes in `backend/src/routes/tasks.ts`
- Repository pattern for data access in `backend/src/repositories/taskRepository.ts`
- Type definitions in `backend/src/types/task.ts`

## Frontend Design

### Component Structure
```
frontend/src/components/
├── TaskList.tsx          # Display list of tasks with filters
├── TaskItem.tsx          # Single task display with actions
├── TaskForm.tsx          # Create/edit task form with validation
└── TaskFilter.tsx        # Filter controls (status, priority)
```

### Service Layer
- API client in `frontend/src/services/api.ts` (extend existing)
- Task-specific API functions in `frontend/src/services/taskService.ts`
- Shared types in `frontend/src/types/task.ts`

### Component Responsibilities

**TaskList.tsx**
- Fetch and display tasks
- Apply status/priority filters
- Handle task deletion
- Show loading/error states

**TaskItem.tsx**
- Display single task details
- Provide edit/delete actions
- Show status and priority badges

**TaskForm.tsx**
- Form for creating/editing tasks
- Client-side validation matching backend rules
- Display validation errors
- Handle submit with loading state

**TaskFilter.tsx**
- Dropdowns for status and priority filtering
- Update filter state in parent component

### State Management
- React hooks (useState, useEffect) for local component state
- No global state management needed for workshop scope
- Props drilling acceptable for this feature size

### Styling
- TailwindCSS for all styling
- Consistent color scheme for status (todo: gray, in-progress: blue, done: green)
- Priority indicators (low: green, medium: yellow, high: red)
- Responsive design for mobile/desktop

## Testing Strategy

### Backend Tests
- Unit tests for repository layer (CRUD operations)
- Integration tests for API endpoints using Supertest
- Test coverage: validation, error handling, edge cases
- Location: `backend/src/__tests__/`

### Frontend Tests
- Component tests using React Testing Library
- Service layer tests for API calls (mocked)
- Form validation tests
- Location: `frontend/src/__tests__/`

### Test Scenarios
- Create task with valid/invalid data
- Update task (full and partial)
- Delete existing/non-existent task
- Filter tasks by status and priority
- Form validation error display
- Loading and error states

## Implementation Notes

### Repository Pattern
The backend will use a repository pattern to separate data access logic from route handlers:
- `TaskRepository` class with methods: `findAll`, `findById`, `create`, `update`, `delete`
- In-memory storage encapsulated in repository
- Makes testing easier and follows workshop learning objectives

### Code Smells for Refactoring
The initial `backend/src/routes/tasks.ts` will intentionally contain code smells (marked with TODO comments) to provide refactoring exercises during the workshop:
- Inline validation logic
- Direct array manipulation
- Missing error handling
- Lack of separation of concerns

Participants will identify and fix these as part of the learning experience.
