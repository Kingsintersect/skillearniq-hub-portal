export interface LoadingState {
    isLoading: boolean;
    progress: number;
}

export interface NavigationConfig {
    showSpinner: boolean;
    showProgressBar: boolean;
    spinnerPosition: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
    progressBarHeight: 'thin' | 'medium' | 'thick';
    colors: {
        spinner?: string;
        progressBar: string;
    };
}