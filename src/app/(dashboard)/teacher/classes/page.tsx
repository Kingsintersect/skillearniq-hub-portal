'use client'
import React, { useState } from 'react';
import { useClasses, useClassMutation, useSubjects } from '@/hooks/use-classes';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Class, Subject } from '@/types';

const classSchema = z.object({
  name: z.string().min(1, 'Class name is required'),
  level: z.string().min(1, 'Level is required'),
  arm: z.string().min(1, 'Arm is required'),
});

type ClassFormData = z.infer<typeof classSchema>;

const subjectSchema = z.object({
  name: z.string().min(1, 'Subject name is required'),
  teacherId: z.number().min(1, 'Teacher is required'),
});

type SubjectFormData = z.infer<typeof subjectSchema>;

const ClassesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'classes' | 'subjects' | 'timetable'>('classes');
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [showClassForm, setShowClassForm] = useState(false);
  const [showSubjectForm, setShowSubjectForm] = useState(false);
  
  const { data: classes, isLoading } = useClasses();
  const { data: subjects } = useSubjects(selectedClass?.id);
  const classMutation = useClassMutation();

  const { register: registerClass, handleSubmit: handleClassSubmit, formState: { errors: classErrors }, reset: resetClass } = useForm<ClassFormData>({
    resolver: zodResolver(classSchema),
  });

  const { register: registerSubject, handleSubmit: handleSubjectSubmit, formState: { errors: subjectErrors }, reset: resetSubject } = useForm<SubjectFormData>({
    resolver: zodResolver(subjectSchema),
  });

  const onSubmitClass = async (data: ClassFormData) => {
    try {
      await classMutation.mutateAsync({
        ...data,
        subjects: [],
        
      });
      resetClass();
      setShowClassForm(false);
    } catch (error) {
      console.error('Failed to create class:', error);
    }
  };

  const onSubmitSubject = async (data: SubjectFormData) => {
    // Implement subject creation
    console.log('Create subject:', data);
    resetSubject();
    setShowSubjectForm(false);
  };

  const duplicateClass = async (classItem: Class) => {
    // Implement class duplication logic
    console.log('Duplicate class:', classItem);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold dark:text-gray-50 text-gray-900">Class & Course Management</h1>
          <p className="dark:text-gray-100 text-gray-600">Manage classes, subjects, and timetables</p>
        </div>

        {/* Tabs */}
        <div className=" rounded-lg shadow-sm mb-6">
          <div className="border-b">
            <nav className="flex space-x-8 px-6">
              {['classes', 'subjects', 'timetable'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 dark:text-gray-100 hover:text-gray-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Classes Tab */}
        {activeTab === 'classes' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Class List */}
            <div className="lg:col-span-3">
              <div className=" rounded-lg shadow-sm">
                <div className="p-6 border-b">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold">All Classes</h2>
                    <button
                      onClick={() => setShowClassForm(true)}
                      className="bg-blue-600 dark:text-white text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
                    >
                      Add New Class
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {classes?.map((classItem) => (
                      <div
                        key={classItem.id}
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => setSelectedClass(classItem)}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-semibold text-lg text-gray-900">{classItem.name}</h3>
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            {classItem.subjects.length} subjects
                          </span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Level:</span>
                            <span className="font-medium">{classItem.level}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Arm:</span>
                            <span className="font-medium">{classItem.arm}</span>
                          </div>
                        </div>
                        <div className="flex space-x-2 mt-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              duplicateClass(classItem);
                            }}
                            className="flex-1 bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-200"
                          >
                            Duplicate
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedClass(classItem);
                              setActiveTab('subjects');
                            }}
                            className="flex-1 bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm hover:bg-blue-200"
                          >
                            Manage
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Class Form */}
            <div className="lg:col-span-1">
              {showClassForm && (
                <div className=" rounded-lg shadow-sm p-6 sticky top-6">
                  <h3 className="text-lg font-semibold mb-4">Create New Class</h3>
                  <form onSubmit={handleClassSubmit(onSubmitClass)} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Class Name</label>
                      <input
                        {...registerClass('name')}
                        className="w-full p-2 border rounded-lg"
                        placeholder="e.g., JSS1A"
                      />
                      {classErrors.name && <p className="text-red-500 text-xs mt-1">{classErrors.name.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
                      <select {...registerClass('level')} className="w-full p-2 border rounded-lg">
                        <option value="">Select Level</option>
                        {['JSS1', 'JSS2', 'JSS3', 'SSS1', 'SSS2', 'SSS3'].map(level => (
                          <option key={level} value={level}>{level}</option>
                        ))}
                      </select>
                      {classErrors.level && <p className="text-red-500 text-xs mt-1">{classErrors.level.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Arm</label>
                      <select {...registerClass('arm')} className="w-full p-2 border rounded-lg">
                        <option value="">Select Arm</option>
                        {['A', 'B', 'C', 'D', 'E'].map(arm => (
                          <option key={arm} value={arm}>{arm}</option>
                        ))}
                      </select>
                      {classErrors.arm && <p className="text-red-500 text-xs mt-1">{classErrors.arm.message}</p>}
                    </div>

                    <div className="flex space-x-3">
                      <button
                        type="submit"
                        className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700"
                      >
                        Create Class
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowClassForm(false)}
                        className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Subjects Tab */}
        {activeTab === 'subjects' && (
          <div className=" rounded-lg shadow-sm">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold">Subjects</h2>
                  {selectedClass && (
                    <p className="text-gray-600">Managing subjects for {selectedClass.name}</p>
                  )}
                </div>
                <div className="flex space-x-3">
                  <select
                    value={selectedClass?.id || ''}
                    onChange={(e) => setSelectedClass(classes?.find(c => c.id === Number(e.target.value)) || null)}
                    className="border rounded-lg p-2"
                  >
                    <option value="">Select a class</option>
                    {classes?.map(classItem => (
                      <option key={classItem.id} value={classItem.id}>{classItem.name}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => setShowSubjectForm(true)}
                    disabled={!selectedClass}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                  >
                    Add Subject
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6">
              {selectedClass ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {subjects?.map((subject) => (
                    <div key={subject.id} className="border rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">{subject.name}</h4>
                      <div className="text-sm text-gray-600">
                        Teacher ID: {subject.teacherId}
                      </div>
                      <div className="flex space-x-2 mt-3">
                        <button className="text-blue-600 text-sm hover:text-blue-800">
                          Edit
                        </button>
                        <button className="text-red-600 text-sm hover:text-red-800">
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  Please select a class to manage subjects
                </div>
              )}
            </div>
          </div>
        )}

        {/* Timetable Tab */}
        {activeTab === 'timetable' && (
          <TimetableManager selectedClass={selectedClass} />
        )}
      </div>
    </div>
  );
};

const TimetableManager: React.FC<{ selectedClass: Class | null }> = ({ selectedClass }) => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const periods = ['8:00-9:00', '9:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-1:00', '1:00-2:00'];

  return (
    <div className=" rounded-lg shadow-sm">
      <div className="p-6 border-b">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Timetable Management</h2>
          <select
            value={selectedClass?.id || ''}
            onChange={(e) => {/* Handle class selection */}}
            className="border rounded-lg p-2"
          >
            <option value="">Select a class</option>
            {/* Class options */}
          </select>
        </div>
      </div>

      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="p-3  border">Time/Day</th>
                {days.map(day => (
                  <th key={day} className="p-3  border">{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {periods.map(period => (
                <tr key={period}>
                  <td className="p-3 border  font-medium">{period}</td>
                  {days.map(day => (
                    <td key={day} className="p-3 border min-w-[200px]">
                      <select className="w-full p-2 border rounded">
                        <option value="">Select Subject</option>
                        {/* Subject options */}
                      </select>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ClassesPage