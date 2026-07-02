'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Shadcn components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { 
  User,
  Bell,
  Shield,
  Settings as SettingsIcon,
  Mail,
  Phone,
  Calendar,
  Globe,
  Monitor,
  Download,
  LogOut,
  Key,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle
} from 'lucide-react';

// Import hooks
import { useTeacherQueries } from '@/hooks/useTeacherQueries';

// Validation schemas
const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  department: z.string().min(1, 'Department is required'),
  title: z.string().optional(),
  bio: z.string().optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Please confirm your password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

const TeacherSettingsPage: React.FC = () => {
  const teacherId = 1; // This should come from your auth context
  const [activeTab, setActiveTab] = useState('profile');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Queries
  const { 
    useProfile, 
    useNotificationSettings, 
    useSecuritySettings, 
    usePreferences,
    useUpdateProfile,
    useUpdateNotificationSettings,
    useUpdatePreferences,
    useChangePassword
  } = useTeacherQueries();

  const profileQuery = useProfile(teacherId);
  const notificationQuery = useNotificationSettings(teacherId);
  const securityQuery = useSecuritySettings(teacherId);
  const preferencesQuery = usePreferences(teacherId);

  // Mutations
  const updateProfileMutation = useUpdateProfile();
  const updateNotificationsMutation = useUpdateNotificationSettings();
  const updatePreferencesMutation = useUpdatePreferences();
  const changePasswordMutation = useChangePassword();

  // Forms - FIXED: Use profileQuery.data directly (not .data.data)
  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    values: profileQuery.data ? {
      firstName: profileQuery.data.firstName || '',
      lastName: profileQuery.data.lastName || '',
      email: profileQuery.data.email || '',
      phone: profileQuery.data.phone || '',
      department: profileQuery.data.department || '',
      title: profileQuery.data.title || '',
      bio: profileQuery.data.bio || '',
    } : undefined
  });

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  // Handlers
  const onProfileSubmit = async (data: ProfileFormData) => {
    try {
      await updateProfileMutation.mutateAsync({ teacherId, data });
    } catch (error) {
      // Error handled by mutation
    }
  };

  const onPasswordSubmit = async (data: PasswordFormData) => {
    try {
      await changePasswordMutation.mutateAsync({ teacherId, data });
      passwordForm.reset();
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleNotificationChange = async (key: string, value: boolean) => {
    if (!notificationQuery.data) return;

    const updatedSettings = {
      ...notificationQuery.data,
      [key]: value
    };

    try {
      await updateNotificationsMutation.mutateAsync({ teacherId, data: updatedSettings });
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handlePreferenceChange = async (key: string, value: any) => {
    if (!preferencesQuery.data) return;

    const updatedPreferences = {
      ...preferencesQuery.data,
      [key]: value
    };

    try {
      await updatePreferencesMutation.mutateAsync({ teacherId, data: updatedPreferences });
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleTerminateSession = (sessionId: string) => {
    toast.success('Session terminated successfully');
  };

  const handleExportData = () => {
    toast.success('Data export started. You will receive an email when it\'s ready.');
  };

  const handleDeleteAccount = () => {
    toast.error('Account deletion requires additional verification');
  };

  if (profileQuery.isLoading || notificationQuery.isLoading || securityQuery.isLoading || preferencesQuery.isLoading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    );
  }

  if (profileQuery.error) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Error Loading Profile</h3>
          <p className="text-muted-foreground mb-4">
            {profileQuery.error.message || 'Failed to load profile data'}
          </p>
          <Button onClick={() => profileQuery.refetch()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const profile = profileQuery.data;
  const notifications = notificationQuery.data;
  const security = securityQuery.data;
  const preferences = preferencesQuery.data;

  // Fallback data if API returns null/undefined
  const safeProfile = profile || {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: '',
    title: '',
    bio: '',
    profileImage: '',
    createdAt: '',
    updatedAt: ''
  };

  const safeNotifications = notifications || {
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    assessmentReminders: true,
    attendanceAlerts: true,
    parentMessages: true,
    systemUpdates: true
  };

  const safePreferences = preferences || {
    language: 'en',
    timezone: 'Africa/Lagos',
    dateFormat: 'DD/MM/YYYY',
    theme: 'system' as const,
    defaultView: 'dashboard',
    exportFormat: 'pdf',
    autoSave: true
  };

  const safeSecurity = security || {
    twoFactorEnabled: false,
    activeSessions: [
      {
        id: '1',
        device: 'Chrome on Windows',
        browser: 'Chrome',
        location: 'Lagos, Nigeria',
        ipAddress: '192.168.1.1',
        lastActive: new Date().toISOString()
      }
    ]
  };

  return (
    <div className="min-h-screen p-6 bg-background">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-2">
            <div className="p-3 bg-primary rounded-2xl">
              <SettingsIcon className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">Settings</h1>
              <p className="text-muted-foreground text-lg">Manage your account preferences and settings</p>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>Profile</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center space-x-2">
              <Bell className="h-4 w-4" />
              <span>Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center space-x-2">
              <SettingsIcon className="h-4 w-4" />
              <span>Preferences</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>Security</span>
            </TabsTrigger>
            <TabsTrigger value="account" className="flex items-center space-x-2">
              <Key className="h-4 w-4" />
              <span>Account</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Profile Information</CardTitle>
                <CardDescription>
                  Update your personal information and how others see you on the platform
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-6">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={safeProfile.profileImage} />
                    <AvatarFallback className="text-lg">
                      {safeProfile.firstName?.[0]}{safeProfile.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Button variant="outline">Change Avatar</Button>
                    <p className="text-sm text-muted-foreground mt-2">
                      JPG, GIF or PNG. Max size 2MB.
                    </p>
                  </div>
                </div>

                <Separator />

                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        {...profileForm.register('firstName')}
                        placeholder="Enter your first name"
                      />
                      {profileForm.formState.errors.firstName && (
                        <p className="text-red-500 text-sm mt-1">{profileForm.formState.errors.firstName.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        {...profileForm.register('lastName')}
                        placeholder="Enter your last name"
                      />
                      {profileForm.formState.errors.lastName && (
                        <p className="text-red-500 text-sm mt-1">{profileForm.formState.errors.lastName.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        {...profileForm.register('email')}
                        placeholder="Enter your email"
                      />
                      {profileForm.formState.errors.email && (
                        <p className="text-red-500 text-sm mt-1">{profileForm.formState.errors.email.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        {...profileForm.register('phone')}
                        placeholder="Enter your phone number"
                      />
                      {profileForm.formState.errors.phone && (
                        <p className="text-red-500 text-sm mt-1">{profileForm.formState.errors.phone.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="department">Department</Label>
                      <Input
                        id="department"
                        {...profileForm.register('department')}
                        placeholder="Enter your department"
                      />
                      {profileForm.formState.errors.department && (
                        <p className="text-red-500 text-sm mt-1">{profileForm.formState.errors.department.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        {...profileForm.register('title')}
                        placeholder="Enter your title (e.g., Senior Teacher)"
                      />
                      {profileForm.formState.errors.title && (
                        <p className="text-red-500 text-sm mt-1">{profileForm.formState.errors.title.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      {...profileForm.register('bio')}
                      placeholder="Tell us about yourself..."
                      className="min-h-[100px]"
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Member since {new Date(safeProfile.createdAt).toLocaleDateString()}
                      </p>
                      {safeProfile.updatedAt && (
                        <p className="text-sm text-muted-foreground">
                          Last updated {new Date(safeProfile.updatedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <Button 
                      type="submit" 
                      disabled={updateProfileMutation.isPending}
                    >
                      {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Notification Preferences</CardTitle>
                <CardDescription>
                  Choose how you want to be notified about different activities
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Notification Channels</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="email-notifications">Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications via email
                        </p>
                      </div>
                      <Switch
                        id="email-notifications"
                        checked={safeNotifications.emailNotifications}
                        onCheckedChange={(checked) => 
                          handleNotificationChange('emailNotifications', checked)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="push-notifications">Push Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive push notifications on your devices
                        </p>
                      </div>
                      <Switch
                        id="push-notifications"
                        checked={safeNotifications.pushNotifications}
                        onCheckedChange={(checked) => 
                          handleNotificationChange('pushNotifications', checked)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="assessment-reminders">Assessment Reminders</Label>
                        <p className="text-sm text-muted-foreground">
                          Reminders for upcoming assessments and deadlines
                        </p>
                      </div>
                      <Switch
                        id="assessment-reminders"
                        checked={safeNotifications.assessmentReminders}
                        onCheckedChange={(checked) => 
                          handleNotificationChange('assessmentReminders', checked)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="attendance-alerts">Attendance Alerts</Label>
                        <p className="text-sm text-muted-foreground">
                          Alerts for student attendance patterns
                        </p>
                      </div>
                      <Switch
                        id="attendance-alerts"
                        checked={safeNotifications.attendanceAlerts}
                        onCheckedChange={(checked) => 
                          handleNotificationChange('attendanceAlerts', checked)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="message-notifications">Message Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Notifications when you receive messages
                        </p>
                      </div>
                     
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Application Preferences</CardTitle>
                <CardDescription>
                  Customize your experience and how the application behaves
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="theme">Theme</Label>
                    <Select
                      value={safePreferences.theme}
                      onValueChange={(value: 'light' | 'dark' | 'system') => 
                        handlePreferenceChange('theme', value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select
                      value={safePreferences.language}
                      onValueChange={(value) => handlePreferenceChange('language', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select
                      value={safePreferences.timezone}
                      onValueChange={(value) => handlePreferenceChange('timezone', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Africa/Lagos">West Africa Time (WAT)</SelectItem>
                        <SelectItem value="UTC">UTC</SelectItem>
                        <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date-format">Date Format</Label>
                    <Select
                      value={safePreferences.dateFormat}
                      onValueChange={(value) => handlePreferenceChange('dateFormat', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notifications-enabled">Enable Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive system notifications
                    </p>
                  </div>
                  
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <div className="space-y-6">
              {/* Password Change */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-bold">Change Password</CardTitle>
                  <CardDescription>
                    Update your password to keep your account secure
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <div className="relative">
                        <Input
                          id="current-password"
                          type={showCurrentPassword ? "text" : "password"}
                          {...passwordForm.register('currentPassword')}
                          placeholder="Enter current password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        >
                          {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      {passwordForm.formState.errors.currentPassword && (
                        <p className="text-red-500 text-sm">{passwordForm.formState.errors.currentPassword.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <div className="relative">
                        <Input
                          id="new-password"
                          type={showNewPassword ? "text" : "password"}
                          {...passwordForm.register('newPassword')}
                          placeholder="Enter new password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      {passwordForm.formState.errors.newPassword && (
                        <p className="text-red-500 text-sm">{passwordForm.formState.errors.newPassword.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <div className="relative">
                        <Input
                          id="confirm-password"
                          type={showConfirmPassword ? "text" : "password"}
                          {...passwordForm.register('confirmPassword')}
                          placeholder="Confirm new password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      {passwordForm.formState.errors.confirmPassword && (
                        <p className="text-red-500 text-sm">{passwordForm.formState.errors.confirmPassword.message}</p>
                      )}
                    </div>

                    <Button 
                      type="submit" 
                      disabled={changePasswordMutation.isPending}
                      className="w-full"
                    >
                      {changePasswordMutation.isPending ? 'Changing Password...' : 'Change Password'}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Two-Factor Authentication */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-bold">Two-Factor Authentication</CardTitle>
                  <CardDescription>
                    Add an extra layer of security to your account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="2fa">Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">
                        {safeSecurity.twoFactorEnabled 
                          ? '2FA is currently enabled on your account'
                          : 'Enable 2FA for enhanced security'
                        }
                      </p>
                    </div>
                    <Switch
                      id="2fa"
                      checked={safeSecurity.twoFactorEnabled}
                      onCheckedChange={(checked) => toast.info('2FA settings would be updated')}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Active Sessions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-bold">Active Sessions</CardTitle>
                  <CardDescription>
                    Manage your active login sessions across devices
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {safeSecurity.activeSessions?.map((session:any) => (
                      <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{session.device}</span>
                            <Badge variant="outline" className="text-xs">
                              {session.browser}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {session.location} • {session.ipAddress}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Last active: {new Date(session.lastActive).toLocaleString()}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleTerminateSession(session.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Terminate
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Account Tab */}
          <TabsContent value="account">
            <div className="space-y-6">
              {/* Data Export */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-bold">Data Export</CardTitle>
                  <CardDescription>
                    Download a copy of your personal data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      You can request an export of all your personal data stored on our platform. 
                      This includes your profile information, classes, assessments, and student data.
                    </p>
                    <Button onClick={handleExportData} className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Request Data Export
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Account Deletion */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-red-600">Delete Account</CardTitle>
                  <CardDescription>
                    Permanently delete your account and all associated data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      This action cannot be undone. All your data, including classes, assessments, 
                      and student records will be permanently deleted.
                    </p>
                    <Button 
                      variant="destructive" 
                      onClick={handleDeleteAccount}
                      className="w-full"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TeacherSettingsPage;