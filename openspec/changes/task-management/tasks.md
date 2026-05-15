# Implementation Tasks: Task Management Feature

## Task Breakdown

Estimated total implementation time: 2-4 hours

### Phase 1: Backend Foundation (45-60 minutes)

#### Task 1.1: Define Task Type
- Create `backend/src/types/task.ts` with Task interface
- Export the interface for use across the codebase
- **Time**: 5 minutes
- **Files**: `backend/src/types/task.ts`

#### Task 1.2: Implement Task Repository
- Create `backend/src/repositories/taskRepository.ts`
- Implement TaskRepository class with in-memory storage
- Methods: `findAll`, `findById`, `create`, `update`, `delete`
- Auto-incrementing ID generation
- **Time**: 20 minutes
- **Files**: `backend/src/repositories/taskRepository.ts`

#### Task 1.3: Create Task Routes with Code Smells
- Create `backend/src/routes/tasks.ts` with intentional code smells
- Implement all CRUD endpoints (GET /tasks, GET /tasks/:id, POST /tasks, PUT /tasks/:id, PATCH /tasks/:id, DELETE /tasks/:id)
- Add TODO comments marking code smells for later refactoring
- Inline validation logic, direct array manipulation, missing error handling
- **Time**: 25 minutes
- **Files**: `backend/src/routes/tasks.ts`

#### Task 1.4: Register Task Routes
- Update `backend/src/routes/api.ts` to register task routes
- Mount at `/api/tasks`
- **Time**: 5 minutes
- **Files**: `backend/src/routes/api.ts`

#### Task 1.5: Add Backend Unit Tests
- Create `backend/src/__tests__/taskRepository.test.ts`
- Test all repository methods with various scenarios
- Create `backend/src/__tests__/tasks.test.ts` using Supertest
- Test all API endpoints with valid/invalid data
- **Time**: 30 minutes
- **Files**: `backend/src/__tests__/taskRepository.test.ts`, `backend/src/__tests__/tasks.test.ts`

### Phase 2: Frontend Foundation (30-45 minutes)

#### Task 2.1: Define Frontend Task Type
- Create `frontend/src/types/task.ts` with Task interface
- Match backend type definition
- **Time**: 5 minutes
- **Files**: `frontend/src/types/task.ts`

#### Task 2.2: Extend API Service
- Update `frontend/src/services/api.ts` to include task endpoints
- Ensure base URL constant is used
- **Time**: 10 minutes
- **Files**: `frontend/src/services/api.ts`

#### Task 2.3: Create Task Service
- Create `frontend/src/services/taskService.ts`
- Implement functions: `getTasks`, `getTaskById`, `createTask`, `updateTask`, `deleteTask`
- Handle API errors appropriately
- **Time**: 15 minutes
- **Files**: `frontend/src/services/taskService.ts`

#### Task 2.4: Add Frontend Service Tests
- Create `frontend/src/__tests__/taskService.test.ts`
- Mock API calls and test all service functions
- Test error handling scenarios
- **Time**: 15 minutes
- **Files**: `frontend/src/__tests__/taskService.test.ts`

### Phase 3: Frontend Components (60-90 minutes)

#### Task 3.1: Create TaskForm Component
- Create `frontend/src/components/TaskForm.tsx`
- Form fields: title (required), description (optional), priority (dropdown)
- Client-side validation matching backend rules
- Display validation errors clearly
- Handle both create and edit modes
- **Time**: 30 minutes
- **Files**: `frontend/src/components/TaskForm.tsx`

#### Task 3.2: Create TaskItem Component
- Create `frontend/src/components/TaskItem.tsx`
- Display task title, description, status, priority
- Add edit and delete buttons
- Style status and priority with appropriate colors
- **Time**: 20 minutes
- **Files**: `frontend/src/components/TaskItem.tsx`

#### Task 3.3: Create TaskFilter Component
- Create `frontend/src/components/TaskFilter.tsx`
- Dropdowns for status filter and priority filter
- Emit filter changes to parent component
- **Time**: 15 minutes
- **Files**: `frontend/src/components/TaskFilter.tsx`

#### Task 3.4: Create TaskList Component
- Create `frontend/src/components/TaskList.tsx`
- Fetch and display tasks
- Integrate TaskFilter for filtering
- Render TaskItem components
- Add "Create Task" button that opens TaskForm
- Handle loading and error states
- **Time**: 25 minutes
- **Files**: `frontend/src/components/TaskList.tsx`

#### Task 3.5: Integrate into App
- Update `frontend/src/App.tsx` to render TaskList
- Ensure proper routing or component mounting
- **Time**: 10 minutes
- **Files**: `frontend/src/App.tsx`

#### Task 3.6: Add Frontend Component Tests
- Create `frontend/src/__tests__/TaskForm.test.ts`
- Create `frontend/src/__tests__/TaskList.test.ts`
- Test form validation, user interactions, and rendering
- **Time**: 30 minutes
- **Files**: `frontend/src/__tests__/TaskForm.test.ts`, `frontend/src/__tests__/TaskList.test.ts`

### Phase 4: Refactoring & Polish (30-45 minutes)

#### Task 4.1: Refactor Backend Routes
- Address code smells in `backend/src/routes/tasks.ts`
- Extract validation logic to separate functions
- Improve error handling
- Better separation of concerns
- **Time**: 20 minutes
- **Files**: `backend/src/routes/tasks.ts`

#### Task 4.2: Run All Tests
- Run `npm test` to verify all tests pass
- Fix any failing tests
- Ensure adequate test coverage
- **Time**: 10 minutes

#### Task 4.3: Lint and Format
- Run `npm run lint` and fix any linting issues
- Run `npm run format` to ensure consistent formatting
- **Time**: 5 minutes

#### Task 4.4: Manual Testing
- Start both frontend and backend servers
- Test the full user flow manually
- Verify all CRUD operations work
- Check form validation and error messages
- **Time**: 10 minutes

## Implementation Order

The tasks are ordered to allow incremental progress:
1. Backend foundation first (enables API testing)
2. Frontend service layer (enables frontend development)
3. Frontend components (builds on service layer)
4. Refactoring and polish (improves code quality)

## Workshop Pacing

For a 2-hour workshop:
- Focus on Tasks 1.1-1.4, 2.1-2.3, 3.1-3.4 (core functionality)
- Skip or simplify tests (1.5, 2.4, 3.6)
- Brief refactoring (4.1) if time permits

For a 4-hour workshop:
- Complete all tasks as outlined
- Spend extra time on refactoring exercise (4.1)
- Allow time for participants to explore and customize

## Success Criteria

- All API endpoints return correct responses
- Frontend components display and manipulate tasks correctly
- Form validation prevents invalid data with helpful errors
- Unit tests pass with meaningful coverage
- Code passes linting and formatting checks
- Manual testing confirms the feature works end-to-end
