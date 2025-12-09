'use client';

import { SubcategorySelect } from './components/categories/SubcategorySelect';
import { CoursesGridView } from './components/courses/CoursesGridView';
import { CoursesTableView } from './components/courses/CoursesTableView';
import { useCategories } from './hooks/use-categories';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Grid3x3, List } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { ParentCategorySelect } from './components/categories/ParentCategorySelect';

export default function CoursesPage() {
  const { view, setView, courses, selectedParentId, selectedSubcategoryId } = useCategories();

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Course Catalog</h1>
        <p className="text-muted-foreground">
          Browse and select courses by exam category and study stream
        </p>
      </div>

      {/* Selection Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Step 1: Select Exam Category</CardTitle>
            <CardDescription>
              Choose the main examination category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ParentCategorySelect />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Step 2: Select Study Stream</CardTitle>
            <CardDescription>
              Choose your preferred study stream
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SubcategorySelect />
          </CardContent>
        </Card>
      </div>

      {/* Courses Section */}
      {(selectedParentId || selectedSubcategoryId) && (
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle>Available Courses</CardTitle>
                <CardDescription>
                  {selectedSubcategoryId
                    ? `${courses.length} courses available`
                    : 'Select a study stream to view courses'
                  }
                </CardDescription>
              </div>

              <div className="flex items-center gap-4">
                <div className="hidden sm:block">
                  <Tabs value={view} onValueChange={(v) => setView(v as 'grid' | 'list')}>
                    <TabsList>
                      <TabsTrigger value="grid">
                        <Grid3x3 className="h-4 w-4 mr-2" />
                        Grid
                      </TabsTrigger>
                      <TabsTrigger value="list">
                        <List className="h-4 w-4 mr-2" />
                        List
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                <Button variant="outline" size="sm">
                  Export List
                </Button>
              </div>
            </div>
          </CardHeader>

          <Separator />

          <CardContent className="pt-6">
            {view === 'grid' ? <CoursesGridView /> : <CoursesTableView />}
          </CardContent>
        </Card>
      )}

      {/* Mobile View Toggle */}
      <div className="fixed bottom-6 right-6 sm:hidden">
        <Button
          size="icon"
          onClick={() => setView(view === 'grid' ? 'list' : 'grid')}
          className="rounded-full shadow-lg"
        >
          {view === 'grid' ? (
            <List className="h-5 w-5" />
          ) : (
            <Grid3x3 className="h-5 w-5" />
          )}
        </Button>
      </div>
    </div>
  );
}



// // app/teacher/classes/page.tsx
// 'use client';
// import React, { useState, useMemo } from 'react';
// import { useTeacherClasses, useClassStudentsInfinite, useClassAssessments, useStudentPerformance } from '@/hooks/use-classes';

// // Shadcn components
// import { Button } from '@/components/ui/button';
// import { Card, CardContent } from '@/components/ui/card';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Label } from '@/components/ui/label';
// import {
//   Users,
//   BookOpen,
//   Calendar,
//   Download,
//   GraduationCap,
//   TrendingUp
// } from 'lucide-react';
// import { ClassDetails } from './components/ClassDetails';
// import { ClassesGridView } from './components/ClassesGridView';
// import { ClassesListView } from './components/ClassesListView';

// export default function ClassesPage() {
//   const [selectedClass, setSelectedClass] = useState<number | null>(null);
//   const [studentSearch, setStudentSearch] = useState('');
//   const [filters, setFilters] = useState({
//     term: '1st',
//   });
//   const [view, setView] = useState<'grid' | 'list'>('grid');

//   const currentTeacherId = 1;
//   const { data: classes, isLoading: classesLoading } = useTeacherClasses(currentTeacherId, filters);

//   const {
//     data: studentsData
//   } = useClassStudentsInfinite(selectedClass || 0, studentSearch);

//   const { data: assessments } = useClassAssessments(selectedClass || 0);
//   const { data: performanceData } = useStudentPerformance(selectedClass || 0);

//   const allStudents = useMemo(() => {
//     return studentsData?.pages.flatMap(page => page.students) || [];
//   }, [studentsData]);

//   const selectedClassData = classes?.find(cls => cls.id === selectedClass);
//   const terms = ['1st', '2nd', '3rd'];

//   if (classesLoading) {
//     return (
//       <div className="min-h-screen p-6 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
//           <p className="text-muted-foreground">Loading your classes...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-8 text-center">
//           <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4">
//             <GraduationCap className="h-8 w-8 text-primary-foreground" />
//           </div>
//           <h1 className="text-4xl font-bold text-foreground mb-2">My Classes</h1>
//           <p className="text-muted-foreground text-lg">View and manage your assigned classes</p>
//         </div>

//         {/* Stats Overview */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//           <Card>
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-muted-foreground">Total Classes</p>
//                   <p className="text-2xl font-bold text-foreground">{classes?.length || 0}</p>
//                 </div>
//                 <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
//                   <BookOpen className="h-6 w-6 text-primary" />
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-muted-foreground">Total Students</p>
//                   <p className="text-2xl font-bold text-foreground">
//                     {classes?.reduce((sum, cls) => sum + cls.studentCount, 0) || 0}
//                   </p>
//                 </div>
//                 <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
//                   <Users className="h-6 w-6 text-green-500" />
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-muted-foreground">Active Terms</p>
//                   <p className="text-2xl font-bold text-foreground">{terms.length}</p>
//                 </div>
//                 <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
//                   <Calendar className="h-6 w-6 text-blue-500" />
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-muted-foreground">Avg Performance</p>
//                   <p className="text-2xl font-bold text-foreground">85.6%</p>
//                 </div>
//                 <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
//                   <TrendingUp className="h-6 w-6 text-purple-500" />
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Filters */}
//         <Card className="mb-6">
//           <CardContent className="p-6">
//             <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
//               <div className="flex flex-col sm:flex-row gap-4 flex-1">
//                 <div className="flex-1">
//                   <Label htmlFor="term">Term</Label>
//                   <Select
//                     value={filters.term}
//                     onValueChange={(value) => setFilters(prev => ({ ...prev, term: value as any }))}
//                   >
//                     <SelectTrigger>
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {terms.map(term => (
//                         <SelectItem key={term} value={term}>{term} Term</SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>

//               <div className="flex gap-3">
//                 <Button
//                   variant="outline"
//                   onClick={() => setView(view === 'grid' ? 'list' : 'grid')}
//                 >
//                   {view === 'grid' ? 'List View' : 'Grid View'}
//                 </Button>
//                 <Button variant="outline">
//                   <Download className="h-4 w-4 mr-2" />
//                   Export
//                 </Button>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Main Content */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Classes List */}
//           <div className={`${selectedClass ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
//             {view === 'grid' ? (
//               <ClassesGridView
//                 classes={classes || []}
//                 onSelectClass={setSelectedClass}
//                 selectedClass={selectedClass}
//               />
//             ) : (
//               <ClassesListView
//                 classes={classes || []}
//                 onSelectClass={setSelectedClass}
//                 selectedClass={selectedClass}
//               />
//             )}
//           </div>

//           {/* Class Details Sidebar */}
//           {selectedClass && (
//             <div className="lg:col-span-1">
//               <ClassDetails
//                 class={selectedClassData}
//                 assessments={assessments || []}
//                 performanceData={performanceData || []}
//                 studentCount={allStudents.length}
//                 onClose={() => setSelectedClass(null)}
//               />
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }