'use client'
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Plus, Search, Download, Upload, Trash2, Sheet, FileDown, FileText } from 'lucide-react';
import { useAdminQueries } from '@/hooks/useAdminQueries';
import { toast } from 'sonner';

type ExportFormat = 'csv' | 'excel' | 'pdf';

// Custom hook for export functionality
const useExportParents = () => {
  const exportToCSV = (parents: any[], filename: string = 'parents') => {
    if (!parents.length) return;
    
    const headers = [
      'Name', 
      'Email', 
      'Phone', 
      'Children',
      'Status',
      'Registration Date'
    ];
    
    const csvContent = [
      headers.join(','),
      ...parents.map(parent => [
        `"${parent.name.replace(/"/g, '""')}"`,
        `"${parent.email}"`,
        `"${parent.phone || 'N/A'}"`,
        `"${parent.children.join('; ')}"`,
        parent.status,
        `"${parent.registrationDate || 'N/A'}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const exportToExcel = (parents: any[], filename: string = 'parents') => {
    if (!parents.length) return;
    
    const headers = [
      'Name', 
      'Email', 
      'Phone', 
      'Children',
      'Status',
      'Registration Date'
    ];
    
    const csvContent = [
      headers.join(','),
      ...parents.map(parent => [
        `"${parent.name.replace(/"/g, '""')}"`,
        `"${parent.email}"`,
        `"${parent.phone || 'N/A'}"`,
        `"${parent.children.join('; ')}"`,
        parent.status,
        `"${parent.registrationDate || 'N/A'}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.xls`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const exportToPDF = (parents: any[], filename: string = 'parents') => {
    const printWindow = window.open('', '_blank');
    if (printWindow && parents.length > 0) {
      const parentData = parents.map(parent => `
        <tr>
          <td>${parent.name}</td>
          <td>${parent.email}</td>
          <td>${parent.phone || 'N/A'}</td>
          <td>${parent.children.join(', ')}</td>
          <td>${parent.status}</td>
        </tr>
      `).join('');

      const activeCount = parents.filter(p => p.status === 'active').length;
      const inactiveCount = parents.filter(p => p.status === 'inactive').length;

      printWindow.document.write(`
        <html>
          <head>
            <title>Parent Records - ${filename}</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                margin: 20px; 
                color: #333;
                line-height: 1.4;
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
              .summary { 
                margin: 20px 0;
                padding: 15px;
                background-color: #f0f9ff;
                border-radius: 5px;
                border-left: 4px solid #007bff;
              }
              .summary-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 15px;
                margin: 15px 0;
              }
              .summary-item {
                text-align: center;
                padding: 10px;
                background: white;
                border-radius: 5px;
                border: 1px solid #e1e5e9;
              }
              .summary-value {
                font-size: 18px;
                font-weight: bold;
                color: #1a365d;
              }
              .summary-label {
                font-size: 12px;
                color: #666;
                margin-top: 5px;
              }
              table { 
                width: 100%; 
                border-collapse: collapse; 
                margin: 20px 0;
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
              .status-active { background-color: #d4edda; color: #155724; }
              .status-inactive { background-color: #e2e3e5; color: #383d41; }
              .footer {
                margin-top: 30px;
                text-align: center;
                color: #666;
                font-size: 11px;
                border-top: 1px solid #ddd;
                padding-top: 15px;
              }
              @media print {
                body { margin: 0; }
                .no-print { display: none; }
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Parent Management Records</h1>
              <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
              <p>Total Parents: ${parents.length}</p>
            </div>

            <div class="summary">
              <h3 style="margin: 0 0 10px 0; color: #1a365d;">Parent Summary</h3>
              <div class="summary-grid">
                <div class="summary-item">
                  <div class="summary-value">${parents.length}</div>
                  <div class="summary-label">Total Parents</div>
                </div>
                <div class="summary-item">
                  <div class="summary-value">${activeCount}</div>
                  <div class="summary-label">Active Parents</div>
                </div>
                <div class="summary-item">
                  <div class="summary-value">${inactiveCount}</div>
                  <div class="summary-label">Inactive Parents</div>
                </div>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Children</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${parentData}
              </tbody>
            </table>

            <div class="footer">
              <p>Confidential Parent Records - For Administrative Use Only</p>
              <p>Generated by School Management System</p>
            </div>

            <div class="no-print" style="margin-top: 20px; text-align: center;">
              <button onclick="window.print()" style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer; margin: 5px;">
                Print PDF
              </button>
              <button onclick="window.close()" style="padding: 10px 20px; background: #6c757d; color: white; border: none; border-radius: 5px; cursor: pointer; margin: 5px;">
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

export default function ParentsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isBulkUploadDialogOpen, setIsBulkUploadDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all'
  });
  
  const { useParents, useCreateParent, useDeleteParent } = useAdminQueries();

  const { data: parentsResponse, isLoading } = useParents({
    search: searchTerm,
    status: filters.status
  });

  const { exportToCSV, exportToExcel, exportToPDF } = useExportParents();

  const createParentMutation = useCreateParent();
  const deleteParentMutation = useDeleteParent();

  const [newParent, setNewParent] = useState({
    name: '',
    email: '',
    phone: '',
    children: []
  });

  const parents = parentsResponse?.data || [];

  const handleCreateParent = () => {
    createParentMutation.mutate(newParent, {
      onSuccess: () => {
        setIsCreateDialogOpen(false);
        setNewParent({
          name: '',
          email: '',
          phone: '',
          children: []
        });
        toast.success('Parent created successfully!');
      },
      onError: () => {
        toast.error('Failed to create parent');
      }
    });
  };

  const handleDeleteParent = (parentId: number) => {
    deleteParentMutation.mutate(parentId, {
      onSuccess: () => {
        toast.success('Parent deleted successfully!');
      },
      onError: () => {
        toast.error('Failed to delete parent');
      }
    });
  };

  const handleExport = (format: ExportFormat) => {
    if (parents.length === 0) {
      toast.error('No parents available to export');
      return;
    }

    try {
      const filename = `parents_${filters.status === 'all' ? 'all_status' : filters.status}`;
      switch (format) {
        case 'csv':
          exportToCSV(parents, filename);
          toast.success(`Exported ${parents.length} parents as CSV`);
          break;
        case 'excel':
          exportToExcel(parents, filename);
          toast.success(`Exported ${parents.length} parents as Excel`);
          break;
        case 'pdf':
          exportToPDF(parents, filename);
          toast.success(`Exported ${parents.length} parents as PDF`);
          break;
        default:
          toast.error('Unsupported export format');
      }
    } catch (error) {
      toast.error('Failed to export parents. Please try again.');
      console.error('Export error:', error);
    }
  };

  const downloadTemplate = () => {
    const templateHeaders = [
      'name',
      'email',
      'phone',
      'children'
    ];
    
    const templateContent = [templateHeaders.join(',')].join('\n');
    const blob = new Blob([templateContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'parent_upload_template.csv';
    link.click();
    URL.revokeObjectURL(link.href);
    toast.success('Template downloaded successfully!');
  };

  const handleBulkUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Implement bulk upload logic here
      console.log('Bulk upload:', file);
      toast.success('Bulk upload initiated!');
      setIsBulkUploadDialogOpen(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <div>Loading parents...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Parents Management</h1>
            <p className="text-muted-foreground">Manage all parents and their associations</p>
          </div>
          <div className="flex space-x-4">
            <Button variant="outline" onClick={() => setIsBulkUploadDialogOpen(true)} className='dark:text-white dark:border-white'>
              <Upload className="h-4 w-4 mr-2" />
              Bulk Upload
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className='dark:border-white dark:text-white'>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem 
                  onClick={() => handleExport('csv')}
                  className="flex items-center space-x-2"
                >
                  <Sheet className="h-4 w-4" />
                  <span>Export as CSV</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleExport('excel')}
                  className="flex items-center space-x-2"
                >
                  <FileDown className="h-4 w-4" />
                  <span>Export as Excel</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleExport('pdf')}
                  className="flex items-center space-x-2"
                >
                  <FileText className="h-4 w-4" />
                  <span>Export as PDF</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Parent
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search parents by name, email, or child name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select 
                value={filters.status} 
                onValueChange={(value) => setFilters(prev => ({...prev, status: value}))}
              >
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-muted-foreground">
                {parents.length} parents found
              </div>
              <div className="text-sm">
                Showing: {filters.status === 'all' ? 'All status' : filters.status}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Parents Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Parents</CardTitle>
            <CardDescription>{parents.length} parents in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Children</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {parents.map((parent) => (
                  <TableRow key={parent.id}>
                    <TableCell className="font-medium">{parent.name}</TableCell>
                    <TableCell>
                      <div>
                        <div className="text-sm">{parent.email}</div>
                        <div className="text-sm text-muted-foreground">{parent.phone}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {parent.children.map((child, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {child}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={parent.status === 'active' ? 'default' : 'secondary'}>
                        {parent.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteParent(parent.id)}
                          className='dark:text-white dark:border-white'
                          disabled={deleteParentMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Create Parent Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Parent</DialogTitle>
              <DialogDescription>
                Enter the parent's details to add them to the system.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={newParent.name}
                  onChange={(e) => setNewParent({...newParent, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newParent.email}
                  onChange={(e) => setNewParent({...newParent, email: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={newParent.phone}
                  onChange={(e) => setNewParent({...newParent, phone: e.target.value})}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-4 mt-6">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleCreateParent}
                disabled={createParentMutation.isPending}
              >
                {createParentMutation.isPending ? 'Adding...' : 'Add Parent'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Bulk Upload Dialog */}
        <Dialog open={isBulkUploadDialogOpen} onOpenChange={setIsBulkUploadDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Bulk Upload Parents</DialogTitle>
              <DialogDescription>
                Download the template, fill it with parent data, and upload it here.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="text-center p-6 border-2 border-dashed rounded-lg">
                <Download className="h-8 w-8 mx-auto mb-4 text-blue-500" />
                <h3 className="font-semibold mb-2">Download Template</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Use this template to ensure your data is formatted correctly
                </p>
                <Button onClick={downloadTemplate}>
                  <Download className="h-4 w-4 mr-2" />
                  Download CSV Template
                </Button>
              </div>

              <div className="space-y-2">
                <Label>Upload Filled Template</Label>
                <Input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleBulkUpload}
                />
                <p className="text-sm text-muted-foreground">
                  Supported formats: CSV, Excel (.xlsx, .xls)
                </p>
              </div>
            </div>
            <div className="flex justify-end space-x-4 mt-6">
              <Button variant="outline" onClick={() => setIsBulkUploadDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}