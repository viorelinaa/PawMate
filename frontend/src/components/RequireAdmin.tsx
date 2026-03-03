import { type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { paths } from "../routes/paths";

interface RequireAdminProps {
    children: ReactNode;
}

export function RequireAdmin({ children }: RequireAdminProps) {
    const { currentUser } = useAuth();
    const location = useLocation();

    if (!currentUser) {
        return (
            <Navigate
                to={paths.unauthorized}
                replace
                state={{ from: location.pathname }}
            />
        );
    }

    if (currentUser.role !== "admin") {
        return (
            <Navigate
                to={paths.forbidden}
                replace
                state={{ from: location.pathname }}
            />
        );
    }

    return <>{children}</>;
}
