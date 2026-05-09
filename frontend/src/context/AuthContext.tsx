import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { apiBaseUrl } from "../axios/apiClient";
import { loginUser, logoutUser, markSessionActive, type AuthRole } from "../services/authService";

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
const sessionHeartbeatMs = 60_000;

function clearStoredUser() {
    sessionStorage.removeItem("pawmate_token");
    sessionStorage.removeItem("pawmate_uid");
    sessionStorage.removeItem("pawmate_role");
    sessionStorage.removeItem("pawmate_name");
    sessionStorage.removeItem("pawmate_email");
}

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

    useEffect(() => {
        if (!currentUser) {
            return;
        }

        let isCancelled = false;
        const userId = currentUser.id;

        void markSessionActive(userId).catch(() => {
            clearStoredUser();
            if (!isCancelled) {
                setCurrentUser(null);
            }
        });

        let hasMarkedOffline = false;
        const heartbeatId = window.setInterval(() => {
            void markSessionActive(userId).catch(() => {});
        }, sessionHeartbeatMs);

        function markOfflineOnPageExit() {
            if (hasMarkedOffline) {
                return;
            }

            hasMarkedOffline = true;
            const url = `${apiBaseUrl}/session/offline/${userId}`;
            const token = sessionStorage.getItem("pawmate_token");

            if (!token) {
                return;
            }

            void fetch(url, {
                method: "POST",
                keepalive: true,
                credentials: "include",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        }

        window.addEventListener("pagehide", markOfflineOnPageExit);
        window.addEventListener("beforeunload", markOfflineOnPageExit);

        return () => {
            isCancelled = true;
            window.clearInterval(heartbeatId);
            window.removeEventListener("pagehide", markOfflineOnPageExit);
            window.removeEventListener("beforeunload", markOfflineOnPageExit);
        };
    }, [currentUser?.id]);

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
        const userId = currentUser?.id ?? Number(sessionStorage.getItem("pawmate_uid"));

        if (Number.isFinite(userId) && userId > 0) {
            const token = sessionStorage.getItem("pawmate_token") ?? undefined;
            void logoutUser(userId, token).catch(() => {});
        }

        clearStoredUser();
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
