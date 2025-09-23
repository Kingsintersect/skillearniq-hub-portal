interface HttpError extends Error {
    status?: number;
    data?: unknown;
}

export const fetchWithErrorHandling = async (url: string, options = {}) => {
    const response = await fetch(url, options);

    if (!response.ok) {
        const error = new Error(`HTTP ${response.status}`) as HttpError;
        error.status = response.status;
        try {
            error.data = await response.json();
        } catch {
            error.data = await response.text();
        }
        throw error;
    }

    return response.json();
};
// Usage
// const verifyToken = async () => {
//     try {
//         const data = await fetchWithErrorHandling(`/api/auth/verify-token?token=${token}`);
//         setIsTokenValid(data.valid);
//         alert(data.valid);
//     } catch (error) {
//         console.log('error', error);
//         setIsTokenValid(false);
//     }
// };