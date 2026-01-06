// 'use client'
// import React, { useState, useEffect } from 'react';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Badge } from '@/components/ui/badge';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Label } from '@/components/ui/label';
// import { Checkbox } from '@/components/ui/checkbox';
// import { Plus, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Trash2 } from 'lucide-react';
// import { useAdminQueries } from '@/hooks/useAdminQueries';
// import { toast } from 'sonner';
// import { CreateParentPayload } from '@/lib/services/admin/parentService';

// // Pagination Component
// const Pagination = ({
//   currentPage,
//   totalPages,
//   onPageChange,
//   totalItems,
//   itemsPerPage
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
//       const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
//       const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

//       if (startPage > 1) {
//         pages.push(1);
//         if (startPage > 2) pages.push('...');
//       }

//       for (let i = startPage; i <= endPage; i++) {
//         pages.push(i);
//       }

//       if (endPage < totalPages) {
//         if (endPage < totalPages - 1) pages.push('...');
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
//           {getPageNumbers().map((page, index) => (
//             page === '...' ? (
//               <span key={index} className="px-2 py-1 text-sm text-muted-foreground">...</span>
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
//           ))}
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

// export default function ParentsPage() {
//   const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filters, setFilters] = useState({ status: 'all' });
//   const [pagination, setPagination] = useState({
//     currentPage: 1,
//     itemsPerPage: 10
//   });

//   const { useAllParents, useAllStudents, useCreateParent, useDeleteParent } = useAdminQueries();

//   const debouncedSearchTerm = useDebounce(searchTerm, 500);

//   const { data: allParentsResponse, isLoading: parentsLoading } = useAllParents();
//   const { data: allStudentsResponse, isLoading: studentsLoading } = useAllStudents();
//   const createParentMutation = useCreateParent();
//   const deleteParentMutation = useDeleteParent();

//   const [newParent, setNewParent] = useState({
//     first_name: '',
//     last_name: '',
//     email: '',
//     phone: '',
//     password: 'secret123',
//     children: [] as number[]
//   });

//   const [studentSearch, setStudentSearch] = useState('');

//   const parents = allParentsResponse || [];
//   const allStudents = allStudentsResponse || [];

//   const filteredParents = parents.filter(parent => {
//     const matchesSearch = debouncedSearchTerm === '' ||
//       parent.first_name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
//       parent.last_name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
//       parent.email.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
//       parent.phone.includes(debouncedSearchTerm);

//     const matchesStatus = filters.status === 'all' ||
//       (filters.status === 'active' && parent.is_active === 1) ||
//       (filters.status === 'inactive' && parent.is_active === 0);

//     return matchesSearch && matchesStatus;
//   });

//   const filteredStudents = allStudents.filter(student =>
//     studentSearch === '' ||
//     student.first_name.toLowerCase().includes(studentSearch.toLowerCase()) ||
//     student.last_name.toLowerCase().includes(studentSearch.toLowerCase()) ||
//     student.email.toLowerCase().includes(studentSearch.toLowerCase())
//   );

//   // Pagination
//   const totalItems = filteredParents.length;
//   const totalPages = Math.ceil(totalItems / pagination.itemsPerPage);
//   const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
//   const endIndex = startIndex + pagination.itemsPerPage;
//   const paginatedParents = filteredParents.slice(startIndex, endIndex);

//   useEffect(() => {
//     setPagination(prev => ({ ...prev, currentPage: 1 }));
//   }, [debouncedSearchTerm, filters.status]);

//   const handlePageChange = (page: number) => {
//     setPagination(prev => ({ ...prev, currentPage: page }));
//   };

//   const handleItemsPerPageChange = (value: string) => {
//     setPagination({
//       currentPage: 1,
//       itemsPerPage: parseInt(value)
//     });
//   };

//   const handleCreateParent = () => {
//     const payload: CreateParentPayload = {
//       first_name: newParent.first_name,
//       last_name: newParent.last_name,
//       email: newParent.email,
//       phone: newParent.phone,
//       password: newParent.password,
//       children: newParent.children
//     };

