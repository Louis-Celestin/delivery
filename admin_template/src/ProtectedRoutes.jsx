import { Navigate } from "react-router";

const ProtectedRoutes = ({ children }) => {
    const token = window.sessionStorage.getItem('token');
    return token ? children : <Navigate to="/signin" />
};

export default ProtectedRoutes;