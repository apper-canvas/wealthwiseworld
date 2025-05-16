import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * Component to protect routes that require authentication
 * Redirects to login page if user is not authenticated
 */
const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated, user } = useSelector((state) => state.user);

  if (!isAuthenticated || !user) {
    // Redirect to login with the current path as redirect parameter
    return (
      <Navigate 
        to={`/login?redirect=${location.pathname}`} 
        replace 
      />
    );
  }
  return children;
};
export default ProtectedRoute;