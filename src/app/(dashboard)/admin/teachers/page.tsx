"use client";

import React from 'react';
import { TeachersPageProvider } from './components/TeachersPageProvider';
import { TeachersPageView } from './components/TeachersPageView';
export default function TeachersPage() {
  return (
    <TeachersPageProvider>
      <TeachersPageView />
    </TeachersPageProvider>
  );
}






// // 'use client';

// // import React from 'react';
// // import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// // import { Button } from '@/components/ui/button';
// // import { Plus } from 'lucide-react';
// // import { SearchFilter } from './components/SearchFilter';
// // import { ParentCategorySelect } from './components/ParentCategorySelect';
// // import { SubcategorySelect } from './components/SubcategorySelect';
// // import { PaginationControls } from './components/PaginationControls';
// // import { CreateTeacherDialog } from './components/CreateTeacherDialog';
// // import { EditTeacherDialog } from './components/EditTeacherDialog';
// // import { AssignTeacherDialog } from './components/AssignTeacherDialog';
// // import { useTeacherData } from './hooks/useTeacherData';
// // import { TeachersTable } from './components/TeachersTable';

// // export default function TeachersPage() {
// //   const { teachers, isLoading, error } = useTeacherData();

// //   if (isLoading) {
// //     return (
// //       <div className="min-h-screen p-6 flex items-center justify-center">
// //         <div className="text-center">
// //           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
// //           <p className="text-muted-foreground">Loading teachers...</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   if (error) {
// //     return (
// //       <div className="min-h-screen p-6 flex items-center justify-center">
// //         <Card className="w-full max-w-md">
// //           <CardHeader>
// //             <CardTitle className="text-destructive">Error</CardTitle>
// //           </CardHeader>
// //           <CardContent>
// //             <p>{error}</p>
// //           </CardContent>
// //         </Card>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="min-h-screen p-6">
// //       <div className="max-w-7xl mx-auto">
// //         {/* Header */}
// //         <div className="flex justify-between items-center mb-8">
// //           <div>
// //             <h1 className="text-3xl font-bold">Teachers Management</h1>
// //             <p className="text-muted-foreground">Manage all teachers and their assignments</p>
// //           </div>
// //           <CreateTeacherDialog />
// //         </div>

// //         {/* Filters Section */}
// //         <Card className="mb-6">
// //           <CardContent className="p-6">
// //             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
// //               <div className="lg:col-span-1">
// //                 <SearchFilter />
// //               </div>
// //               <div className="lg:col-span-1">
// //                 <ParentCategorySelect />
// //               </div>
// //               <div className="lg:col-span-1">
// //                 <SubcategorySelect />
// //               </div>
// //               <div className="flex items-end md:col-span-2 lg:col-span-1">
// //                 <Button variant="outline" className="w-full">
// //                   Clear Filters
// //                 </Button>
// //               </div>
// //             </div>
// //           </CardContent>
// //         </Card>

// //         {/* Teachers Table */}
// //         <Card>
// //           <CardHeader className="flex flex-row items-center justify-between">
// //             <div>
// //               <CardTitle>All Teachers</CardTitle>
// //               <CardDescription>
// //                 {teachers.length} teachers found
// //               </CardDescription>
// //             </div>
// //             <Button>
// //               <Plus className="h-4 w-4 mr-2" />
// //               Export
// //             </Button>
// //           </CardHeader>
// //           <CardContent>
// //             <TeachersTable />
// //             <PaginationControls />
// //           </CardContent>
// //         </Card>

// //         {/* Dialogs */}
// //         <EditTeacherDialog />
// //         <AssignTeacherDialog />
// //       </div>
// //     </div>
// //   );
// // }








