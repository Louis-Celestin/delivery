import { Navigate, useLocation } from "react-router";

const ProtectedRoutes = ({ children }) => {
    const location = useLocation();
    const token = localStorage.getItem('token');
    // const tokenAdmin = 'tokenn';
    return token ? (
        children ) : (
        <Navigate to="/signin" state={{ from: location }} replace />
    )
};

export default ProtectedRoutes;