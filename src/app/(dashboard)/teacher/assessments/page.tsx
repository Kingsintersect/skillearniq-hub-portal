'use client'
import React, { useState } from 'react';
import { useAssignments, useAssignmentMutation } from '@/hooks/useAssignments';
import { useExams, useExamMutation } from '@/hooks/useExams';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Assignment } from '@/types';

const assignmentSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  subjectId: z.number().min(1, 'Subject is required'),
  classId: z.number().min(1, 'Class is required'),
  dueDate: z.string().min(1, 'Due date is required'),
  maxScore: z.number().min(1, 'Max score must be greater than 0'),
  type: z.enum(['quiz', 'assignment', 'exam']),
});

type AssignmentFormData = z.infer<typeof assignmentSchema>;

const examSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  subjectId: z.number().min(1, 'Subject is required'),
  classId: z.number().min(1, 'Class is required'),
  duration: z.number().min(1, 'Duration is required'),
  startTime: z.string().min(1, 'Start time is required'),
  maxScore: z.number().min(1, 'Max score must be greater than 0'),
  requiresWebcam: z.boolean(),
  ipRestriction: z.boolean(),
});

type ExamFormData = z.infer<typeof examSchema>;

 const AssessmentsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'assignments' | 'exams' | 'results'>('assignments');
  const [showAssignmentForm, setShowAssignmentForm] = useState(false);
  const [showExamForm, setShowExamForm] = useState(false);
  const [selectedType, setSelectedType] = useState<'quiz' | 'assignment' | 'exam'>('assignment');

  const { data: assignments, isLoading: assignmentsLoading } = useAssignments();
  const { data: exams, isLoading: examsLoading } = useExams();
  const assignmentMutation = useAssignmentMutation();
  const examMutation = useExamMutation();

  const { 
    register: registerAssignment, 
    handleSubmit: handleAssignmentSubmit, 
    formState: { errors: assignmentErrors }, 
    reset: resetAssignment 
  } = useForm<AssignmentFormData>({
    resolver: zodResolver(assignmentSchema),
  });

  const { 
    register: registerExam, 
    handleSubmit: handleExamSubmit, 
    formState: { errors: examErrors }, 
    reset: resetExam 
  } = useForm<ExamFormData>({
    resolver: zodResolver(examSchema),
    defaultValues: {
      requiresWebcam: false,
      ipRestriction: true,
      maxScore: 100
    }
  });

  const onSubmitAssignment = async (data: AssignmentFormData) => {
    try {
      await assignmentMutation.mutateAsync({
        ...data,
        status: 'draft',
        createdAt: new Date().toISOString()
      } as any); // Temporary fix for type issue
      resetAssignment();
      setShowAssignmentForm(false);
    } catch (error) {
      console.error('Failed to create assignment:', error);
    }
  };

  const onSubmitExam = async (data: ExamFormData) => {
    try {
      await examMutation.mutateAsync({
        ...data,
        status: 'draft',
        endTime: new Date(new Date(data.startTime).getTime() + data.duration * 60000).toISOString()
      } as any);
      resetExam();
      setShowExamForm(false);
    } catch (error) {
      console.error('Failed to create exam:', error);
    }
  };

  const publishAssessment = async (id: number, type: 'assignment' | 'exam') => {
    // Implement publish logic
    console.log('Publish:', type, id);
    alert(`${type} ${id} published successfully!`);
  };

  const duplicateAssessment = async (assessment: any) => {
    // Implement duplication logic
    console.log('Duplicate:', assessment);
    alert(`${assessment.title} duplicated!`);
  };

  const filteredAssignments = assignments?.filter(a => a.type === selectedType);

  if (assignmentsLoading || examsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Assessments & Exams</h1>
          <p className="text-gray-600">Manage assignments, quizzes, exams, and results</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b">
            <nav className="flex space-x-8 px-6">
              {['assignments', 'exams', 'results'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Assignments Tab */}
        {activeTab === 'assignments' && (
          <div className="space-y-6">
            {/* Filters and Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
                <div className="flex space-x-4">
                  {(['assignment', 'quiz', 'exam'] as const).map(type => (
                    <button
                      key={type}
                      onClick={() => setSelectedType(type)}
                      className={`px-4 py-2 rounded-lg font-medium capitalize ${
                        selectedType === type
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {type}s
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setShowAssignmentForm(true)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700"
                >
                  Create New {selectedType.charAt(0).toUpperCase() + selectedType.slice(1)}
                </button>
              </div>
            </div>

            {/* Assessments Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredAssignments?.map((assignment) => (
                <AssessmentCard
                  key={assignment.id}
                  assessment={assignment}
                  type="assignment"
                  onPublish={publishAssessment}
                  onDuplicate={duplicateAssessment}
                />
              ))}
              {filteredAssignments?.length === 0 && (
                <div className="col-span-full text-center py-12 text-gray-500">
                  No {selectedType}s found. Create your first one!
                </div>
              )}
            </div>
          </div>
        )}

        {/* Exams Tab */}
        {activeTab === 'exams' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Exam Management</h2>
                <button
                  onClick={() => setShowExamForm(true)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700"
                >
                  Create New Exam
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {exams?.map((exam) => (
                <AssessmentCard
                  key={exam.id}
                  assessment={exam}
                  type="exam"
                  onPublish={publishAssessment}
                  onDuplicate={duplicateAssessment}
                />
              ))}
              {exams?.length === 0 && (
                <div className="col-span-full text-center py-12 text-gray-500">
                  No exams found. Create your first exam!
                </div>
              )}
            </div>
          </div>
        )}

        {/* Results Tab */}
        {activeTab === 'results' && (
          <ResultsManager />
        )}
      </div>

      {/* Assignment Form Modal */}
      {showAssignmentForm && (
        <AssignmentFormModal
          onClose={() => setShowAssignmentForm(false)}
          onSubmit={handleAssignmentSubmit(onSubmitAssignment)}
          register={registerAssignment}
          errors={assignmentErrors}
          type={selectedType}
        />
      )}

      {/* Exam Form Modal */}
      {showExamForm && (
        <ExamFormModal
          onClose={() => setShowExamForm(false)}
          onSubmit={handleExamSubmit(onSubmitExam)}
          register={registerExam}
          errors={examErrors}
        />
      )}
    </div>
  );
};

const AssessmentCard: React.FC<{
  assessment: any;
  type: 'assignment' | 'exam';
  onPublish: (id: number, type: 'assignment' | 'exam') => void;
  onDuplicate: (assessment: any) => void;
}> = ({ assessment, type, onPublish, onDuplicate }) => {
  const isOverdue = new Date(assessment.dueDate || assessment.startTime) < new Date();

  return (
    <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-semibold text-lg text-gray-900">{assessment.title}</h3>
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            assessment.status === 'published' ? 'bg-green-100 text-green-800' :
            assessment.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {assessment.status}
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{assessment.description}</p>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Due Date:</span>
            <span className="font-medium">
              {new Date(assessment.dueDate || assessment.startTime).toLocaleDateString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Max Score:</span>
            <span className="font-medium">{assessment.maxScore}</span>
          </div>
          {type === 'exam' && (
            <div className="flex justify-between">
              <span className="text-gray-500">Duration:</span>
              <span className="font-medium">{assessment.duration} mins</span>
            </div>
          )}
        </div>

        {isOverdue && assessment.status !== 'completed' && (
          <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded">
            <p className="text-red-700 text-sm font-medium">⚠️ Overdue for grading</p>
          </div>
        )}
      </div>

      <div className="px-6 py-4 bg-gray-50 border-t flex justify-between">
        <button
          onClick={() => onPublish(assessment.id, type)}
          disabled={assessment.status === 'published'}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium disabled:opacity-50"
        >
          {assessment.status === 'published' ? 'Published' : 'Publish'}
        </button>
        <div className="flex space-x-3">
          <button
            onClick={() => onDuplicate(assessment)}
            className="text-gray-600 hover:text-gray-800 text-sm"
          >
            Duplicate
          </button>
          <button className="text-blue-600 hover:text-blue-800 text-sm">
            View Results
          </button>
        </div>
      </div>
    </div>
  );
};

const AssignmentFormModal: React.FC<any> = ({ onClose, onSubmit, register, errors, type }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">Create New {type.charAt(0).toUpperCase() + type.slice(1)}</h3>
        </div>
        
        <form onSubmit={onSubmit} className="p-6 space-y-4">
          {/* Form fields similar to previous implementation */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title *</label>
              <input {...register('title')} className="w-full p-2 border rounded" />
              {errors.title && <p className="text-red-500 text-xs">{errors.title.message}</p>}
            </div>
            {/* More fields... */}
          </div>
          
          <div className="flex space-x-3 pt-4">
            <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded font-medium">
              Create
            </button>
            <button type="button" onClick={onClose} className="flex-1 bg-gray-300 text-gray-700 py-2 rounded font-medium">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ExamFormModal: React.FC<any> = ({ onClose, onSubmit, register, errors }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">Create New Exam</h3>
        </div>
        
        <form onSubmit={onSubmit} className="p-6 space-y-4">
          {/* Exam-specific fields */}
          <div>
            <label className="block text-sm font-medium mb-1">Exam Duration (minutes) *</label>
            <input 
              type="number" 
              {...register('duration', { valueAsNumber: true })} 
              className="w-full p-2 border rounded" 
            />
            {errors.duration && <p className="text-red-500 text-xs">{errors.duration.message}</p>}
          </div>
          
          <div className="flex items-center space-x-2">
            <input type="checkbox" {...register('requiresWebcam')} className="w-4 h-4" />
            <label className="text-sm font-medium">Require webcam monitoring</label>
          </div>
          
          <div className="flex space-x-3 pt-4">
            <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded font-medium">
              Create Exam
            </button>
            <button type="button" onClick={onClose} className="flex-1 bg-gray-300 text-gray-700 py-2 rounded font-medium">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ResultsManager: React.FC = () => {
  // Results management component
  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b">
        <h2 className="text-lg font-semibold">Results Management</h2>
      </div>
      <div className="p-6">
        <div className="text-center py-12 text-gray-500">
          Results management interface coming soon...
        </div>
      </div>
    </div>
  );
};

export default AssessmentsPage