// "use client";
// import React, { useState, useEffect } from "react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Label } from "@/components/ui/label";
// import {
//   Plus,
//   Search,
//   Upload,
//   Trash2,
//   BookOpen,
//   Edit,
//   ChevronLeft,
//   ChevronRight,
//   ChevronsLeft,
//   ChevronsRight,
// } from "lucide-react";
// import { useAdminQueries } from "@/hooks/useAdminQueries";
// import { toast } from "sonner";
// import {
//   CreateTeacherPayload,
//   AssignTeacherPayload,
// } from "@/lib/services/admin/teacherService";
// import { useRouter } from "next/navigation";

// // Pagination Component
// const Pagination = ({
//   currentPage,
//   totalPages,
//   onPageChange,
//   totalItems,
//   itemsPerPage,
// }: {
//   currentPage: number;
//   totalPages: number;
//   onPageChange: (page: number) => void;
//   totalItems: number;
//   itemsPerPage: number;
// }) => {
//   const getPageNumbers = () => {
//     const pages = [];
//     const maxVisiblePages = 5;

//     if (totalPages <= maxVisiblePages) {
//       for (let i = 1; i <= totalPages; i++) {
//         pages.push(i);
//       }
//     } else {
//       const startPage = Math.max(
//         1,
//         currentPage - Math.floor(maxVisiblePages / 2)
//       );
//       const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

//       if (startPage > 1) {
//         pages.push(1);
//         if (startPage > 2) pages.push("...");
//       }

//       for (let i = startPage; i <= endPage; i++) {
//         pages.push(i);
//       }

//       if (endPage < totalPages) {
//         if (endPage < totalPages - 1) pages.push("...");
//         pages.push(totalPages);
//       }
//     }

//     return pages;
//   };

//   const startItem = (currentPage - 1) * itemsPerPage + 1;
//   const endItem = Math.min(currentPage * itemsPerPage, totalItems);

//   return (
//     <div className="flex items-center justify-between px-2 py-4">
//       <div className="flex-1 text-sm text-muted-foreground">
//         Showing {startItem} to {endItem} of {totalItems} entries
//       </div>
//       <div className="flex items-center space-x-2">
//         <Button
//           variant="outline"
//           size="sm"
//           onClick={() => onPageChange(1)}
//           disabled={currentPage === 1}
//           className="hidden sm:flex border-border"
//         >
//           <ChevronsLeft className="h-4 w-4" />
//         </Button>
//         <Button
//           variant="outline"
//           size="sm"
//           onClick={() => onPageChange(currentPage - 1)}
//           disabled={currentPage === 1}
//           className="border-border"
//         >
//           <ChevronLeft className="h-4 w-4" />
//         </Button>

//         <div className="flex items-center space-x-1">
//           {getPageNumbers().map((page, index) =>
//             page === "..." ? (
//               <span key={index} className="px-2 py-1 text-sm text-muted-foreground">
//                 ...
//               </span>
//             ) : (
//               <Button
//                 key={index}
//                 variant={currentPage === page ? "default" : "outline"}
//                 size="sm"
//                 onClick={() => onPageChange(page as number)}
//                 className="h-8 w-8 p-0 border-border"
//               >
//                 {page}
//               </Button>
//             )
//           )}
//         </div>

//         <Button
//           variant="outline"
//           size="sm"
//           onClick={() => onPageChange(currentPage + 1)}
//           disabled={currentPage === totalPages}
//           className="border-border"
//         >
//           <ChevronRight className="h-4 w-4" />
//         </Button>
//         <Button
//           variant="outline"
//           size="sm"
//           onClick={() => onPageChange(totalPages)}
//           disabled={currentPage === totalPages}
//           className="hidden sm:flex border-border"
//         >
//           <ChevronsRight className="h-4 w-4" />
//         </Button>
//       </div>
//     </div>
//   );
// };

// const useDebounce = <T,>(value: T, delay: number): T => {
//   const [debouncedValue, setDebouncedValue] = useState<T>(value);
//   useEffect(() => {
//     const handler = setTimeout(() => setDebouncedValue(value), delay);
//     return () => clearTimeout(handler);
//   }, [value, delay]);
//   return debouncedValue;
// };

