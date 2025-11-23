export interface Category {
    id: number;
    name: string;
    parent: number;
    sortorder: number;
    children?: Category[];
}

export interface ApiResponse {
    current_page: number;
    data: Category[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}

export interface CategoryStore {
    categories: Category[];
    categoryTree: Category[];
    parentCategories: Category[];
    isLoading: boolean;
    error: string | null;
    fetchCategories: () => Promise<void>;
    getChildren: (parentId: number) => Category[];
    getCategoryById: (id: number) => Category | undefined;
    getAllDescendants: (parentId: number) => Category[];
    clearCategories: () => void;
}