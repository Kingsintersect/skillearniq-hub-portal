
'use client'
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    schoolName: 'Excel Comprehensive College',
    academicYear: '2025-2026',
    currentTerm: '1st',
    address: '123 Education Street, Knowledge City',
    phone: '+1 (555) 123-4567',
    email: 'admin@excelcollege.edu',
    website: 'www.excelcollege.edu'
  });

  const [systemConfig, setSystemConfig] = useState({
    gradingSystem: 'percentage',
    attendanceTracking: 'daily',
    resultPublication: 'immediate',
    parentAccess: 'enabled',
    autoPromotion: true,
    enableSmsNotifications: true,
    enableEmailReports: true,
    lateFeePercentage: 5,
    maxAbsenceDays: 15
  });

  const handleSaveSettings = () => {
    // Simulate API call
    setTimeout(() => {
      toast.success('Settings saved successfully');
    }, 1000);
  };

  const handleResetSettings = () => {
    setSettings({
      schoolName: 'Excel Comprehensive College',
      academicYear: '2025-2026',
      currentTerm: '1st',
      address: '123 Education Street, Knowledge City',
      phone: '+1 (555) 123-4567',
      email: 'admin@excelcollege.edu',
      website: 'www.excelcollege.edu'
    });
    setSystemConfig({
      gradingSystem: 'percentage',
      attendanceTracking: 'daily',
      resultPublication: 'immediate',
      parentAccess: 'enabled',
      autoPromotion: true,
      enableSmsNotifications: true,
      enableEmailReports: true,
      lateFeePercentage: 5,
      maxAbsenceDays: 15
    });
    toast.info('Settings reset to default values');
  };

  const handleSystemConfigChange = (key: string, value: any) => {
    setSystemConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Admin Settings</h1>
          <p className="text-muted-foreground">Manage school settings and configuration</p>
        </div>

        {/* School Information */}
        <Card>
          <CardHeader>
            <CardTitle>School Information</CardTitle>
            <CardDescription>Update basic school details and contact information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="schoolName">School Name</Label>
                <Input
                  id="schoolName"
                  value={settings.schoolName}
                  onChange={(e) => setSettings({...settings, schoolName: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="academicYear">Academic Year</Label>
                <Select 
                  value={settings.academicYear} 
                  onValueChange={(value) => setSettings({...settings, academicYear: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2023-2024">2023-2024</SelectItem>
                    <SelectItem value="2024-2025">2024-2025</SelectItem>
                    <SelectItem value="2025-2026">2025-2026</SelectItem>
                    <SelectItem value="2026-2027">2026-2027</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="currentTerm">Current Term</Label>
                <Select 
                  value={settings.currentTerm} 
                  onValueChange={(value) => setSettings({...settings, currentTerm: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1st">1st Term</SelectItem>
                    <SelectItem value="2nd">2nd Term</SelectItem>
                    <SelectItem value="3rd">3rd Term</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={settings.phone}
                  onChange={(e) => setSettings({...settings, phone: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">School Address</Label>
              <Textarea
                id="address"
                value={settings.address}
                onChange={(e) => setSettings({...settings, address: e.target.value})}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({...settings, email: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={settings.website}
                  onChange={(e) => setSettings({...settings, website: e.target.value})}
                  placeholder="https://example.com"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Configuration */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>System Configuration</CardTitle>
            <CardDescription>Manage system-wide settings and preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Grading System</Label>
                <Select 
                  value={systemConfig.gradingSystem} 
                  onValueChange={(value) => handleSystemConfigChange('gradingSystem', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="letter">Letter Grade</SelectItem>
                    <SelectItem value="gpa">GPA Scale</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Attendance Tracking</Label>
                <Select 
                  value={systemConfig.attendanceTracking} 
                  onValueChange={(value) => handleSystemConfigChange('attendanceTracking', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="period">Per Period</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Result Publication</Label>
                <Select 
                  value={systemConfig.resultPublication} 
                  onValueChange={(value) => handleSystemConfigChange('resultPublication', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Immediate</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="manual">Manual Approval</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Parent Access</Label>
                <Select 
                  value={systemConfig.parentAccess} 
                  onValueChange={(value) => handleSystemConfigChange('parentAccess', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="enabled">Enabled</SelectItem>
                    <SelectItem value="restricted">Restricted</SelectItem>
                    <SelectItem value="disabled">Disabled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Toggle Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center justify-between space-x-4 p-4 border rounded-lg">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-promotion">Auto Promotion</Label>
                  <div className="text-sm text-muted-foreground">
                    Automatically promote students to next class
                  </div>
                </div>
                <Switch
                  id="auto-promotion"
                  checked={systemConfig.autoPromotion}
                  onCheckedChange={(checked) => handleSystemConfigChange('autoPromotion', checked)}
                />
              </div>

              <div className="flex items-center justify-between space-x-4 p-4 border rounded-lg">
                <div className="space-y-0.5">
                  <Label htmlFor="sms-notifications">SMS Notifications</Label>
                  <div className="text-sm text-muted-foreground">
                    Send SMS alerts to parents and staff
                  </div>
                </div>
                <Switch
                  id="sms-notifications"
                  checked={systemConfig.enableSmsNotifications}
                  onCheckedChange={(checked) => handleSystemConfigChange('enableSmsNotifications', checked)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center justify-between space-x-4 p-4 border rounded-lg">
                <div className="space-y-0.5">
                  <Label htmlFor="email-reports">Email Reports</Label>
                  <div className="text-sm text-muted-foreground">
                    Automatically email reports to parents
                  </div>
                </div>
                <Switch
                  id="email-reports"
                  checked={systemConfig.enableEmailReports}
                  onCheckedChange={(checked) => handleSystemConfigChange('enableEmailReports', checked)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="late-fee">Late Fee Percentage</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="late-fee"
                    type="number"
                    min="0"
                    max="50"
                    value={systemConfig.lateFeePercentage}
                    onChange={(e) => handleSystemConfigChange('lateFeePercentage', parseInt(e.target.value) || 0)}
                    className="w-20"
                  />
                  <span className="text-sm text-muted-foreground">%</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="max-absence">Maximum Absence Days</Label>
                <Input
                  id="max-absence"
                  type="number"
                  min="1"
                  max="365"
                  value={systemConfig.maxAbsenceDays}
                  onChange={(e) => handleSystemConfigChange('maxAbsenceDays', parseInt(e.target.value) || 1)}
                  className="w-32"
                />
                <div className="text-sm text-muted-foreground">
                  Days before automatic suspension
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="mt-6 border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>
              Critical actions that cannot be undone
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg">
              <div>
                <div className="font-semibold">Reset All Data</div>
                <div className="text-sm text-muted-foreground">
                  Permanently delete all student, teacher, and parent data
                </div>
              </div>
              <Button variant="destructive" onClick={() => toast.error('This action is disabled in demo mode')}>
                Reset Data
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg">
              <div>
                <div className="font-semibold">Archive Academic Year</div>
                <div className="text-sm text-muted-foreground">
                  Archive current year and prepare for new academic year
                </div>
              </div>
              <Button variant="outline" onClick={() => toast.info('Academic year archiving feature')}>
                Archive Year
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between space-x-4 mt-6">
          <Button variant="outline" onClick={handleResetSettings}>
            Reset to Defaults
          </Button>
          <div className="flex space-x-4">
            <Button variant="outline">Cancel</Button>
            <Button onClick={handleSaveSettings}>Save Settings</Button>
          </div>
        </div>
      </div>
    </div>
  );
}