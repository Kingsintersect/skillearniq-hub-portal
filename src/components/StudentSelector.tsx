'use client'
import React, { useEffect, useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ParentChild, useParentStore } from '@/store/parentStore'

export function StudentSelector() {
    const {
        selectedStudentId,
        children,
        selectedChild,
        setSelectedStudentId,
        setSelectedChild,
    } = useParentStore()

    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) {
        return (
            <div className="w-48 h-10 bg-muted rounded-md animate-pulse"></div>
        )
    }

    if (children.length === 0) {
        return null
    }
    const handleSelectedChild = (childId: string) => {
        setSelectedStudentId(childId)
        setSelectedChild(children.find(child => child.id.toString() === childId) as ParentChild)
    }

    return (
        <div className="w-64">
            <Select value={selectedStudentId || ''} onValueChange={(value) => {
                handleSelectedChild(value)
            }}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a student">
                        {selectedChild ? (
                            <div className="flex justify-between items-center w-full">
                                <span className="font-medium text-sm">{selectedChild.first_name}</span>
                                <span className="text-xs text-muted-foreground">{selectedChild.grade}</span>
                            </div>
                        ) : (
                            "Select a student"
                        )}
                    </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-background border border-border">
                    {children.map((child) => (
                        <SelectItem
                            key={child.id}
                            value={child.id.toString()}
                            className="focus:bg-accent focus:text-accent-foreground"
                        >
                            <div className="flex w-full space-x-2 items-center justify-start">
                                <span className="font-medium">{child.first_name}</span>
                                <span className="text-sm text-muted-foreground">
                                    {child.grade} • {child.relationship ?? "Child"}
                                </span>
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}