import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("token"); // Example authentication check

  return isAuthenticated ? <Navigate to="/admin" replace /> : children;
};

export default ProtectedRoute;