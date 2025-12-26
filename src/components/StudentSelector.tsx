// components/StudentSelector.tsx - FULL CODE
'use client'
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useParentStore } from '@/store/parentStore';
import { User } from 'lucide-react';

export function StudentSelector() {
  const {
    children,
    selectedChild,
    setSelectedChild,
    setSelectedStudentId
  } = useParentStore();

  if (children.length === 0) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <User className="h-4 w-4" />
        <span>No students</span>
      </div>
    );
  }

  const handleStudentChange = (childId: string) => {
    const child = children.find(c => c.id.toString() === childId);
    if (child) {
      setSelectedChild(child);
      setSelectedStudentId(childId);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <User className="h-4 w-4 text-muted-foreground" />
      <Select
        value={selectedChild?.id.toString() || children[0]?.id.toString()}
        onValueChange={handleStudentChange}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select student" />
        </SelectTrigger>
        <SelectContent>
          {children.map((child) => (
            <SelectItem key={child.id} value={child.id.toString()}>
              {child.first_name} {child.last_name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}