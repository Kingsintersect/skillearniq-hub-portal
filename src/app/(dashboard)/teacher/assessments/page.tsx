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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

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
  Trash2,
  Sheet,
  FileDown
} from 'lucide-react';

type ExportFormat = 'csv' | 'excel' | 'pdf';

// Custom hook for assessments export functionality
const useExportAssessments = () => {
  const exportToCSV = (assessments: any[], filename: string = 'assessments') => {
    if (!assessments.length) return;
    
    const headers = ['ID', 'Title', 'Class', 'Type', 'Due Date', 'Max Score', 'Submissions', 'Total Students', 'Average Score', 'Status'];
    
    const csvContent = [
      headers.join(','),
      ...assessments.map(assessment => [
        assessment.id,
        `"${assessment.title.replace(/"/g, '""')}"`,
        `"${assessment.class}"`,
        assessment.type,
        `"${new Date(assessment.dueDate).toLocaleDateString()}"`,
        assessment.maxScore,
        assessment.submissions,
        assessment.totalStudents,
        assessment.averageScore || 'N/A',
        assessment.status
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const exportToExcel = (assessments: any[], filename: string = 'assessments') => {
    if (!assessments.length) return;
    
    const headers = ['ID', 'Title', 'Class', 'Type', 'Due Date', 'Max Score', 'Submissions', 'Total Students', 'Average Score', 'Status'];
    
    const csvContent = [
      headers.join(','),
      ...assessments.map(assessment => [
        assessment.id,
        `"${assessment.title.replace(/"/g, '""')}"`,
        `"${assessment.class}"`,
        assessment.type,
        `"${new Date(assessment.dueDate).toLocaleDateString()}"`,
        assessment.maxScore,
        assessment.submissions,
        assessment.totalStudents,
        assessment.averageScore || 'N/A',
        assessment.status
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.xls`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const exportToPDF = (assessments: any[], filename: string = 'assessments') => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const assessmentData = assessments.map(assessment => `
        <tr>
          <td>${assessment.id}</td>
          <td>${assessment.title}</td>
          <td>${assessment.class}</td>
          <td>${assessment.type}</td>
          <td>${new Date(assessment.dueDate).toLocaleDateString()}</td>
          <td>${assessment.maxScore}</td>
          <td>${assessment.submissions}/${assessment.totalStudents}</td>
          <td>${assessment.averageScore || 'N/A'}%</td>
          <td>${assessment.status}</td>
        </tr>
      `).join('');

      printWindow.document.write(`
        <html>
          <head>
            <title>${filename}</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                margin: 20px; 
                color: #333;
              }
              .header { 
                text-align: center; 
                margin-bottom: 30px; 
                border-bottom: 2px solid #333;
                padding-bottom: 20px;
              }
              .header h1 { 
                margin: 0; 
                color: #1a365d;
                font-size: 24px;
              }
              .header p { 
                margin: 5px 0; 
                color: #666;
              }
              table { 
                width: 100%; 
                border-collapse: collapse; 
                margin-top: 20px;
                font-size: 11px;
              }
              th, td { 
                border: 1px solid #ddd; 
                padding: 8px; 
                text-align: left; 
              }
              th { 
                background-color: #f5f5f5; 
                font-weight: bold;
                color: #333;
              }
              tr:nth-child(even) {
                background-color: #f9f9f9;
              }
              .summary {
                margin-top: 20px;
                padding: 15px;
                background-color: #f0f9ff;
                border-radius: 5px;
              }
              .footer {
                margin-top: 30px;
                text-align: center;
                color: #666;
                font-size: 11px;
              }
              @media print {
                body { margin: 0; }
                .no-print { display: none; }
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Assessments Report - ${filename}</h1>
              <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
              <p>Total Assessments: ${assessments.length}</p>
            </div>

            <div class="summary">
              <strong>Summary:</strong> Showing ${assessments.length} assessment(s) with complete records.
            </div>

            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Class</th>
                  <th>Type</th>
                  <th>Due Date</th>
                  <th>Max Score</th>
                  <th>Submissions</th>
                  <th>Avg Score</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${assessmentData}
              </tbody>
            </table>

            <div class="footer">
              <p>Confidential Assessment Data - For Educational Use Only</p>
              <p>Page generated by School Management System</p>
            </div>

            <div class="no-print" style="margin-top: 20px; text-align: center;">
              <button onclick="window.print()" style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">
                Print PDF
              </button>
              <button onclick="window.close()" style="padding: 10px 20px; background: #6c757d; color: white; border: none; border-radius: 5px; cursor: pointer; margin-left: 10px;">
                Close
              </button>
            </div>

            <script>
              setTimeout(() => {
                window.print();
              }, 500);
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return {
    exportToCSV,
    exportToExcel,
    exportToPDF
  };
};

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
  
  const { exportToCSV, exportToExcel, exportToPDF } = useExportAssessments();

  // Mock assessments data with results
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
        totalStudents: 30,
        results: []
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
        averageScore: 85.5,
        results: [
          { studentId: 1, studentName: 'John Doe', score: 92, grade: 'A' },
          { studentId: 2, studentName: 'Jane Smith', score: 88, grade: 'B+' },
          { studentId: 3, studentName: 'Mike Johnson', score: 76, grade: 'C+' }
        ]
      },
      {
        id: 3,
        title: 'Science Mid-term Exam',
        class: 'JSS 1A',
        type: 'exam',
        dueDate: '2024-01-15',
        maxScore: 100,
        status: 'graded',
        submissions: 30,
        totalStudents: 30,
        averageScore: 78.2,
        results: [
          { studentId: 1, studentName: 'John Doe', score: 85, grade: 'B+' },
          { studentId: 2, studentName: 'Jane Smith', score: 92, grade: 'A' },
          { studentId: 3, studentName: 'Mike Johnson', score: 67, grade: 'C' }
        ]
      }
    ],
    drafts: [
      {
        id: 4,
        title: 'Science Project',
        class: 'JSS 1A',
        type: 'project',
        dueDate: '2024-02-15',
        maxScore: 50,
        status: 'draft',
        submissions: 0,
        totalStudents: 30,
        results: []
      }
    ]
  };

  //console.log('Assessments Data:', assessmentsData);

  const academicYears = ['2023-2024', '2024-2025', '2025-2026'];
  const terms = ['1st', '2nd', '3rd'];
  const assessmentTypes = ['all', 'quiz', 'assignment', 'exam', 'project'];

  const handleCreateAssessment = () => {
    toast.success('New assessment created successfully!');
  };

  const handleExportAssessments = (format: ExportFormat, assessmentsToExport: any[]) => {
    if (assessmentsToExport.length === 0) {
      toast.error('No assessments to export');
      return;
    }

    const className = classes?.find(c => c.id === filters.classId)?.shortName || 'assessments';
    const filename = `${className}_${filters.academicYear}_${filters.term}_assessments`;

    try {
      switch (format) {
        case 'csv':
          exportToCSV(assessmentsToExport, filename);
          toast.success(`Exported ${assessmentsToExport.length} assessments as CSV`);
          break;
        case 'excel':
          exportToExcel(assessmentsToExport, filename);
          toast.success(`Exported ${assessmentsToExport.length} assessments as Excel`);
          break;
        case 'pdf':
          exportToPDF(assessmentsToExport, filename);
          toast.success(`Exported ${assessmentsToExport.length} assessments as PDF`);
          break;
        default:
          toast.error('Unsupported export format');
      }
    } catch (error) {
      toast.error('Failed to export data. Please try again.');
      console.error('Export error:', error);
    }
  };

  const handleExportResults = (assessment: any) => {
    if (!assessment.results || assessment.results.length === 0) {
      toast.error('No results available for this assessment');
      return;
    }

    const headers = ['Student ID', 'Student Name', 'Score', 'Grade', 'Percentage'];
    const csvContent = [
      headers.join(','),
      ...assessment.results.map((result: any) => [
        result.studentId,
        `"${result.studentName}"`,
        result.score,
        result.grade,
        `${((result.score / assessment.maxScore) * 100).toFixed(1)}%`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${assessment.title.replace(/[^a-z0-9]/gi, '_')}_results_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);

    toast.success(`Exported results for ${assessment.title}`);
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
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem 
                      onClick={() => handleExportAssessments('csv', assessmentsData[view])}
                      className="flex items-center space-x-2"
                    >
                      <Sheet className="h-4 w-4" />
                      <span>Export as CSV</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleExportAssessments('excel', assessmentsData[view])}
                      className="flex items-center space-x-2"
                    >
                      <FileDown className="h-4 w-4" />
                      <span>Export as Excel</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleExportAssessments('pdf', assessmentsData[view])}
                      className="flex items-center space-x-2"
                    >
                      <FileText className="h-4 w-4" />
                      <span>Export as PDF</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
            <AssessmentsListView 
              data={assessmentsData.upcoming} 
              type="upcoming" 
              onExportResults={handleExportResults}
            />
          </TabsContent>

          <TabsContent value="completed">
            <AssessmentsListView 
              data={assessmentsData.completed} 
              type="completed" 
              onExportResults={handleExportResults}
            />
          </TabsContent>

          <TabsContent value="drafts">
            <AssessmentsListView 
              data={assessmentsData.drafts} 
              type="drafts" 
              onExportResults={handleExportResults}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// Assessments List View Component
const AssessmentsListView: React.FC<{ 
  data: any[]; 
  type: string;
  onExportResults: (assessment: any) => void;
}> = ({ data, type, onExportResults }) => {
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
                  {type === 'completed' && assessment.results && assessment.results.length > 0 && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onExportResults(assessment)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  )}
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