// export default function TeachersPage() {
//   const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
//   const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
//   const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
//   const [selectedTeacher, setSelectedTeacher] = useState<any>(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filters, setFilters] = useState({
//     category: "all",
//     status: "all",
//   });
//   const [pagination, setPagination] = useState({
//     currentPage: 1,
//     itemsPerPage: 10,
//   });

//   const {
//     useCategories,
//     useCourses,
//     useTeachers,
//     useCreateTeacher,
//     useUpdateTeacher,
//     useAssignTeacher,
//     useDeleteTeacher,
//   } = useAdminQueries();

//   const debouncedSearchTerm = useDebounce(searchTerm, 500);
//   const router = useRouter();
//   // Fetch categories and courses
//   const { data: categoriesResponse } = useCategories({ page: 1, perPage: 50 });
//   const { data: coursesResponse } = useCourses({ page: 1, perPage: 50 });
//   const { useTeacherSubjects } = useAdminQueries();
//   const { data: subjectsResponse } = useTeacherSubjects();
//   const allSubjects = subjectsResponse?.data || [];

//   // Function to get teacher's assigned subjects
//   const getTeacherAssignedSubjects = (teacherId: number) => {
//     return allSubjects
//       .filter((subject: any) => subject.teacher.id === teacherId)
//       .map((subject: any) => subject.subject);
//   };

//   // Fetch teachers with proper filtering and pagination
//   const { data: teachersResponse, isLoading } = useTeachers({
//     search: debouncedSearchTerm,
//     category: filters.category !== "all" ? filters.category : undefined,
//     status: filters.status !== "all" ? filters.status : undefined,
//     page: pagination.currentPage,
//     perPage: pagination.itemsPerPage,
//   });

//   const createTeacherMutation = useCreateTeacher();
//   const updateTeacherMutation = useUpdateTeacher();
//   const assignTeacherMutation = useAssignTeacher();
//   const deleteTeacherMutation = useDeleteTeacher();

//   const [newTeacher, setNewTeacher] = useState({
//     first_name: "",
//     last_name: "",
//     email: "",
//     username: "",
//     phone: "",
//     password: "P@55word",
//     employee_no: "",
//     hire_date: "",
//     subjects: [] as string[],
//   });

//   const [editTeacher, setEditTeacher] = useState({
//     email_verified: 0,
//     meta: [] as string[],
//     subjects: [] as string[],
//   });

//   const [assignment, setAssignment] = useState({
//     class_group_id: 0,
//     subject_id: 0,
//     teacher_id: 0,
//     start_date: "",
//     end_date: "",
//     meta: {
//       semester: "First",
//       room: "",
//     },
//   });

//   // Fix: Handle the API response properly
//   const categories = categoriesResponse?.data || [];
//   const courses = coursesResponse?.data || [];
//   const teachers = teachersResponse?.data || [];
//   const totalTeachers = teachers.length;

//   // Reset to first page when filters change
//   useEffect(() => {
//     setPagination((prev) => ({ ...prev, currentPage: 1 }));
//   }, [debouncedSearchTerm, filters.category, filters.status]);

//   const handlePageChange = (page: number) => {
//     setPagination((prev) => ({ ...prev, currentPage: page }));
//   };

//   const handleItemsPerPageChange = (value: string) => {
//     setPagination({
//       currentPage: 1,
//       itemsPerPage: parseInt(value),
//     });
//   };

//   const handleCreateTeacher = () => {
//     const payload: CreateTeacherPayload = {
//       first_name: newTeacher.first_name,
//       last_name: newTeacher.last_name,
//       email: newTeacher.email,
//       username: newTeacher.username,
//       phone: newTeacher.phone,
//       password: newTeacher.password,
//       teacher: {
//         employee_no: newTeacher.employee_no,
//         hire_date: newTeacher.hire_date,
//         subjects: newTeacher.subjects,
//       },
//     };

