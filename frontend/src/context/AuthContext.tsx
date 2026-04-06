import { createContext, useContext, useState, type ReactNode } from "react";
import { loginUser, type AuthRole } from "../services/authService";

type AuthUser = {
    id: number;
    name: string;
    email: string;
    role: AuthRole;
};

type AuthContextType = {
    currentUser: AuthUser | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<AuthRole>;
    logout: () => void;
    isAdmin: () => boolean;
    updateProfileBasics: (name: string, email: string) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function readStoredUser(): AuthUser | null {
    const id = sessionStorage.getItem("pawmate_uid");
    const name = sessionStorage.getItem("pawmate_name");
    const email = sessionStorage.getItem("pawmate_email");
    const role = sessionStorage.getItem("pawmate_role");

    if (!id || !name || !email || !role) {
        return null;
    }

    return {
        id: Number(id),
        name,
        email,
        role: role === "admin" ? "admin" : "user",
    };
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => readStoredUser());

    async function login(email: string, password: string): Promise<AuthRole> {
        const response = await loginUser({ email, password });

        sessionStorage.setItem("pawmate_token", response.token);
        sessionStorage.setItem("pawmate_uid", String(response.userId));
        sessionStorage.setItem("pawmate_role", response.role);
        sessionStorage.setItem("pawmate_name", response.name);
        sessionStorage.setItem("pawmate_email", response.email);

        const user: AuthUser = {
            id: response.userId,
            name: response.name,
            email: response.email,
            role: response.role,
        };

        setCurrentUser(user);
        return user.role;
    }

    function logout() {
        sessionStorage.removeItem("pawmate_token");
        sessionStorage.removeItem("pawmate_uid");
        sessionStorage.removeItem("pawmate_role");
        sessionStorage.removeItem("pawmate_name");
        sessionStorage.removeItem("pawmate_email");
        setCurrentUser(null);
    }

    function isAdmin() {
        return currentUser?.role === "admin";
    }

    function updateProfileBasics(name: string, email: string) {
        sessionStorage.setItem("pawmate_name", name);
        sessionStorage.setItem("pawmate_email", email);

        setCurrentUser((prev) =>
            prev
                ? {
                      ...prev,
                      name,
                      email,
                  }
                : prev
        );
    }

    return (
        <AuthContext.Provider
            value={{
                currentUser,
                isAuthenticated: currentUser !== null,
                login,
                logout,
                isAdmin,
                updateProfileBasics,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider");
    }

    return context;
}
