"use client"

import { useState } from "react"
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card"

import {
    Input
} from "@/components/ui/input"

import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue
} from "@/components/ui/select"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Filter, Search } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import { useDebouncedCallback } from "use-debounce"

interface FilterConfig {
    key: string
    label: string
    options: { value: string; label: string }[]
}

export interface SearchConfig {
    searchableFields: string[]
    placeholder?: string
    search: string
    setSearch: (value: string) => void
}


interface DataTableProps<TData extends Record<string, unknown>, TValue> {
    columns: ColumnDef<TData, TValue>[]
    fetchedData: TData[]
    isLoading: boolean
    error: unknown
    title?: string
    searchConfig?: SearchConfig
    filterConfigs?: FilterConfig[]
    pageIndex: number
    pageSize: number
    totalItems: number
    onPaginationChange: (page: number, size: number) => void
    onSortChange: (field: string, order: 'asc' | 'desc') => void
    onSearchChange?: (value: string) => void
    onFilterChange?: (filters: Record<string, string>) => void
    enableRowClick?: boolean
    getRowClickUrl?: (row: TData) => string
}

export function DataTable<TData extends Record<string, unknown>, TValue>({
    columns,
    fetchedData,
    isLoading,
    error,
    title = "Data Listing",
    searchConfig,
    filterConfigs = [],
    pageIndex,
    pageSize,
    totalItems,
    onPaginationChange,
    onSortChange,
    onSearchChange,
    onFilterChange,
    enableRowClick = true,
    getRowClickUrl,
}: DataTableProps<TData, TValue>) {
    const router = useRouter()
    const pathname = usePathname()

    const [searchTerm, setSearchTerm] = useState(searchConfig?.search ?? '')
    const [filters, setFilters] = useState<Record<string, string>>(
        filterConfigs.reduce((acc, config) => ({ ...acc, [config.key]: 'all' }), {})
    )

    const debouncedSearch = useDebouncedCallback((value: string) => {
        if (onSearchChange) onSearchChange(value)
    }, 500)

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setSearchTerm(value)
        debouncedSearch(value)
    }

    const handleRowClick = (row: TData) => {
        if (!enableRowClick) return
        if (getRowClickUrl) router.push(getRowClickUrl(row))
        else if ('id' in row) router.push(`${pathname}/${row.id}`)
    }

    const table = useReactTable({
        data: fetchedData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        manualSorting: true,
        state: {},
    })

    const handleFilterChange = (key: string, value: string) => {
        const updated = { ...filters, [key]: value }
        setFilters(updated)
        if (onFilterChange) onFilterChange(updated)
    }

    // --- Loading ---
    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">{[...Array(5)].map((_, i) => (
                        <Skeleton key={i} className="h-12 w-full" />
                    ))}</div>
                </CardContent>
            </Card>
        )
    }

    // --- Error ---
    if (error) {
        return (
            <Card>
                <CardContent className="flex items-center justify-center h-32">
                    <div className="text-center">
                        <p className="text-red-500 mb-2">Failed to load data</p>
                        <Button onClick={() => window.location.reload()} variant="outline" size="sm">
                            Retry
                        </Button>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <CardTitle className="text-xl font-semibold">{title}</CardTitle>

                    {/* Search + Filters */}
                    <div className="flex gap-2 w-full sm:w-auto">
                        {searchConfig && (
                            <div className="relative flex-1 sm:w-64">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder={searchConfig.placeholder ?? "Search..."}
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    className="pl-10"
                                />
                            </div>
                        )}

                        {filterConfigs.map(config => (
                            <Select
                                key={config.key}
                                value={filters[config.key]}
                                onValueChange={(value) => handleFilterChange(config.key, value)}
                            >
                                <SelectTrigger className="w-36">
                                    <Filter className="h-4 w-4 mr-2" />
                                    <SelectValue placeholder={config.label} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All {config.label}</SelectItem>
                                    {config.options.map(option => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        ))}
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map(headerGroup => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map(header => (
                                        <TableHead
                                            key={header.id}
                                            onClick={() => {
                                                const id = header.column.id
                                                const isAsc = header.column.getIsSorted() === "asc"
                                                onSortChange(id, isAsc ? "desc" : "asc")
                                            }}
                                            className="cursor-pointer select-none"
                                        >
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {fetchedData.length > 0 ? (
                                table.getRowModel().rows.map(row => (
                                    <TableRow
                                        key={row.id}
                                        className={`${enableRowClick ? 'cursor-pointer hover:bg-muted/50' : ''}`}
                                        onClick={() => handleRowClick(row.original)}
                                    >
                                        {row.getVisibleCells().map(cell => (
                                            <TableCell key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="text-center py-4">
                                        No results found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination Controls */}
                <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-3">
                    <div className="text-sm text-muted-foreground">
                        Showing {(pageIndex * pageSize) + 1} - {Math.min((pageIndex + 1) * pageSize, totalItems)} of {totalItems} results
                    </div>

                    <div className="flex items-center gap-2">
                        <Select
                            value={String(pageSize)}
                            onValueChange={(val) => onPaginationChange(0, Number(val))}
                        >
                            <SelectTrigger className="w-[100px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {[10, 20, 50].map(size => (
                                    <SelectItem key={size} value={String(size)}>
                                        Show {size}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onPaginationChange(pageIndex - 1, pageSize)}
                            disabled={pageIndex === 0}
                        >
                            Previous
                        </Button>

                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onPaginationChange(pageIndex + 1, pageSize)}
                            disabled={(pageIndex + 1) * pageSize >= totalItems}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