//     createTeacherMutation.mutate(payload, {
//       onSuccess: () => {
//         setIsCreateDialogOpen(false);
//         setNewTeacher({
//           first_name: "",
//           last_name: "",
//           email: "",
//           username: "",
//           phone: "",
//           password: "P@55word",
//           employee_no: "",
//           hire_date: "",
//           subjects: [],
//         });
//         toast.success("Teacher created successfully!");
//       },
//       onError: (error: any) => {
//         toast.error(error.message || "Failed to create teacher");
//       },
//     });
//   };

//   const handleEditTeacher = () => {
//     if (!selectedTeacher) return;

//     const payload = {
//       email_verified: editTeacher.email_verified,
//       meta: editTeacher.meta,
//       teacher: {
//         subjects: editTeacher.subjects,
//       },
//     };

//     updateTeacherMutation.mutate(
//       {
//         id: selectedTeacher.id,
//         payload,
//       },
//       {
//         onSuccess: () => {
//           setIsEditDialogOpen(false);
//           setSelectedTeacher(null);
//           toast.success("Teacher updated successfully!");
//         },
//         onError: (error: any) => {
//           toast.error(error.message || "Failed to update teacher");
//         },
//       }
//     );
//   };

//   const handleAssignTeacher = () => {
//     if (selectedTeacher) {
//       const payload: AssignTeacherPayload = {
//         class_group_id: assignment.class_group_id,
//         subject_id: assignment.subject_id,
//         teacher_id: selectedTeacher.id,
//         start_date: assignment.start_date,
//         end_date: assignment.end_date,
//         meta: assignment.meta,
//       };

//       assignTeacherMutation.mutate(payload, {
//         onSuccess: () => {
//           setIsAssignDialogOpen(false);
//           setAssignment({
//             class_group_id: 0,
//             subject_id: 0,
//             teacher_id: 0,
//             start_date: "",
//             end_date: "",
//             meta: { semester: "First", room: "" },
//           });
//           toast.success("Teacher assigned successfully!");
//         },
//         onError: (error: any) => {
//           toast.error(error.message || "Failed to assign teacher");
//         },
//       });
//     }
//   };

//   const handleDeleteTeacher = (teacherId: number) => {
//     deleteTeacherMutation.mutate(teacherId, {
//       onError: (error: any) => {
//         toast.error(error.message || "Failed to delete teacher");
//       },
//     });
//   };

//   const openEditDialog = (teacher: any) => {
//     setSelectedTeacher(teacher);
//     setEditTeacher({
//       email_verified: teacher.email_verified || 0,
//       meta: teacher.meta || [],
//       subjects: teacher.teacher?.subjects || [],
//     });
//     setIsEditDialogOpen(true);
//   };

//   const openAssignDialog = (teacher: any) => {
//     setSelectedTeacher(teacher);
//     setAssignment({
//       class_group_id: 0,
//       subject_id: 0,
//       teacher_id: teacher.id,
//       start_date: "",
//       end_date: "",
//       meta: { semester: "First", room: "" },
//     });
//     setIsAssignDialogOpen(true);
//   };

//   if (isLoading) {
//     return (
//       <div className="min-h-screen p-6 flex items-center justify-center bg-background">
//         <div className="text-center text-foreground">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
//           Loading teachers...
//         </div>
//       </div>
//     );
//   }
//   // alert()
//   return (
//     <div className="min-h-screen p-6 bg-background">
//       <div className="max-w-7xl mx-auto">
//         <div className="flex justify-between items-center mb-8">
//           <div>
//             <h1 className="text-3xl font-bold text-foreground">
//               Teachers Management
//             </h1>
//             <p className="text-muted-foreground">
//               Manage all teachers and their assignments
//             </p>
//           </div>
//           <div className="flex space-x-4">
//             <Button onClick={() => setIsCreateDialogOpen(true)}>
//               <Plus className="h-4 w-4 mr-2" />
//               Add Teacher
//             </Button>
//           </div>
//         </div>

