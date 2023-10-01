import React from 'react';
import { Navigate, Route } from 'react-router-dom';
import { getToken } from './pages/Project/UserManagement/Session';
import { getUser } from './pages/Project/UserManagement/Session';

const PrivateRoute = ({ component: Component, requiredRole, ...rest }) => {
  const user = getToken();
  
  // Check if the user is logged in
  if (user) {
    // Check if the user has the required role

    if (user.result.type == requiredRole || requiredRole == "all") {
      return <Component />;
    } else {
      // Redirect to a 404 page or another appropriate page for unauthorized access
      return <Navigate to="/404" />;
    }
  } else {
    // Redirect to the login page if the user is not logged in
    return getUser() ? <Component /> : <Navigate to={{ pathname: '/login' }} />;
  }
};

export default PrivateRoute;

