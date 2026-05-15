import TaskList from './components/TaskList';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <TaskList />
      </div>
    </ErrorBoundary>
  );
}

export default App;