//     createParentMutation.mutate(payload, {
//       onSuccess: () => {
//         setIsCreateDialogOpen(false);
//         setNewParent({
//           first_name: '',
//           last_name: '',
//           email: '',
//           phone: '',
//           password: 'secret123',
//           children: []
//         });
//         toast.success('Parent created successfully!');
//       },
//       onError: (error: any) => {
//         toast.error(error.message || 'Failed to create parent');
//       }
//     });
//   };

//   const handleDeleteParent = (parentId: number) => {
//     deleteParentMutation.mutate(parentId, {
//       onError: (error: any) => {
//         toast.error(error.message || 'Failed to delete parent');
//       }
//     });
//   };

//   const toggleStudentSelection = (studentId: number) => {
//     setNewParent(prev => ({
//       ...prev,
//       children: prev.children.includes(studentId)
//         ? prev.children.filter(id => id !== studentId)
//         : [...prev.children, studentId]
//     }));
//   };

//   const getSelectedStudentNames = () => {
//     return newParent.children.map(id => {
//       const student = allStudents.find(s => s.id === id);
//       return student ? `${student.first_name} ${student.last_name}` : '';
//     }).filter(name => name);
//   };

//   if (parentsLoading || studentsLoading) {
//     return (
//       <div className="min-h-screen p-6 flex items-center justify-center bg-background">
//         <div className="text-center text-foreground">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
//           Loading parents...
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen p-6 bg-background">
//       <div className="max-w-7xl mx-auto">
//         <div className="flex justify-between items-center mb-8">
//           <div>
//             <h1 className="text-3xl font-bold text-foreground">Parents Management</h1>
//             <p className="text-muted-foreground">Manage all parents and their associations</p>
//           </div>
//           <Button onClick={() => setIsCreateDialogOpen(true)}>
//             <Plus className="h-4 w-4 mr-2" />
//             Add Parent
//           </Button>
//         </div>

//         {/* Search and Filters */}
//         <Card className="mb-6 bg-card border-border">
//           <CardContent className="p-6">
//             <div className="flex flex-col md:flex-row gap-4">
//               <div className="flex-1">
//                 <Input
//                   placeholder="Search parents by name, email, or phone..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="bg-background border-border"
//                 />
//               </div>
//               <Select
//                 value={filters.status}
//                 onValueChange={(value) => setFilters({ status: value })}
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
//               {totalItems} parents found
//               {debouncedSearchTerm && ` for "${debouncedSearchTerm}"`}
//             </div>
//           </CardContent>
//         </Card>

//         {/* Parents Table */}
//         <Card className="bg-card border-border">
//           <CardHeader>
//             <CardTitle className="text-foreground">All Parents</CardTitle>
//             <CardDescription>{totalItems} parents in the system</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead className="text-foreground">Name</TableHead>
//                   <TableHead className="text-foreground">Contact</TableHead>
//                   <TableHead className="text-foreground">Children Count</TableHead>
//                   <TableHead className="text-foreground">Status</TableHead>
//                   <TableHead className="text-foreground">Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {paginatedParents.map((parent) => (
//                   <TableRow key={parent.id} className="hover:bg-muted/50">
//                     <TableCell>
//                       <div className="font-medium text-foreground">{parent.first_name} {parent.last_name}</div>
//                     </TableCell>
//                     <TableCell>
//                       <div>
//                         <div className="text-sm text-foreground">{parent.email}</div>
//                         <div className="text-sm text-muted-foreground">{parent.phone}</div>
//                       </div>
//                     </TableCell>
//                     <TableCell>
//                       <Badge variant="outline" className="bg-secondary text-secondary-foreground">
//                         {parent.children?.length || 0}
//                       </Badge>
//                     </TableCell>
//                     <TableCell>
//                       <Badge variant={parent.is_active ? 'default' : 'secondary'}>
//                         {parent.is_active ? 'Active' : 'Inactive'}
//                       </Badge>
//                     </TableCell>
//                     <TableCell>
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => handleDeleteParent(parent.id)}
//                         className="border-border hover:bg-destructive hover:text-destructive-foreground"
//                       >
//                         <Trash2 className="h-4 w-4" />
//                       </Button>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>