//         {/* Search and Filters */}
//         <Card className="mb-6 bg-card border-border">
//           <CardContent className="p-6">
//             <div className="flex flex-col md:flex-row gap-4">
//               <div className="flex-1">
//                 <Input
//                   placeholder="Search teachers by name, email, or employee number..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="bg-background border-border"
//                 />
//               </div>
//               <Select
//                 value={filters.category}
//                 onValueChange={(value) =>
//                   setFilters({ ...filters, category: value })
//                 }
//               >
//                 <SelectTrigger className="w-full md:w-[200px] bg-background border-border">
//                   <SelectValue placeholder="Category" />
//                 </SelectTrigger>
//                 <SelectContent className="bg-background border-border">
//                   <SelectItem value="all" className="text-foreground">All Categories</SelectItem>
//                   {categories.map((category: any) => (
//                     <SelectItem key={category.id} value={category.name} className="text-foreground">
//                       {category.name}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//               <Select
//                 value={filters.status}
//                 onValueChange={(value) =>
//                   setFilters({ ...filters, status: value })
//                 }
//               >
//                 <SelectTrigger className="w-full md:w-[200px] bg-background border-border">
//                   <SelectValue placeholder="Status" />
//                 </SelectTrigger>
//                 <SelectContent className="bg-background border-border">
//                   <SelectItem value="all" className="text-foreground">All Status</SelectItem>
//                   <SelectItem value="active" className="text-foreground">Active</SelectItem>
//                   <SelectItem value="inactive" className="text-foreground">Inactive</SelectItem>
//                 </SelectContent>
//               </Select>
//               <Select
//                 value={pagination.itemsPerPage.toString()}
//                 onValueChange={handleItemsPerPageChange}
//               >
//                 <SelectTrigger className="w-full md:w-[200px] bg-background border-border">
//                   <SelectValue placeholder="Show per page" />
//                 </SelectTrigger>
//                 <SelectContent className="bg-background border-border">
//                   <SelectItem value="5" className="text-foreground">5 per page</SelectItem>
//                   <SelectItem value="10" className="text-foreground">10 per page</SelectItem>
//                   <SelectItem value="20" className="text-foreground">20 per page</SelectItem>
//                   <SelectItem value="50" className="text-foreground">50 per page</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="mt-4 text-sm text-muted-foreground">
//               {totalTeachers} teachers found
//               {debouncedSearchTerm && ` for "${debouncedSearchTerm}"`}
//             </div>
//           </CardContent>
//         </Card>

//         {/* Teachers Table */}
//         <Card className="bg-card border-border">
//           <CardHeader>
//             <CardTitle className="text-foreground">All Teachers</CardTitle>
//             <CardDescription>
//               {totalTeachers} teachers in the system
//               {debouncedSearchTerm && ` matching "${debouncedSearchTerm}"`}
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead className="text-foreground">Employee No</TableHead>
//                   <TableHead className="text-foreground">Name</TableHead>
//                   <TableHead className="text-foreground">Contact</TableHead>
//                   <TableHead className="text-foreground">Subjects</TableHead>
//                   <TableHead className="text-foreground">Status</TableHead>
//                   <TableHead className="text-foreground">Email Verified</TableHead>
//                   <TableHead className="text-foreground">Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {teachers.map((teacher: any) => (
//                   <TableRow key={teacher.id} className="hover:bg-muted/50">
//                     <TableCell className="font-medium text-foreground">
//                       {teacher.teacher?.employee_no || "N/A"}
//                     </TableCell>
//                     <TableCell>
//                       <div>
//                         <button
//                           onClick={() =>
//                             router.push(`/admin/teachers/${teacher.id}`)
//                           }
//                           className="font-medium hover:text-blue-600 hover:underline text-left text-foreground"
//                         >
//                           {teacher.first_name} {teacher.last_name}
//                         </button>
//                         <div className="text-sm text-muted-foreground">
//                           {teacher.username || "No username"}
//                         </div>
//                       </div>
//                     </TableCell>
//                     <TableCell>
//                       <div>
//                         <div className="text-sm text-foreground">{teacher.email}</div>
//                         <div className="text-sm text-muted-foreground">
//                           {teacher.phone}
//                         </div>
//                       </div>
//                     </TableCell>
//                     <TableCell>
//                       <div className="flex flex-wrap gap-1">
//                         {/* Show subjects from teacher profile */}
//                         {teacher.teacher?.subjects?.map(
//                           (subject: string, index: number) => (
//                             <Badge
//                               key={index}
//                               variant="outline"
//                               className="text-xs bg-secondary text-secondary-foreground"
//                             >
//                               {subject}
//                             </Badge>
//                           )
//                         )}

