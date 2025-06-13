import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Provider } from 'react-redux';
import { store } from './store/store';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import PrivateRoute from './components/auth/PrivateRoute';
import AllTasks from './components/tasks/AllTasks';
import Settings from './components/dashboard/Settings';
import TaskCategories from './components/tasks/TaskCategories';
import MainLayout from './components/layout/MainLayout';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function App() {
  return (
    <Provider store={store}>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/"
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
        </Router>
      </GoogleOAuthProvider>
    </Provider>
  );
}

export default App; 