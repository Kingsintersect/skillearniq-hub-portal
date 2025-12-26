// core/client.ts (or wherever your apiClient.ts file is)
import axios, {
    AxiosError,
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
    InternalAxiosRequestConfig
} from "axios";
import { ApiError, ApiResponse } from "@/types/auth";
import { APP_CONFIG, LOCAL_STORAGE_KEYS } from "@/config";

// Define the structure for API error response
interface ApiErrorResponse {
    message?: string;
    errors?: Record<string, string[]>;
    success?: boolean;
    error?: string;
}

// Queue item interface for failed requests
interface QueueItem {
    resolve: (value: string) => void;
    reject: (reason: unknown) => void;
}

class ApiClient {
    private instance: AxiosInstance;
    private isRefreshing = false;
    private failedQueue: QueueItem[] = [];
    private externalToken: string | null = null;

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

    setExternalToken(token: string | null): void {
        this.externalToken = token;
    }

    private setupInterceptors(): void {
        // Request interceptor
        this.instance.interceptors.request.use(
            (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
                let token = this.externalToken || (typeof window !== "undefined" ? localStorage.getItem(LOCAL_STORAGE_KEYS.accessToken) : null);

                if (token) {
                    token = token.replace(/^"(.*)"$/, '$1'); // Remove surrounding quotes
                    token = token.trim(); // Remove any extra spaces
                }
                if (token && config.headers) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error: unknown) => Promise.reject(error)
        );

        // Response interceptor - FIXED VERSION
        this.instance.interceptors.response.use(
            (response: AxiosResponse) => {
                // Handle 204 No Content responses - THE FIX FOR YOUR ISSUE
                if (response.status === 204) {
                    return {
                        ...response,
                        data: {
                            status: 200,
                            message: 'No content',
                            data: []
                        }
                    };
                }
                
                // Handle different response structures
                const responseData = response.data;
                
                // If it's already in ApiResponse format, return as is
                if (responseData && typeof responseData === 'object' && 'status' in responseData) {
                    return response;
                }
                
                // If response is an array (like categories data from /odl/categories)
                if (Array.isArray(responseData)) {
                    response.data = {
                        status: 200,
                        message: 'Success',
                        data: responseData
                    };
                    return response;
                }
                
                // If response is an object with data property
                if (responseData && typeof responseData === 'object' && 'data' in responseData) {
                    // Already formatted correctly
                    return response;
                }
                
                // For any other response structure, wrap it
                response.data = {
                    status: 200,
                    message: 'Success',
                    data: responseData || null
                };
                
                return response;
            },
            async (error: unknown) => {
                const axiosError = error as AxiosError<ApiErrorResponse>;

                if (axiosError.response?.status === 401) {
                    this.clearAuthTokens();
                    if (typeof window !== "undefined") {
                        window.location.href = "/auth/signin";
                    }
                    return Promise.reject(this.handleError(error));
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
                resolve("");
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
                const responseData = axiosError.response.data;
                return {
                    message: responseData?.message || 
                             responseData?.error || 
                             `HTTP ${axiosError.response.status}: ${axiosError.response.statusText}`,
                    errors: responseData?.errors,
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
            localStorage.removeItem(LOCAL_STORAGE_KEYS.user);
        }
    }

    // API CALL SIMULATION
    async simulate<T = unknown>(ms: number): Promise<ApiResponse<T>> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    status: 200,
                    message: 'API request completed after 30 seconds',
                    data: { authorizationUrl: "https://google.com" } as T,
                });
            }, ms);
        });
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
        return !!(token);
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