//                         {/* Show assigned subjects from assignments */}
//                         {getTeacherAssignedSubjects(teacher.id).map(
//                           (subject: any, index: number) => ( // Change type from string to any
//                             <Badge
//                               key={`assigned-${index}`}
//                               variant="default"
//                               className="text-xs"
//                             >
//                               {subject.name} ✓ {/* Access the name property */}
//                             </Badge>
//                           )
//                         )}

//                         {(!teacher.teacher?.subjects ||
//                           teacher.teacher.subjects.length === 0) &&
//                           getTeacherAssignedSubjects(teacher.id).length ===
//                           0 && (
//                             <span className="text-muted-foreground text-xs">
//                               No subjects
//                             </span>
//                           )}
//                       </div>
//                     </TableCell>
//                     <TableCell>
//                       <Badge
//                         variant={teacher.is_active ? "default" : "secondary"}
//                       >
//                         {teacher.is_active ? "Active" : "Inactive"}
//                       </Badge>
//                     </TableCell>
//                     <TableCell>
//                       <Badge
//                         variant={teacher.email_verified ? "default" : "outline"}
//                       >
//                         {teacher.email_verified ? "Verified" : "Not Verified"}
//                       </Badge>
//                     </TableCell>
//                     <TableCell>
//                       <div className="flex space-x-2">
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           onClick={() => openEditDialog(teacher)}
//                           className="border-border hover:bg-blue-500/10 hover:text-blue-600"
//                         >
//                           <Edit className="h-4 w-4" />
//                         </Button>
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           onClick={() => openAssignDialog(teacher)}
//                           className="border-border hover:bg-green-500/10 hover:text-green-600"
//                         >
//                           <BookOpen className="h-4 w-4" />
//                         </Button>
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           onClick={() => handleDeleteTeacher(teacher.id)}
//                           className="border-border hover:bg-destructive/10 hover:text-destructive"
//                         >
//                           <Trash2 className="h-4 w-4" />
//                         </Button>
//                       </div>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>

//             {/* Pagination */}
//             {Math.ceil(totalTeachers / pagination.itemsPerPage) > 1 && (
//               <Pagination
//                 currentPage={pagination.currentPage}
//                 totalPages={Math.ceil(totalTeachers / pagination.itemsPerPage)}
//                 onPageChange={handlePageChange}
//                 totalItems={totalTeachers}
//                 itemsPerPage={pagination.itemsPerPage}
//               />
//             )}
//           </CardContent>
//         </Card>

