import { createContext, useEffect, useEffectEvent, useRef, useState, type ReactNode } from "react";
import type { AxiosInstance } from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { apiClient } from "./apiClient";
import { paths } from "../routes/paths";

interface ApiContextType {
    api: AxiosInstance;
    isCheckingHealth: boolean;
    isBackendAvailable: boolean;
    checkBackendHealth: () => Promise<boolean>;
}

export const ApiContext = createContext<ApiContextType | null>(null);

interface HealthResponse {
    status: string;
    service: string;
    timestamp: string;
}

export function ApiProvider({ children }: { children: ReactNode }) {
    const navigate = useNavigate();
    const location = useLocation();
    const hasBootstrappedRef = useRef(false);
    const [isCheckingHealth, setIsCheckingHealth] = useState(true);
    const [isBackendAvailable, setIsBackendAvailable] = useState(false);

    const redirectToServerError = useEffectEvent(() => {
        if (window.location.pathname !== paths.serverError) {
            navigate(paths.serverError, { replace: true });
        }
    });

    const performHealthCheck = useEffectEvent(async () => {
        setIsCheckingHealth(true);

        try {
            await apiClient.get<HealthResponse>("/health");
            setIsBackendAvailable(true);
            return true;
        } catch {
            setIsBackendAvailable(false);
            redirectToServerError();
            return false;
        } finally {
            setIsCheckingHealth(false);
        }
    });

    const checkBackendHealth = async () => performHealthCheck();

    useEffect(() => {
        const requestInterceptor = apiClient.interceptors.request.use((config) => {
            const token = sessionStorage.getItem("pawmate_token");
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }

            return config;
        });

        const responseInterceptor = apiClient.interceptors.response.use(
            (response) => response,
            (error) => {
                const status = error.response?.status;

                if (!error.response || status >= 500) {
                    setIsBackendAvailable(false);
                    redirectToServerError();
                }

                return Promise.reject(error);
            }
        );

        return () => {
            apiClient.interceptors.request.eject(requestInterceptor);
            apiClient.interceptors.response.eject(responseInterceptor);
        };
    }, [location.pathname]);

    useEffect(() => {
        if (hasBootstrappedRef.current) return;
        hasBootstrappedRef.current = true;

        void performHealthCheck();
    }, []);

    const shouldBlockRender = isCheckingHealth && location.pathname !== paths.serverError;

    return (
        <ApiContext.Provider
            value={{
                api: apiClient,
                isCheckingHealth,
                isBackendAvailable,
                checkBackendHealth,
            }}
        >
            {shouldBlockRender ? (
                <div className="appBoot">
                    <div className="appBootCard">
                        <p className="appBootLabel">Se verifică conexiunea cu backend-ul...</p>
                    </div>
                </div>
            ) : (
                children
            )}
        </ApiContext.Provider>
    );
}
