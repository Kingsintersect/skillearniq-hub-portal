// src/components/teachers/TeachersFilters.tsx
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useTeachersPageContext } from './TeachersPageProvider';
import { useDebounce } from '../hooks/useDebounce';

export const TeachersFilters: React.FC = () => {
    const {
        searchTerm,
        setSearchTerm,
        filters,
        setFilters,
        pagination,
        setPagination,
        topLevelCategories,
        getSubcategories,
        findCategoryById,
    } = useTeachersPageContext();

    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [availableSubcategories, setAvailableSubcategories] = useState<any[]>([]);

    // Handle category selection
    const handleCategoryChange = useCallback((value: string) => {
        setSelectedCategory(value);

        if (value === 'all') {
            setAvailableSubcategories([]);
            setFilters((prev: any) => ({ ...prev, category: 'all' }));
        } else {
            const subcategories = getSubcategories(parseInt(value));
            setAvailableSubcategories(subcategories);

            // Set the filter to the category ID (not name)
            if (subcategories.length === 0) {
                setFilters((prev: any) => ({ ...prev, category: value }));
            } else {
                // If has children, set parent category as filter
                setFilters((prev: any) => ({ ...prev, category: value }));
            }
        }
    }, [getSubcategories, setFilters]);

    // Handle subcategory selection
    const handleSubcategoryChange = useCallback((value: string) => {
        if (value === 'parent') {
            setFilters((prev: any) => ({ ...prev, category: selectedCategory }));
        } else {
            setFilters((prev: any) => ({ ...prev, category: value }));
        }
    }, [selectedCategory, setFilters]);

    // Handle items per page change
    const handleItemsPerPageChange = useCallback((value: string) => {
        setPagination({
            currentPage: 1,
            itemsPerPage: parseInt(value),
        });
    }, [setPagination]);

    // Handle status change
    const handleStatusChange = useCallback((value: string) => {
        setFilters((prev: any) => ({ ...prev, status: value }));
    }, [setFilters]);

    // Get the current category name for display
    const getCategoryName = useCallback((id: string) => {
        if (id === 'all') return '';
        const category = findCategoryById(parseInt(id));
        return category?.name || '';
    }, [findCategoryById]);

    return (
        <Card className="mb-6 bg-card border-border">
            <CardContent className="p-6">
                <div className="space-y-4">
                    {/* Search Input - Full Width Row */}
                    <div className="w-full">
                        <Label htmlFor="search" className="sr-only">Search</Label>
                        <Input
                            id="search"
                            placeholder="Search teachers by name, email, or employee number..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-background border-border"
                        />
                    </div>

                    {/* Filter Dropdowns - Responsive Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Category Dropdown */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Category</Label>
                            <Select
                                value={selectedCategory}
                                onValueChange={handleCategoryChange}
                            >
                                <SelectTrigger className="bg-background border-border w-full">
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent className="bg-background border-border">
                                    <SelectItem value="all" className="text-foreground">
                                        All Categories
                                    </SelectItem>
                                    {topLevelCategories.map((category) => (
                                        <SelectItem
                                            key={category.id}
                                            value={category.id.toString()}
                                            className="text-foreground"
                                        >
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Subcategory Dropdown (conditionally shown) */}
                        {availableSubcategories.length > 0 && (
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">Subcategory</Label>
                                <Select
                                    value={filters.category === selectedCategory ? 'parent' : filters.category}
                                    onValueChange={handleSubcategoryChange}
                                >
                                    <SelectTrigger className="bg-background border-border w-full">
                                        <SelectValue placeholder="Select subcategory" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-background border-border">
                                        <SelectItem value="parent" className="text-foreground">
                                            All {getCategoryName(selectedCategory)}
                                        </SelectItem>
                                        {availableSubcategories.map((subcategory) => (
                                            <SelectItem
                                                key={subcategory.id}
                                                value={subcategory.id.toString()}
                                                className="text-foreground"
                                            >
                                                {subcategory.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        {/* Status Dropdown */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Status</Label>
                            <Select
                                value={filters.status}
                                onValueChange={handleStatusChange}
                            >
                                <SelectTrigger className="bg-background border-border w-full">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent className="bg-background border-border">
                                    <SelectItem value="all" className="text-foreground">
                                        All Status
                                    </SelectItem>
                                    <SelectItem value="active" className="text-foreground">
                                        Active
                                    </SelectItem>
                                    <SelectItem value="inactive" className="text-foreground">
                                        Inactive
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Items Per Page */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Show per page</Label>
                            <Select
                                value={pagination.itemsPerPage.toString()}
                                onValueChange={handleItemsPerPageChange}
                            >
                                <SelectTrigger className="bg-background border-border w-full">
                                    <SelectValue placeholder="Show per page" />
                                </SelectTrigger>
                                <SelectContent className="bg-background border-border">
                                    <SelectItem value="5" className="text-foreground">
                                        5 per page
                                    </SelectItem>
                                    <SelectItem value="10" className="text-foreground">
                                        10 per page
                                    </SelectItem>
                                    <SelectItem value="20" className="text-foreground">
                                        20 per page
                                    </SelectItem>
                                    <SelectItem value="50" className="text-foreground">
                                        50 per page
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* Filter summary */}
                <div className="mt-4 text-sm text-muted-foreground flex flex-wrap gap-2 items-center">
                    <span>Active filters:</span>
                    {selectedCategory !== 'all' && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-secondary rounded text-secondary-foreground">
                            Category: {getCategoryName(selectedCategory)}
                            {filters.category !== selectedCategory && filters.category !== 'all' && (
                                <>
                                    <span className="mx-1">→</span>
                                    {getCategoryName(filters.category)}
                                </>
                            )}
                        </span>
                    )}
                    {filters.status !== 'all' && (
                        <span className="inline-flex items-center px-2 py-1 bg-secondary rounded text-secondary-foreground">
                            Status: {filters.status}
                        </span>
                    )}
                    {searchTerm && (
                        <span className="inline-flex items-center px-2 py-1 bg-secondary rounded text-secondary-foreground">
                            Search: "{searchTerm}"
                        </span>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

