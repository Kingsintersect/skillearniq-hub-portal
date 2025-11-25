// app/admin/teachers/page.tsx
"use client";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Plus,
  Search,
  Upload,
  Trash2,
  BookOpen,
  Edit,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useAdminQueries } from "@/hooks/useAdminQueries";
import { toast } from "sonner";
import {
  CreateTeacherPayload,
  AssignTeacherPayload,
} from "@/lib/services/admin/teacherService";
import { useRouter } from "next/navigation";

// Pagination Component (same as before)
const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
}) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const startPage = Math.max(
        1,
        currentPage - Math.floor(maxVisiblePages / 2)
      );
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) pages.push("...");
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex items-center justify-between px-2 py-4">
      <div className="flex-1 text-sm text-muted-foreground">
        Showing {startItem} to {endItem} of {totalItems} entries
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="hidden sm:flex"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center space-x-1">
          {getPageNumbers().map((page, index) =>
            page === "..." ? (
              <span key={index} className="px-2 py-1 text-sm">
                ...
              </span>
            ) : (
              <Button
                key={index}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(page as number)}
                className="h-8 w-8 p-0"
              >
                {page}
              </Button>
            )
          )}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="hidden sm:flex"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

export default function TeachersPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    category: "all",
    status: "all",
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 10,
  });

  const {
    useCategories,
    useCourses,
    useTeachers,
    useCreateTeacher,
    useUpdateTeacher,
    useAssignTeacher,
    useDeleteTeacher,
  } = useAdminQueries();

  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const router = useRouter();

  // Fetch categories and courses
  const { data: categoriesResponse } = useCategories({ page: 1, perPage: 50 });
  const { data: coursesResponse } = useCourses({ page: 1, perPage: 50 });
  const { useTeacherSubjects } = useAdminQueries();
  const { data: subjectsResponse } = useTeacherSubjects();
  const allSubjects = subjectsResponse?.data || [];

  // Function to get teacher's assigned subjects
  const getTeacherAssignedSubjects = (teacherId: number) => {
    return allSubjects
      .filter((subject: any) => subject.teacher.id === teacherId)
      .map((subject: any) => subject.subject.name);
  };

  // Fetch teachers with proper filtering and pagination
  const { data: teachersResponse, isLoading } = useTeachers({
    search: debouncedSearchTerm,
    category: filters.category !== "all" ? filters.category : undefined,
    status: filters.status !== "all" ? filters.status : undefined,
    page: pagination.currentPage,
    perPage: pagination.itemsPerPage,
  });

  const createTeacherMutation = useCreateTeacher();
  const updateTeacherMutation = useUpdateTeacher();
  const assignTeacherMutation = useAssignTeacher();
  const deleteTeacherMutation = useDeleteTeacher();

  const [newTeacher, setNewTeacher] = useState({
    first_name: "",
    last_name: "",
    email: "",
    username: "",
    phone: "",
    password: "P@55word",
    employee_no: "",
    hire_date: "",
    subjects: [] as string[],
  });

  const [editTeacher, setEditTeacher] = useState({
    email_verified: 0,
    meta: [] as string[],
    subjects: [] as string[],
  });

  const [assignment, setAssignment] = useState({
    class_group_id: 0,
    subject_id: 0,
    teacher_id: 0,
    start_date: "",
    end_date: "",
    meta: {
      semester: "First",
      room: "",
    },
  });

  // Fix: Handle the API response properly
  const categories = categoriesResponse?.data || [];
  const courses = coursesResponse?.data || [];
  const teachers = teachersResponse?.data || [];
  const totalTeachers = teachers.length; // For now, use length since we don't have pagination meta

  // Reset to first page when filters change
  useEffect(() => {
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  }, [debouncedSearchTerm, filters.category, filters.status]);

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  const handleItemsPerPageChange = (value: string) => {
    setPagination({
      currentPage: 1,
      itemsPerPage: parseInt(value),
    });
  };

  const handleCreateTeacher = () => {
    const payload: CreateTeacherPayload = {
      first_name: newTeacher.first_name,
      last_name: newTeacher.last_name,
      email: newTeacher.email,
      username: newTeacher.username,
      phone: newTeacher.phone,
      password: newTeacher.password,
      teacher: {
        employee_no: newTeacher.employee_no,
        hire_date: newTeacher.hire_date,
        subjects: newTeacher.subjects,
      },
    };

    createTeacherMutation.mutate(payload, {
      onSuccess: () => {
        setIsCreateDialogOpen(false);
        setNewTeacher({
          first_name: "",
          last_name: "",
          email: "",
          username: "",
          phone: "",
          password: "P@55word",
          employee_no: "",
          hire_date: "",
          subjects: [],
        });
        toast.success("Teacher created successfully!");
      },
      onError: (error: any) => {
        toast.error(error.message || "Failed to create teacher");
      },
    });
  };

  const handleEditTeacher = () => {
    if (!selectedTeacher) return;

    const payload = {
      email_verified: editTeacher.email_verified,
      meta: editTeacher.meta,
      teacher: {
        subjects: editTeacher.subjects,
      },
    };

    updateTeacherMutation.mutate(
      {
        id: selectedTeacher.id,
        payload,
      },
      {
        onSuccess: () => {
          setIsEditDialogOpen(false);
          setSelectedTeacher(null);
          toast.success("Teacher updated successfully!");
        },
        onError: (error: any) => {
          toast.error(error.message || "Failed to update teacher");
        },
      }
    );
  };

  const handleAssignTeacher = () => {
    if (selectedTeacher) {
      const payload: AssignTeacherPayload = {
        class_group_id: assignment.class_group_id,
        subject_id: assignment.subject_id,
        teacher_id: selectedTeacher.id,
        start_date: assignment.start_date,
        end_date: assignment.end_date,
        meta: assignment.meta,
      };

      assignTeacherMutation.mutate(payload, {
        onSuccess: () => {
          setIsAssignDialogOpen(false);
          setAssignment({
            class_group_id: 0,
            subject_id: 0,
            teacher_id: 0,
            start_date: "",
            end_date: "",
            meta: { semester: "First", room: "" },
          });
          toast.success("Teacher assigned successfully!");
        },
        onError: (error: any) => {
          toast.error(error.message || "Failed to assign teacher");
        },
      });
    }
  };

  const handleDeleteTeacher = (teacherId: number) => {
    deleteTeacherMutation.mutate(teacherId, {
      onError: (error: any) => {
        toast.error(error.message || "Failed to delete teacher");
      },
    });
  };

  const openEditDialog = (teacher: any) => {
    setSelectedTeacher(teacher);
    setEditTeacher({
      email_verified: teacher.email_verified || 0,
      meta: teacher.meta || [],
      subjects: teacher.teacher?.subjects || [],
    });
    setIsEditDialogOpen(true);
  };

  const openAssignDialog = (teacher: any) => {
    setSelectedTeacher(teacher);
    setAssignment({
      class_group_id: 0,
      subject_id: 0,
      teacher_id: teacher.id,
      start_date: "",
      end_date: "",
      meta: { semester: "First", room: "" },
    });
    setIsAssignDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">Loading teachers...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Teachers Management
            </h1>
            <p className="text-gray-600">
              Manage all teachers and their assignments
            </p>
          </div>
          <div className="flex space-x-4">
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Teacher
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6 bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search teachers by name, email, or employee number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select
                value={filters.category}
                onValueChange={(value) =>
                  setFilters({ ...filters, category: value })
                }
              >
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category: any) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={filters.status}
                onValueChange={(value) =>
                  setFilters({ ...filters, status: value })
                }
              >
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={pagination.itemsPerPage.toString()}
                onValueChange={handleItemsPerPageChange}
              >
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Show per page" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 per page</SelectItem>
                  <SelectItem value="10">10 per page</SelectItem>
                  <SelectItem value="20">20 per page</SelectItem>
                  <SelectItem value="50">50 per page</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              {totalTeachers} teachers found
              {debouncedSearchTerm && ` for "${debouncedSearchTerm}"`}
            </div>
          </CardContent>
        </Card>

        {/* Teachers Table */}
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle>All Teachers</CardTitle>
            <CardDescription>
              {totalTeachers} teachers in the system
              {debouncedSearchTerm && ` matching "${debouncedSearchTerm}"`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee No</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Subjects</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Email Verified</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teachers.map((teacher: any) => (
                  <TableRow key={teacher.id}>
                    <TableCell className="font-medium">
                      {teacher.teacher?.employee_no || "N/A"}
                    </TableCell>
                    <TableCell>
                      <div>
                        <button
                          onClick={() =>
                            router.push(`/admin/teachers/${teacher.id}`)
                          }
                          className="font-medium hover:text-blue-600 hover:underline text-left"
                        >
                          {teacher.first_name} {teacher.last_name}
                        </button>
                        <div className="text-sm text-gray-500">
                          {teacher.username || "No username"}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="text-sm">{teacher.email}</div>
                        <div className="text-sm text-gray-500">
                          {teacher.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {/* Show subjects from teacher profile */}
                        {teacher.teacher?.subjects?.map(
                          (subject: string, index: number) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs"
                            >
                              {subject}
                            </Badge>
                          )
                        )}

                        {/* Show assigned subjects from assignments */}
                        {getTeacherAssignedSubjects(teacher.id).map(
                          (subject: string, index: number) => (
                            <Badge
                              key={`assigned-${index}`}
                              variant="default"
                              className="text-xs"
                            >
                              {subject} ✓
                            </Badge>
                          )
                        )}

                        {(!teacher.teacher?.subjects ||
                          teacher.teacher.subjects.length === 0) &&
                          getTeacherAssignedSubjects(teacher.id).length ===
                            0 && (
                            <span className="text-gray-400 text-xs">
                              No subjects
                            </span>
                          )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={teacher.is_active ? "default" : "secondary"}
                      >
                        {teacher.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={teacher.email_verified ? "default" : "outline"}
                      >
                        {teacher.email_verified ? "Verified" : "Not Verified"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(teacher)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openAssignDialog(teacher)}
                        >
                          <BookOpen className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteTeacher(teacher.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            {Math.ceil(totalTeachers / pagination.itemsPerPage) > 1 && (
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={Math.ceil(totalTeachers / pagination.itemsPerPage)}
                onPageChange={handlePageChange}
                totalItems={totalTeachers}
                itemsPerPage={pagination.itemsPerPage}
              />
            )}
          </CardContent>
        </Card>

        {/* Create Teacher Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Teacher</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>First Name *</Label>
                <Input
                  value={newTeacher.first_name}
                  onChange={(e) =>
                    setNewTeacher({ ...newTeacher, first_name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Last Name *</Label>
                <Input
                  value={newTeacher.last_name}
                  onChange={(e) =>
                    setNewTeacher({ ...newTeacher, last_name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Email *</Label>
                <Input
                  type="email"
                  value={newTeacher.email}
                  onChange={(e) =>
                    setNewTeacher({ ...newTeacher, email: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Username *</Label>
                <Input
                  value={newTeacher.username}
                  onChange={(e) =>
                    setNewTeacher({ ...newTeacher, username: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Phone *</Label>
                <Input
                  value={newTeacher.phone}
                  onChange={(e) =>
                    setNewTeacher({ ...newTeacher, phone: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Employee No *</Label>
                <Input
                  value={newTeacher.employee_no}
                  onChange={(e) =>
                    setNewTeacher({
                      ...newTeacher,
                      employee_no: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Hire Date</Label>
                <Input
                  type="date"
                  value={newTeacher.hire_date}
                  onChange={(e) =>
                    setNewTeacher({ ...newTeacher, hire_date: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Password *</Label>
                <Input
                  type="password"
                  value={newTeacher.password}
                  onChange={(e) =>
                    setNewTeacher({ ...newTeacher, password: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="flex justify-end space-x-4 mt-6">
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateTeacher}>Add Teacher</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Teacher Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Teacher</DialogTitle>
              <DialogDescription>
                Update {selectedTeacher?.first_name}{" "}
                {selectedTeacher?.last_name}'s information
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Email Verified</Label>
                <Select
                  value={editTeacher.email_verified.toString()}
                  onValueChange={(value) =>
                    setEditTeacher({
                      ...editTeacher,
                      email_verified: parseInt(value),
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Not Verified</SelectItem>
                    <SelectItem value="1">Verified</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Subjects (comma-separated)</Label>
                <Input
                  placeholder="Math, Science, English"
                  value={editTeacher.subjects.join(", ")}
                  onChange={(e) =>
                    setEditTeacher({
                      ...editTeacher,
                      subjects: e.target.value.split(",").map((s) => s.trim()),
                    })
                  }
                />
              </div>
            </div>
            <div className="flex justify-end space-x-4 mt-6">
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleEditTeacher}>Update Teacher</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Assign Teacher Dialog */}
        <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Assign Teacher to Course</DialogTitle>
              <DialogDescription>
                Assign {selectedTeacher?.first_name}{" "}
                {selectedTeacher?.last_name} to a course
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Category (Class Group)</Label>
                <Select
                  value={assignment.class_group_id.toString()}
                  onValueChange={(value) =>
                    setAssignment({
                      ...assignment,
                      class_group_id: parseInt(value),
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category: any) => (
                      <SelectItem
                        key={category.id}
                        value={category.id.toString()}
                      >
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Course (Subject)</Label>
                <Select
                  value={assignment.subject_id.toString()}
                  onValueChange={(value) =>
                    setAssignment({
                      ...assignment,
                      subject_id: parseInt(value),
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select course" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course: any) => (
                      <SelectItem key={course.id} value={course.id.toString()}>
                        {course.fullname} ({course.shortname})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    value={assignment.start_date}
                    onChange={(e) =>
                      setAssignment({
                        ...assignment,
                        start_date: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input
                    type="date"
                    value={assignment.end_date}
                    onChange={(e) =>
                      setAssignment({ ...assignment, end_date: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Semester</Label>
                  <Select
                    value={assignment.meta.semester}
                    onValueChange={(value) =>
                      setAssignment({
                        ...assignment,
                        meta: { ...assignment.meta, semester: value },
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="First">First Semester</SelectItem>
                      <SelectItem value="Second">Second Semester</SelectItem>
                      <SelectItem value="Third">Third Semester</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Room</Label>
                  <Input
                    value={assignment.meta.room}
                    onChange={(e) =>
                      setAssignment({
                        ...assignment,
                        meta: { ...assignment.meta, room: e.target.value },
                      })
                    }
                    placeholder="Room number"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-4 mt-6">
              <Button
                variant="outline"
                onClick={() => setIsAssignDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAssignTeacher}>Assign Teacher</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
