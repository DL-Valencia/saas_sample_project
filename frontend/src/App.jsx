import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import DashboardLayout from './layouts/DashboardLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Applications from './pages/Applications';
import UserManagement from './pages/UserManagement';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="applications" element={<Applications />} />
            <Route path="users" element={
              <PrivateRoute roles={['Admin', 'SuperAdmin']}>
                <UserManagement />
              </PrivateRoute>
            } />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
