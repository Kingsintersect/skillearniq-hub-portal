'use client'
import React, { useState } from 'react';
import { useTeacherClasses, useClassAssessments } from '@/hooks/use-classes';


import { Button } from '@/components/ui/button';
import { Card, CardContent} from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

import { toast } from 'sonner';
import { 
  FileText, 
  Download, 
  Plus,
  Filter,
  Clock,
  Award,
  BarChart3,
  Edit,
  Trash2
} from 'lucide-react';

export const AssessmentsPage: React.FC = () => {
  const [filters, setFilters] = useState({
    academicYear: '2024-2025',
    term: '1st',
    classId: 1,
    type: 'all'
  });
  const [view, setView] = useState<'upcoming' | 'completed' | 'drafts'>('upcoming');
  const [searchTerm, setSearchTerm] = useState('');

  const currentTeacherId = 1;
  const { data: classes, isLoading } = useTeacherClasses(currentTeacherId);
  //const { data: assessments } = useClassAssessments(filters.classId);

  // Mock assessments data
  const assessmentsData = {
    upcoming: [
      {
        id: 1,
        title: 'Mathematics Quiz - Algebra',
        class: 'JSS 1A',
        type: 'quiz',
        dueDate: '2024-02-01',
        maxScore: 20,
        status: 'scheduled',
        submissions: 0,
        totalStudents: 30
      }
    ],
    completed: [
      {
        id: 2,
        title: 'English Literature Assignment',
        class: 'JSS 1A',
        type: 'assignment',
        dueDate: '2024-01-20',
        maxScore: 100,
        status: 'graded',
        submissions: 28,
        totalStudents: 30,
        averageScore: 85.5
      }
    ],
    drafts: [
      {
        id: 3,
        title: 'Science Project',
        class: 'JSS 1A',
        type: 'project',
        dueDate: '2024-02-15',
        maxScore: 50,
        status: 'draft',
        submissions: 0,
        totalStudents: 30
      }
    ]
  };

  const academicYears = ['2023-2024', '2024-2025', '2025-2026'];
  const terms = ['1st', '2nd', '3rd'];
  const assessmentTypes = ['all', 'quiz', 'assignment', 'exam', 'project'];

  const handleCreateAssessment = () => {
    toast.success('New assessment created successfully!');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading assessments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4">
            <FileText className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Assessments</h1>
          <p className="text-muted-foreground text-lg">Create and manage student assessments</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Assessments</p>
                  <p className="text-2xl font-bold text-foreground">24</p>
                </div>
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <FileText className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending Grading</p>
                  <p className="text-2xl font-bold text-foreground">3</p>
                </div>
                <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-orange-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Score</p>
                  <p className="text-2xl font-bold text-foreground">82.5%</p>
                </div>
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <Award className="h-6 w-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Submission Rate</p>
                  <p className="text-2xl font-bold text-foreground">94.2%</p>
                </div>
                <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-purple-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Actions */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="flex-1">
                  <Label htmlFor="academicYear">Academic Year</Label>
                  <Select
                    value={filters.academicYear}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, academicYear: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {academicYears.map(year => (
                        <SelectItem key={year} value={year}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-1">
                  <Label htmlFor="term">Term</Label>
                  <Select
                    value={filters.term}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, term: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {terms.map(term => (
                        <SelectItem key={term} value={term}>{term} Term</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-1">
                  <Label htmlFor="class">Class</Label>
                  <Select
                    value={filters.classId.toString()}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, classId: parseInt(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {classes?.map(cls => (
                        <SelectItem key={cls.id} value={cls.id.toString()}>{cls.shortName}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-1">
                  <Label htmlFor="type">Type</Label>
                  <Select
                    value={filters.type}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {assessmentTypes.map(type => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-3">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      New Assessment
                    </Button>
                  </DialogTrigger>
                  <CreateAssessmentDialog onCreate={handleCreateAssessment} classes={classes || []} />
                </Dialog>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex gap-4">
              <Input
                placeholder="Search assessments by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs value={view} onValueChange={(value: any) => setView(value)} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="drafts">Drafts</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            <AssessmentsListView data={assessmentsData.upcoming} type="upcoming" />
          </TabsContent>

          <TabsContent value="completed">
            <AssessmentsListView data={assessmentsData.completed} type="completed" />
          </TabsContent>

          <TabsContent value="drafts">
            <AssessmentsListView data={assessmentsData.drafts} type="drafts" />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// Assessments List View Component
const AssessmentsListView: React.FC<{ data: any[]; type: string }> = ({ data, type }) => {
  if (data.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No assessments found</h3>
          <p className="text-muted-foreground">
            {type === 'upcoming' ? 'No upcoming assessments' :
             type === 'completed' ? 'No completed assessments' : 'No draft assessments'}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Assessment Title</TableHead>
            <TableHead>Class</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Max Score</TableHead>
            <TableHead>Submissions</TableHead>
            {type === 'completed' && <TableHead>Average Score</TableHead>}
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((assessment) => (
            <TableRow key={assessment.id}>
              <TableCell className="font-medium">{assessment.title}</TableCell>
              <TableCell>
                <Badge variant="outline">{assessment.class}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant={
                  assessment.type === 'quiz' ? 'secondary' :
                  assessment.type === 'assignment' ? 'default' :
                  assessment.type === 'exam' ? 'destructive' : 'outline'
                }>
                  {assessment.type}
                </Badge>
              </TableCell>
              <TableCell>
                {new Date(assessment.dueDate).toLocaleDateString()}
              </TableCell>
              <TableCell>{assessment.maxScore}</TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Progress 
                    value={(assessment.submissions / assessment.totalStudents) * 100} 
                    className="h-2 w-16" 
                  />
                  <span className="text-sm">{assessment.submissions}/{assessment.totalStudents}</span>
                </div>
              </TableCell>
              {type === 'completed' && (
                <TableCell>
                  <Badge variant={assessment.averageScore >= 80 ? 'default' : 'destructive'}>
                    {assessment.averageScore}%
                  </Badge>
                </TableCell>
              )}
              <TableCell>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

// Create Assessment Dialog Component
const CreateAssessmentDialog: React.FC<{ onCreate: () => void; classes: any[] }> = ({ onCreate, classes }) => {
  const [formData, setFormData] = useState({
    title: '',
    classId: '',
    type: 'assignment',
    dueDate: '',
    maxScore: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate();
  };

  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Create New Assessment</DialogTitle>
        <DialogDescription>
          Fill in the details to create a new assessment for your students.
        </DialogDescription>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Assessment Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter assessment title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="class">Class</Label>
            <Select
              value={formData.classId}
              onValueChange={(value) => setFormData(prev => ({ ...prev, classId: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select class" />
              </SelectTrigger>
              <SelectContent>
                {classes.map(cls => (
                  <SelectItem key={cls.id} value={cls.id.toString()}>{cls.shortName}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="type">Assessment Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="quiz">Quiz</SelectItem>
                <SelectItem value="assignment">Assignment</SelectItem>
                <SelectItem value="exam">Exam</SelectItem>
                <SelectItem value="project">Project</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="maxScore">Maximum Score</Label>
          <Input
            id="maxScore"
            type="number"
            value={formData.maxScore}
            onChange={(e) => setFormData(prev => ({ ...prev, maxScore: e.target.value }))}
            placeholder="Enter maximum score"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Enter assessment description and instructions"
            rows={4}
          />
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline">
            Cancel
          </Button>
          <Button type="submit">
            Create Assessment
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};

export default AssessmentsPage;