//         {/* Create Teacher Dialog */}
//         <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
//           <DialogContent className="max-w-2xl bg-background border-border">
//             <DialogHeader>
//               <DialogTitle className="text-foreground">Add New Teacher</DialogTitle>
//             </DialogHeader>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <Label className="text-foreground">First Name *</Label>
//                 <Input
//                   value={newTeacher.first_name}
//                   onChange={(e) =>
//                     setNewTeacher({ ...newTeacher, first_name: e.target.value })
//                   }
//                   className="bg-background border-border"
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label className="text-foreground">Last Name *</Label>
//                 <Input
//                   value={newTeacher.last_name}
//                   onChange={(e) =>
//                     setNewTeacher({ ...newTeacher, last_name: e.target.value })
//                   }
//                   className="bg-background border-border"
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label className="text-foreground">Email *</Label>
//                 <Input
//                   type="email"
//                   value={newTeacher.email}
//                   onChange={(e) =>
//                     setNewTeacher({ ...newTeacher, email: e.target.value })
//                   }
//                   className="bg-background border-border"
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label className="text-foreground">Username *</Label>
//                 <Input
//                   value={newTeacher.username}
//                   onChange={(e) =>
//                     setNewTeacher({ ...newTeacher, username: e.target.value })
//                   }
//                   className="bg-background border-border"
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label className="text-foreground">Phone *</Label>
//                 <Input
//                   value={newTeacher.phone}
//                   onChange={(e) =>
//                     setNewTeacher({ ...newTeacher, phone: e.target.value })
//                   }
//                   className="bg-background border-border"
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label className="text-foreground">Employee No *</Label>
//                 <Input
//                   value={newTeacher.employee_no}
//                   onChange={(e) =>
//                     setNewTeacher({
//                       ...newTeacher,
//                       employee_no: e.target.value,
//                     })
//                   }
//                   className="bg-background border-border"
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label className="text-foreground">Hire Date</Label>
//                 <Input
//                   type="date"
//                   value={newTeacher.hire_date}
//                   onChange={(e) =>
//                     setNewTeacher({ ...newTeacher, hire_date: e.target.value })
//                   }
//                   className="bg-background border-border"
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label className="text-foreground">Password *</Label>
//                 <Input
//                   type="password"
//                   value={newTeacher.password}
//                   onChange={(e) =>
//                     setNewTeacher({ ...newTeacher, password: e.target.value })
//                   }
//                   className="bg-background border-border"
//                 />
//               </div>
//             </div>
//             <div className="flex justify-end space-x-4 mt-6">
//               <Button
//                 variant="outline"
//                 onClick={() => setIsCreateDialogOpen(false)}
//                 className="border-border"
//               >
//                 Cancel
//               </Button>
//               <Button onClick={handleCreateTeacher}>Add Teacher</Button>
//             </div>
//           </DialogContent>
//         </Dialog>

//         {/* Edit Teacher Dialog */}
//         <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
//           <DialogContent className="max-w-2xl bg-background border-border">
//             <DialogHeader>
//               <DialogTitle className="text-foreground">Edit Teacher</DialogTitle>
//               <DialogDescription>
//                 Update {selectedTeacher?.first_name}{" "}
//                 {selectedTeacher?.last_name}'s information
//               </DialogDescription>
//             </DialogHeader>
//             <div className="space-y-4">
//               <div className="space-y-2">
//                 <Label className="text-foreground">Email Verified</Label>
//                 <Select
//                   value={editTeacher.email_verified.toString()}
//                   onValueChange={(value) =>
//                     setEditTeacher({
//                       ...editTeacher,
//                       email_verified: parseInt(value),
//                     })
//                   }
//                 >
//                   <SelectTrigger className="bg-background border-border">
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent className="bg-background border-border">
//                     <SelectItem value="0" className="text-foreground">Not Verified</SelectItem>
//                     <SelectItem value="1" className="text-foreground">Verified</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div className="space-y-2">
//                 <Label className="text-foreground">Subjects (comma-separated)</Label>
//                 <Input
//                   placeholder="Math, Science, English"
//                   value={editTeacher.subjects.join(", ")}
//                   onChange={(e) =>
//                     setEditTeacher({
//                       ...editTeacher,
//                       subjects: e.target.value.split(",").map((s) => s.trim()),
//                     })
//                   }
//                   className="bg-background border-border"
//                 />
//               </div>
//             </div>
//             <div className="flex justify-end space-x-4 mt-6">
//               <Button
//                 variant="outline"
//                 onClick={() => setIsEditDialogOpen(false)}
//                 className="border-border"
//               >
//                 Cancel
//               </Button>
//               <Button onClick={handleEditTeacher}>Update Teacher</Button>
//             </div>
//           </DialogContent>
//         </Dialog>

