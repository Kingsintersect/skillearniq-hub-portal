import axios, {
    AxiosError,
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
    InternalAxiosRequestConfig
} from "axios";
import { ApiError, ApiResponse } from "@/types/auth";
import { APP_CONFIG, LOCAL_STORAGE_KEYS } from "@/config";

// Extend the InternalAxiosRequestConfig to include _retry property
interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

// Define the structure for refresh token response
interface RefreshTokenResponse {
    accessToken: string;
    refreshToken: string;
}

// Define the structure for API error response
interface ApiErrorResponse {
    message?: string;
    errors?: Record<string, string[]>;
    success?: boolean;
}

// Queue item interface for failed requests
interface QueueItem {
    resolve: (value: string) => void;  // We'll pass the new access token
    reject: (reason: unknown) => void;
}

class ApiClient {
    private instance: AxiosInstance;
    private isRefreshing = false;
    private failedQueue: QueueItem[] = [];

    constructor() {
        this.instance = axios.create({
            baseURL: APP_CONFIG.apiUrl,
            timeout: 30000,
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        });

        this.setupInterceptors();
    }

    private setupInterceptors(): void {
        // Request interceptor
        this.instance.interceptors.request.use(
            (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
                if (typeof window !== "undefined") {
                    const token = localStorage.getItem(LOCAL_STORAGE_KEYS.accessToken);
                    if (token && config.headers) {
                        config.headers.Authorization = `Bearer ${token}`;
                    }
                }
                return config;
            },
            (error: unknown) => Promise.reject(error)
        );

        // Response interceptor
        this.instance.interceptors.response.use(
            (response: AxiosResponse<ApiResponse>) => response,
            async (error: unknown) => {
                const axiosError = error as AxiosError<ApiErrorResponse>;
                const originalRequest = axiosError.config as ExtendedAxiosRequestConfig;

                // Handle 401 unauthorized errors with token refresh
                if (axiosError.response?.status === 401 && originalRequest && !originalRequest._retry) {
                    if (this.isRefreshing) {
                        return new Promise<AxiosResponse>((resolve, reject) => {
                            this.failedQueue.push({
                                resolve: () => resolve(this.instance(originalRequest)),
                                reject: (error) => reject(error)
                            });
                        });
                    }

                    originalRequest._retry = true;
                    this.isRefreshing = true;

                    try {
                        const refreshToken = localStorage.getItem(LOCAL_STORAGE_KEYS.refreshToken);
                        if (refreshToken) {
                            // Use the instance directly to avoid circular dependency during refresh
                            const refreshResponse = await this.instance.post<ApiResponse<RefreshTokenResponse>>(
                                "/auth/refresh",
                                { refreshToken }
                            );

                            if (refreshResponse.data.status && refreshResponse.data.data) {
                                const { accessToken, refreshToken: newRefreshToken } = refreshResponse.data.data;
                                localStorage.setItem(LOCAL_STORAGE_KEYS.accessToken, accessToken);
                                localStorage.setItem(LOCAL_STORAGE_KEYS.refreshToken, newRefreshToken);

                                this.processQueue(null);
                                return this.instance(originalRequest);
                            } else {
                                throw new Error("Failed to refresh token");
                            }
                        } else {
                            throw new Error("No refresh token available");
                        }
                    } catch (refreshError) {
                        this.processQueue(refreshError);
                        this.clearAuthTokens();
                        if (typeof window !== "undefined") {
                            window.location.href = "/auth/signin";
                        }
                        return Promise.reject(refreshError);
                    } finally {
                        this.isRefreshing = false;
                    }
                }

                return Promise.reject(this.handleError(error));
            }
        );
    }

    private processQueue(error: unknown): void {
        this.failedQueue.forEach(({ resolve, reject }) => {
            if (error) {
                reject(error);
            } else {
                resolve(""); // Signal success, the actual retry happens in the resolve function
            }
        });

        this.failedQueue = [];
    }

