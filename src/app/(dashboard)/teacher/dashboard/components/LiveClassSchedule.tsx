'use client'

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LiveClass } from '@/types';

const liveClassSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subjectId: z.number().min(1, 'Subject is required'),
  classId: z.number().min(1, 'Class is required'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  description: z.string().optional(),
});

type LiveClassFormData = z.infer<typeof liveClassSchema>;

export const LiveClassSchedule: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [liveClasses, setLiveClasses] = useState<LiveClass[]>([]);

  const { register, handleSubmit, formState: { errors } } = useForm<LiveClassFormData>({
    resolver: zodResolver(liveClassSchema),
  });

  const onSubmit = async (data: LiveClassFormData) => {
    const newClass: LiveClass = {
      ...data,
      id: Math.max(...liveClasses.map(c => c.id), 0) + 1,
      teacherId: 1, // From auth context
      zoomLink: `https://zoom.us/j/${Math.random().toString(36).substr(2, 9)}`
    };
    
    setLiveClasses(prev => [...prev, newClass]);
    setShowForm(false);
  };

  const isUpcoming = (classTime: string) => new Date(classTime) > new Date();

  return (
    <div className="bg-white rounded-lg shadow p-6 mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Live Class Schedule</h3>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm"
        >
          Schedule Class
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit(onSubmit)} className="mb-6 p-4 border rounded">
          <h4 className="font-medium mb-3">Schedule New Live Class</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title *</label>
              <input {...register('title')} className="w-full p-2 border rounded" />
              {errors.title && <p className="text-red-500 text-xs">{errors.title.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Class *</label>
              <select {...register('classId', { valueAsNumber: true })} className="w-full p-2 border rounded">
                <option value="1">JSS1A</option>
                <option value="2">JSS1B</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Start Time *</label>
              <input type="datetime-local" {...register('startTime')} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Time *</label>
              <input type="datetime-local" {...register('endTime')} className="w-full p-2 border rounded" />
            </div>
          </div>
          <div className="flex space-x-3 mt-4">
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Schedule</button>
            <button type="button" onClick={() => setShowForm(false)} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {liveClasses.map(liveClass => (
          <div key={liveClass.id} className="flex justify-between items-center p-3 border rounded">
            <div>
              <h4 className="font-medium">{liveClass.title}</h4>
              <p className="text-sm text-gray-600">
                {new Date(liveClass.startTime).toLocaleString()} - {new Date(liveClass.endTime).toLocaleString()}
              </p>
            </div>
            <div className="flex space-x-2">
              {isUpcoming(liveClass.startTime) ? (
                <button className="bg-green-600 text-white px-3 py-1 rounded text-sm">
                  Join Class
                </button>
              ) : (
                <span className="text-gray-500 text-sm">Completed</span>
              )}
            </div>
          </div>
        ))}
        
        {liveClasses.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            No live classes scheduled
          </div>
        )}
      </div>
    </div>
  );
};