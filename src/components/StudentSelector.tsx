// components/StudentSelector.tsx
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
    resetPaymentData
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
    console.log('StudentSelector: Changing to child ID:', childId);
    const child = children.find(c => c.id === childId);
    if (child) {
      console.log('StudentSelector: Setting selected child:', child);
      resetPaymentData(); // Clear old payment data
      setSelectedChild(child);
    }
  };

  const currentChildId = selectedChild?.id || children[0]?.id;

  return (
    <div className="flex items-center gap-2">
      <User className="h-4 w-4 text-muted-foreground" />
      <Select
        value={currentChildId}
        onValueChange={handleStudentChange}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select student">
            {selectedChild 
              ? `${selectedChild.first_name} ${selectedChild.last_name}`
              : children[0] 
                ? `${children[0].first_name} ${children[0].last_name}`
                : 'Select student'
            }
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {children.map((child) => (
            <SelectItem key={child.id} value={child.id}>
              {child.first_name} {child.last_name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}