import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAssignmentMutation } from '@/hooks/useAssignments';
import { useSubjects } from '@/hooks/use-classes';

const assignmentSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  subjectId: z.number().min(1, 'Subject is required'),
  classId: z.number().min(1, 'Class is required'),
  dueDate: z.string().min(1, 'Due date is required'),
  maxScore: z.number().min(1, 'Max score must be greater than 0'),
  type: z.enum(['quiz', 'assignment', 'exam']),
  status: z.enum(['draft', 'published', 'completed']),
});

type AssignmentFormData = z.infer<typeof assignmentSchema>;

interface CreateAssignmentFormProps {
  onClose: () => void;
  classId?: number;
  subjectId?: number;
}

export const CreateAssignmentForm: React.FC<CreateAssignmentFormProps> = ({ 
  onClose, 
  classId, 
  subjectId 
}) => {
  const mutation = useAssignmentMutation();
  const { data: subjects } = useSubjects(classId);
  
  const { register, handleSubmit, formState: { errors } } = useForm<AssignmentFormData>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {
      classId,
      subjectId,
      type: 'assignment',
      maxScore: 100
    }
  });

  const onSubmit = async (data: AssignmentFormData) => {
    try {
      await mutation.mutateAsync(data);
      onClose();
    } catch (error) {
      console.error('Failed to create assignment:', error);
    }
  };

  return (
    <div className="border rounded-lg p-4 mb-6 bg-gray-50">
      <h4 className="font-medium mb-4">Create New Assignment</h4>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title *</label>
            <input
              {...register('title')}
              className="w-full p-2 border rounded"
              placeholder="Assignment title"
            />
            {errors.title && <p className="text-red-500 text-xs">{errors.title.message}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Type *</label>
            <select {...register('type')} className="w-full p-2 border rounded">
              <option value="assignment">Assignment</option>
              <option value="quiz">Quiz</option>
              <option value="exam">Exam</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description *</label>
          <textarea
            {...register('description')}
            rows={3}
            className="w-full p-2 border rounded"
            placeholder="Assignment description and instructions"
          />
          {errors.description && <p className="text-red-500 text-xs">{errors.description.message}</p>}
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Subject *</label>
            <select 
              {...register('subjectId', { valueAsNumber: true })} 
              className="w-full p-2 border rounded"
            >
              <option value="">Select Subject</option>
              {subjects?.map(subject => (
                <option key={subject.id} value={subject.id}>{subject.name}</option>
              ))}
            </select>
            {errors.subjectId && <p className="text-red-500 text-xs">{errors.subjectId.message}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Due Date *</label>
            <input
              type="datetime-local"
              {...register('dueDate')}
              className="w-full p-2 border rounded"
            />
            {errors.dueDate && <p className="text-red-500 text-xs">{errors.dueDate.message}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Max Score *</label>
            <input
              type="number"
              {...register('maxScore', { valueAsNumber: true })}
              className="w-full p-2 border rounded"
              min="1"
            />
            {errors.maxScore && <p className="text-red-500 text-xs">{errors.maxScore.message}</p>}
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
          >
            {mutation.isPending ? 'Creating...' : 'Create Assignment'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};