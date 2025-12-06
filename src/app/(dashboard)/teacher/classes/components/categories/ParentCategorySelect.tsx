'use client';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useCategories } from '../../hooks/use-categories';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const ParentCategorySelect = () => {
    const {
        parentCategories,
        selectedParentId,
        selectParentCategory,
        isLoading,
        error,
    } = useCategories();

    if (error) {
        return (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        );
    }

    if (isLoading) {
        return (
            <div className="space-y-2">
                <label className="text-sm font-medium">Select Course Category</label>
                <Skeleton className="h-10 w-full" />
            </div>
        );
    }

    if (!parentCategories || parentCategories.length === 0) {
        return (
            <div className="space-y-2">
                <label className="text-sm font-medium">Select Course Category</label>
                <div className="p-3 border rounded-md bg-muted/50">
                    <p className="text-sm">No Course categories available</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            <label className="text-sm font-medium">Select Course Category</label>
            <Select
                value={selectedParentId?.toString() || "none"} // Changed from empty string
                onValueChange={(value) => {
                    if (value === "none") {
                        selectParentCategory(null);
                    } else {
                        selectParentCategory(parseInt(value));
                    }
                }}
            >
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose an Course category" />
                </SelectTrigger>
                <SelectContent>
                    {/* Use "none" instead of empty string */}
                    <SelectItem value="none">None</SelectItem>
                    {parentCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                            <div className="flex items-center justify-between w-full">
                                <span>{category.name}</span>
                                {category.children && category.children.length > 0 && (
                                    <Badge variant="outline" className="ml-2 text-xs">
                                        {category.children.length} streams
                                    </Badge>
                                )}
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
                {parentCategories.length} Course categories available
            </p>
        </div>
    );
};