import { Routes, Route } from 'react-router-dom';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import PrivateRoute from './components/auth/PrivateRoute';
import AllTasks from './components/tasks/AllTasks';
import Settings from './components/dashboard/Settings';
import TaskCategories from './components/tasks/TaskCategories';
import MainLayout from './components/layout/MainLayout';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/*"
        element={
          <PrivateRoute>
            <MainLayout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/all-tasks" element={<AllTasks />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/categories" element={<TaskCategories />} />
              </Routes>
            </MainLayout>
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App; 