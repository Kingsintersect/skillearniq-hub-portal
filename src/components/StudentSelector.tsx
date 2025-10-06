'use client'
import React, { useEffect, useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useParentStore } from '@/store/parentStore'

export function StudentSelector() {
    const { 
        selectedStudentId, 
        setSelectedStudentId, 
        children 
    } = useParentStore()

    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    const selectedStudent = children.find(child => child.id === selectedStudentId)

    if (!isMounted) {
        return (
            <div className="w-48 h-10 bg-muted rounded-md animate-pulse"></div>
        )
    }

    if (children.length === 0) {
        return null
    }

    return (
        <div className="w-64">
            <Select value={selectedStudentId || ''} onValueChange={setSelectedStudentId}>
                <SelectTrigger className="w-full ">
                    <SelectValue>
                        {selectedStudent ? (
                            <div className="flex space-x-6 text-left">
                                <span className="font-medium text-sm">{selectedStudent.name}</span>
                                <span className="text-xs text-muted-foreground">{selectedStudent.grade}</span>
                            </div>
                        ) : (
                            "Select a student"
                        )}
                    </SelectValue>
                </SelectTrigger>
                <SelectContent>
                    {children.map((child) => (
                        <SelectItem key={child.id} value={child.id}>
                            <div className="flex flex-col">
                                <span className="font-medium">{child.name}</span>
                                <span className="text-sm text-muted-foreground">
                                    {child.grade} • {child.relationship}
                                </span>
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}