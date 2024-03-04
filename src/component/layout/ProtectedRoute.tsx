import { ReactNode } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { TUser, logout, useCurrentToken } from "../../redux/features/auth/authSlice";
import { Navigate } from "react-router-dom";
import { decodeJwtToken } from "../../utils/verifyJwtToken";

type TProtectedRouteProps = {
    children: ReactNode;
    role: string | undefined;
}
const ProtectedRoute = ({ children, role }: TProtectedRouteProps) => {

    const token = useAppSelector(useCurrentToken)
    const dispatch = useAppDispatch()
    let user;

    if (token) {
        user = decodeJwtToken(token) as TUser
    }

    if (role !== undefined && role !== user?.role) {
        dispatch(logout());
        return <Navigate to="/login" replace={true} />;
    }

    if (!token) {
        return <Navigate to={'/login'} replace />
    }
    return children;
};

export default ProtectedRoute;