//         {/* Assign Teacher Dialog */}
//         <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
//           <DialogContent className="max-w-md bg-background border-border">
//             <DialogHeader>
//               <DialogTitle className="text-foreground">Assign Teacher to Course</DialogTitle>
//               <DialogDescription>
//                 Assign {selectedTeacher?.first_name}{" "}
//                 {selectedTeacher?.last_name} to a course
//               </DialogDescription>
//             </DialogHeader>
//             <div className="space-y-4">
//               <div className="space-y-2">
//                 <Label className="text-foreground">Category (Class Group)</Label>
//                 <Select
//                   value={assignment.class_group_id.toString()}
//                   onValueChange={(value) =>
//                     setAssignment({
//                       ...assignment,
//                       class_group_id: parseInt(value),
//                     })
//                   }
//                 >
//                   <SelectTrigger className="bg-background border-border">
//                     <SelectValue placeholder="Select category" />
//                   </SelectTrigger>
//                   <SelectContent className="bg-background border-border">
//                     {categories.map((category: any) => (
//                       <SelectItem
//                         key={category.id}
//                         value={category.id.toString()}
//                         className="text-foreground"
//                       >
//                         {category.name}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div className="space-y-2">
//                 <Label className="text-foreground">Course (Subject)</Label>
//                 <Select
//                   value={assignment.subject_id.toString()}
//                   onValueChange={(value) =>
//                     setAssignment({
//                       ...assignment,
//                       subject_id: parseInt(value),
//                     })
//                   }
//                 >
//                   <SelectTrigger className="bg-background border-border">
//                     <SelectValue placeholder="Select course" />
//                   </SelectTrigger>
//                   <SelectContent className="bg-background border-border">
//                     {courses.map((course: any) => (
//                       <SelectItem key={course.id} value={course.id.toString()} className="text-foreground">
//                         {course.fullname} ({course.shortname})
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label className="text-foreground">Start Date</Label>
//                   <Input
//                     type="date"
//                     value={assignment.start_date}
//                     onChange={(e) =>
//                       setAssignment({
//                         ...assignment,
//                         start_date: e.target.value,
//                       })
//                     }
//                     className="bg-background border-border"
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label className="text-foreground">End Date</Label>
//                   <Input
//                     type="date"
//                     value={assignment.end_date}
//                     onChange={(e) =>
//                       setAssignment({ ...assignment, end_date: e.target.value })
//                     }
//                     className="bg-background border-border"
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label className="text-foreground">Semester</Label>
//                   <Select
//                     value={assignment.meta.semester}
//                     onValueChange={(value) =>
//                       setAssignment({
//                         ...assignment,
//                         meta: { ...assignment.meta, semester: value },
//                       })
//                     }
//                   >
//                     <SelectTrigger className="bg-background border-border">
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent className="bg-background border-border">
//                       <SelectItem value="First" className="text-foreground">First Semester</SelectItem>
//                       <SelectItem value="Second" className="text-foreground">Second Semester</SelectItem>
//                       <SelectItem value="Third" className="text-foreground">Third Semester</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//                 <div className="space-y-2">
//                   <Label className="text-foreground">Room</Label>
//                   <Input
//                     value={assignment.meta.room}
//                     onChange={(e) =>
//                       setAssignment({
//                         ...assignment,
//                         meta: { ...assignment.meta, room: e.target.value },
//                       })
//                     }
//                     placeholder="Room number"
//                     className="bg-background border-border"
//                   />
//                 </div>
//               </div>
//             </div>
//             <div className="flex justify-end space-x-4 mt-6">
//               <Button
//                 variant="outline"
//                 onClick={() => setIsAssignDialogOpen(false)}
//                 className="border-border"
//               >
//                 Cancel
//               </Button>
//               <Button onClick={handleAssignTeacher}>Assign Teacher</Button>
//             </div>
//           </DialogContent>
//         </Dialog>
//       </div>
//     </div>
//   );
// }