//             {/* Pagination */}
//             {totalPages > 1 && (
//               <Pagination
//                 currentPage={pagination.currentPage}
//                 totalPages={totalPages}
//                 onPageChange={handlePageChange}
//                 totalItems={totalItems}
//                 itemsPerPage={pagination.itemsPerPage}
//               />
//             )}
//           </CardContent>
//         </Card>

//         {/* Create Parent Dialog */}
//         <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
//           <DialogContent className="max-w-4xl bg-background border-border">
//             <DialogHeader>
//               <DialogTitle className="text-foreground">Add New Parent</DialogTitle>
//               <DialogDescription>
//                 Create a new parent account and assign children
//               </DialogDescription>
//             </DialogHeader>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div className="space-y-4">
//                 <h3 className="font-medium text-foreground">Parent Information</h3>
//                 <div className="space-y-2">
//                   <Label className="text-foreground">First Name *</Label>
//                   <Input
//                     value={newParent.first_name}
//                     onChange={(e) => setNewParent({ ...newParent, first_name: e.target.value })}
//                     className="bg-background border-border"
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label className="text-foreground">Last Name *</Label>
//                   <Input
//                     value={newParent.last_name}
//                     onChange={(e) => setNewParent({ ...newParent, last_name: e.target.value })}
//                     className="bg-background border-border"
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label className="text-foreground">Email *</Label>
//                   <Input
//                     type="email"
//                     value={newParent.email}
//                     onChange={(e) => setNewParent({ ...newParent, email: e.target.value })}
//                     className="bg-background border-border"
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label className="text-foreground">Phone *</Label>
//                   <Input
//                     value={newParent.phone}
//                     onChange={(e) => setNewParent({ ...newParent, phone: e.target.value })}
//                     className="bg-background border-border"
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label className="text-foreground">Password *</Label>
//                   <Input
//                     type="password"
//                     value={newParent.password}
//                     onChange={(e) => setNewParent({ ...newParent, password: e.target.value })}
//                     className="bg-background border-border"
//                   />
//                 </div>
//               </div>

//               <div className="space-y-4">
//                 <h3 className="font-medium text-foreground">Assign Children</h3>
//                 <div className="space-y-2">
//                   <Label className="text-foreground">Search Students</Label>
//                   <Input
//                     placeholder="Search students by name or email..."
//                     value={studentSearch}
//                     onChange={(e) => setStudentSearch(e.target.value)}
//                     className="bg-background border-border"
//                   />
//                 </div>

//                 <div className="border border-border rounded-lg p-4 max-h-60 overflow-y-auto bg-background">
//                   <div className="space-y-2">
//                     {filteredStudents.map((student) => (
//                       <div key={student.id} className="flex items-center space-x-2 p-2 hover:bg-muted rounded-lg transition-colors">
//                         <Checkbox
//                           checked={newParent.children.includes(student.id)}
//                           onCheckedChange={() => toggleStudentSelection(student.id)}
//                           className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
//                         />
//                         <Label className="flex-1 text-foreground cursor-pointer">
//                           {student.first_name} {student.last_name}
//                           <span className="text-muted-foreground text-sm ml-2">({student.email})</span>
//                         </Label>
//                       </div>
//                     ))}
//                     {filteredStudents.length === 0 && (
//                       <div className="text-sm text-muted-foreground text-center py-4">
//                         No students found
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 {newParent.children.length > 0 && (
//                   <div className="space-y-2">
//                     <Label className="text-foreground">Selected Children ({newParent.children.length})</Label>
//                     <div className="flex flex-wrap gap-1">
//                       {getSelectedStudentNames().map((name, index) => (
//                         <Badge key={index} variant="secondary" className="text-xs bg-secondary text-secondary-foreground">
//                           {name}
//                         </Badge>
//                       ))}
//                     </div>
//                   </div>
//                 )}
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
//               <Button onClick={handleCreateParent}>Create Parent</Button>
//             </div>
//           </DialogContent>
//         </Dialog>
//       </div>
//     </div>
//   );
// }

import React from 'react'

const page = () => {
  return (
    <div>page</div>
  )
}

export default page