'use client';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useCategories } from '../../hooks/use-categories';

export const SubcategorySelect = () => {
    const {
        subCategories,
        selectedParentId,
        selectedParentHasChildren,
        selectedSubcategoryId,
        selectSubcategory,
        isCoursesLoading,
    } = useCategories();

    if (!selectedParentId) {
        return (
            <div className="space-y-2">
                <label className="text-sm font-medium">Select Study Stream</label>
                <Select disabled>
                    <SelectTrigger>
                        <SelectValue placeholder="Select an exam category first" />
                    </SelectTrigger>
                </Select>
                <p className="text-xs text-muted-foreground">
                    Please select an exam category first
                </p>
            </div>
        );
    }

    // If selected parent doesn't have children
    if (!selectedParentHasChildren) {
        return (
            <div className="space-y-2">
                <label className="text-sm font-medium">Study Stream</label>
                <div className="p-3 border rounded-md bg-muted/50">
                    <p className="text-sm">
                        This exam category doesn't have separate study streams.
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                        All courses are available directly under this category.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            <label className="text-sm font-medium">Select Study Stream</label>
            <Select
                value={selectedSubcategoryId?.toString() || "none"} // Changed from empty string
                onValueChange={(value) => {
                    if (value === "none") {
                        selectSubcategory(null);
                    } else {
                        selectSubcategory(parseInt(value));
                    }
                }}
                disabled={isCoursesLoading}
            >
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose a study stream" />
                </SelectTrigger>
                <SelectContent>
                    {/* Use "none" instead of empty string */}
                    <SelectItem value="none">All Streams</SelectItem>
                    {subCategories.map((subcategory) => (
                        <SelectItem key={subcategory.id} value={subcategory.id.toString()}>
                            {subcategory.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
                {isCoursesLoading
                    ? 'Loading courses...'
                    : `${subCategories.length} study streams available`
                }
            </p>
        </div>
    );
};