    private handleError(error: unknown): ApiError {
        // Handle Axios errors
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError<ApiErrorResponse>;

            // Server responded with error status
            if (axiosError.response) {
                return {
                    message: axiosError.response.data?.message || `HTTP ${axiosError.response.status}: ${axiosError.response.statusText}`,
                    errors: axiosError.response.data?.errors,
                    statusCode: axiosError.response.status,
                };
            }

            // Network error (no response received)
            if (axiosError.request) {
                return {
                    message: "Network error. Please check your internet connection.",
                    statusCode: 0,
                };
            }
        }

        // Handle other Error instances
        if (error instanceof Error) {
            return {
                message: error.message,
                statusCode: 500,
            };
        }

        // Handle unknown error types
        return {
            message: "An unexpected error occurred",
            statusCode: 500,
        };
    }

    private clearAuthTokens(): void {
        if (typeof window !== "undefined") {
            localStorage.removeItem(LOCAL_STORAGE_KEYS.accessToken);
            localStorage.removeItem(LOCAL_STORAGE_KEYS.refreshToken);
            localStorage.removeItem(LOCAL_STORAGE_KEYS.user);
        }
    }

    async get<T = unknown>(
        url: string,
        config?: AxiosRequestConfig
    ): Promise<ApiResponse<T>> {
        const response = await this.instance.get<ApiResponse<T>>(url, config);
        return response.data;
    }

    async post<T = unknown>(
        url: string,
        data?: unknown,
        config?: AxiosRequestConfig
    ): Promise<ApiResponse<T>> {
        const response = await this.instance.post<ApiResponse<T>>(url, data, config);
        return response.data;
    }

    async put<T = unknown>(
        url: string,
        data?: unknown,
        config?: AxiosRequestConfig
    ): Promise<ApiResponse<T>> {
        const response = await this.instance.put<ApiResponse<T>>(url, data, config);
        return response.data;
    }

    async patch<T = unknown>(
        url: string,
        data?: unknown,
        config?: AxiosRequestConfig
    ): Promise<ApiResponse<T>> {
        const response = await this.instance.patch<ApiResponse<T>>(url, data, config);
        return response.data;
    }

    async delete<T = unknown>(
        url: string,
        config?: AxiosRequestConfig
    ): Promise<ApiResponse<T>> {
        const response = await this.instance.delete<ApiResponse<T>>(url, config);
        return response.data;
    }

    // Additional utility methods for common scenarios

    /**
     * Upload files with proper content type handling
     */
    async upload<T = unknown>(
        url: string,
        formData: FormData,
        config?: AxiosRequestConfig
    ): Promise<ApiResponse<T>> {
        const uploadConfig: AxiosRequestConfig = {
            ...config,
            headers: {
                ...config?.headers,
                'Content-Type': 'multipart/form-data',
            },
        };

        const response = await this.instance.post<ApiResponse<T>>(url, formData, uploadConfig);
        return response.data;
    }

    /**
     * Download files with proper response type handling
     */
    async download(
        url: string,
        config?: AxiosRequestConfig
    ): Promise<Blob> {
        const downloadConfig: AxiosRequestConfig = {
            ...config,
            responseType: 'blob',
        };

        const response = await this.instance.get<Blob>(url, downloadConfig);
        return response.data;
    }

    /**
     * Get current authentication status
     */
    isAuthenticated(): boolean {
        if (typeof window === "undefined") return false;

        const token = localStorage.getItem(LOCAL_STORAGE_KEYS.accessToken);
        const refreshToken = localStorage.getItem(LOCAL_STORAGE_KEYS.refreshToken);

        return !!(token && refreshToken);
    }

    /**
     * Manually clear authentication and redirect
     */
    logout(): void {
        this.clearAuthTokens();
        if (typeof window !== "undefined") {
            window.location.href = "/auth/signin";
        }
    }
}

export const apiClient = new ApiClient();
