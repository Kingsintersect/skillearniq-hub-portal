'use client'
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  Settings, 
  Bell, 
  Shield, 
  Palette, 
  User, 
  Mail, 
  Phone,
  Save,
  RotateCcw,
  Eye,
  EyeOff,
  Download,
  Upload
} from 'lucide-react';
import { useStudentQueries } from '@/hooks/useStudentQueries';

export const StudentSettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'privacy' | 'appearance'>('profile');
  const [showPassword, setShowPassword] = useState(false);

  const { useSettings, useUpdateSettings, useUpdateProfile, useChangePassword, useExportData } = useStudentQueries();
  const { data: settingsResponse, isLoading, error } = useSettings();
  const updateSettingsMutation = useUpdateSettings();
  const updateProfileMutation = useUpdateProfile();
  const changePasswordMutation = useChangePassword();
  const exportDataMutation = useExportData();

  const settingsData = settingsResponse?.data;
  const { profile, notifications, privacy, appearance } = settingsData || {};

  // Form states
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    avatar: ''
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    assignmentReminders: true,
    gradeAlerts: true,
    studyGroupUpdates: true,
    eventReminders: false
  });

  const [privacySettings, setPrivacySettings] = useState({
    showProfile: true,
    showGrades: false,
    showAttendance: true,
    leaderboardVisibility: true,
    allowMessages: true,
    dataSharing: false
  });

  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: 'system',
    fontSize: 'medium',
    density: 'comfortable',
    reducedMotion: false
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Initialize form data when settings are loaded
  React.useEffect(() => {
    if (profile) {
      setProfileData({
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        bio: profile.bio || '',
        avatar: profile.avatar || ''
      });
    }
    if (notifications) {
      setNotificationSettings(notifications);
    }
    if (privacy) {
      setPrivacySettings(privacy);
    }
    if (appearance) {
      setAppearanceSettings(appearance);
    }
  }, [profile, notifications, privacy, appearance]);

  const handleSaveSettings = () => {
    updateSettingsMutation.mutate({
      profile: profileData,
      notifications: notificationSettings,
      privacy: privacySettings,
      appearance: appearanceSettings
    });
  };

  const handleResetSettings = () => {
    if (profile) {
      setProfileData({
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        bio: profile.bio || '',
        avatar: profile.avatar || ''
      });
    }
    if (notifications) {
      setNotificationSettings(notifications);
    }
    if (privacy) {
      setPrivacySettings(privacy);
    }
    if (appearance) {
      setAppearanceSettings(appearance);
    }
    toast.info('Settings reset to defaults');
  };

  const handleExportData = () => {
    exportDataMutation.mutate();
  };

  const handleImportData = () => {
    toast.info('Data import functionality would be implemented here');
  };

  const handlePasswordChange = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    changePasswordMutation.mutate({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword
    });

    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const handleProfileUpdate = () => {
    updateProfileMutation.mutate(profileData);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <div>Loading settings...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <Card>
          <CardContent className="text-center py-12">
            <Settings className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Error Loading Settings</h3>
            <p className="text-muted-foreground">Failed to load settings data. Please try again later.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!settingsData) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <Card>
          <CardContent className="text-center py-12">
            <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Settings Available</h3>
            <p className="text-muted-foreground">Settings data is not available at the moment.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4">
            <Settings className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Settings</h1>
          <p className="text-lg text-muted-foreground">Manage your account preferences and settings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-4">
                <nav className="space-y-2">
                  <Button
                    variant={activeTab === 'profile' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setActiveTab('profile')}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Button>
                  <Button
                    variant={activeTab === 'notifications' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setActiveTab('notifications')}
                  >
                    <Bell className="h-4 w-4 mr-2" />
                    Notifications
                  </Button>
                  <Button
                    variant={activeTab === 'privacy' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setActiveTab('privacy')}
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Privacy
                  </Button>
                  <Button
                    variant={activeTab === 'appearance' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setActiveTab('appearance')}
                  >
                    <Palette className="h-4 w-4 mr-2" />
                    Appearance
                  </Button>
                </nav>

                <Separator className="my-4" />

                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" onClick={handleExportData}>
                    <Download className="h-4 w-4 mr-2" />
                    Export Data
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={handleImportData}>
                    <Upload className="h-4 w-4 mr-2" />
                    Import Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'profile' && (
              <ProfileSettings 
                profileData={profileData}
                onUpdate={setProfileData}
                studentProfile={profile}
                showPassword={showPassword}
                onShowPasswordChange={setShowPassword}
                passwordData={passwordData}
                onPasswordDataChange={setPasswordData}
                onChangePassword={handlePasswordChange}
                onUpdateProfile={handleProfileUpdate}
              />
            )}

            {activeTab === 'notifications' && (
              <NotificationSettings 
                notifications={notificationSettings}
                onUpdate={setNotificationSettings}
              />
            )}

            {activeTab === 'privacy' && (
              <PrivacySettings 
                privacy={privacySettings}
                onUpdate={setPrivacySettings}
              />
            )}

            {activeTab === 'appearance' && (
              <AppearanceSettings 
                appearance={appearanceSettings}
                onUpdate={setAppearanceSettings}
              />
            )}

            {/* Action Buttons */}
            <Card className="mt-6">
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <Button variant="outline" onClick={handleResetSettings}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset to Defaults
                  </Button>
                  <Button onClick={handleSaveSettings} disabled={updateSettingsMutation.isPending}>
                    <Save className="h-4 w-4 mr-2" />
                    {updateSettingsMutation.isPending ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

// Profile Settings Component
const ProfileSettings: React.FC<{
  profileData: any;
  onUpdate: (data: any) => void;
  studentProfile: any;
  showPassword: boolean;
  onShowPasswordChange: (show: boolean) => void;
  passwordData: any;
  onPasswordDataChange: (data: any) => void;
  onChangePassword: () => void;
  onUpdateProfile: () => void;
}> = ({ 
  profileData, 
  onUpdate, 
  studentProfile,
  showPassword, 
  onShowPasswordChange, 
  passwordData, 
  onPasswordDataChange, 
  onChangePassword,
  onUpdateProfile
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Settings</CardTitle>
        <CardDescription>Update your personal information and account details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Avatar Section */}
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={profileData.avatar} />
            <AvatarFallback>{(profileData.name || studentProfile?.name || '').split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div>
            <Button variant="outline">Change Avatar</Button>
            <p className="text-sm text-muted-foreground mt-1">JPG, GIF or PNG. Max size 2MB</p>
          </div>
        </div>

        {/* Personal Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={profileData.name}
              onChange={(e) => onUpdate({ ...profileData, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={profileData.email}
              onChange={(e) => onUpdate({ ...profileData, email: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={profileData.phone}
              onChange={(e) => onUpdate({ ...profileData, phone: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="grade">Grade/Class</Label>
            <Input
              id="grade"
              value={studentProfile?.grade || ''}
              disabled
            />
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            value={profileData.bio}
            onChange={(e) => onUpdate({ ...profileData, bio: e.target.value })}
            placeholder="Tell us about yourself..."
            rows={3}
          />
        </div>

        <Button onClick={onUpdateProfile}>
          Update Profile
        </Button>

        {/* Password Section */}
        <Separator />
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Change Password</h3>
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showPassword ? "text" : "password"}
                  value={passwordData.currentPassword}
                  onChange={(e) => onPasswordDataChange({ ...passwordData, currentPassword: e.target.value })}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => onShowPasswordChange(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type={showPassword ? "text" : "password"}
                value={passwordData.newPassword}
                onChange={(e) => onPasswordDataChange({ ...passwordData, newPassword: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                value={passwordData.confirmPassword}
                onChange={(e) => onPasswordDataChange({ ...passwordData, confirmPassword: e.target.value })}
              />
            </div>
          </div>
          <Button onClick={onChangePassword} variant="outline">
            Change Password
          </Button>
        </div>

        {/* Read-only Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="font-semibold">Student ID</div>
            <div className="text-muted-foreground">{studentProfile?.studentId}</div>
          </div>
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="font-semibold">Account Status</div>
            <Badge variant="default">Active</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Notification Settings Component
const NotificationSettings: React.FC<{
  notifications: any;
  onUpdate: (notifications: any) => void;
}> = ({ notifications, onUpdate }) => {
  const handleToggle = (key: string, value: boolean) => {
    onUpdate({ ...notifications, [key]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>Choose how you want to be notified about school activities</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {[
          { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive notifications via email' },
          { key: 'pushNotifications', label: 'Push Notifications', description: 'Browser push notifications' },
          { key: 'assignmentReminders', label: 'Assignment Reminders', description: 'Get reminded about upcoming assignments' },
          { key: 'gradeAlerts', label: 'Grade Alerts', description: 'Notify when new grades are posted' },
          { key: 'studyGroupUpdates', label: 'Study Group Updates', description: 'Updates from your study groups' },
          { key: 'eventReminders', label: 'Event Reminders', description: 'School events and calendar reminders' },
        ].map((item) => (
          <div key={item.key} className="flex items-center justify-between">
            <div>
              <Label htmlFor={item.key} className="font-medium">{item.label}</Label>
              <div className="text-sm text-muted-foreground">{item.description}</div>
            </div>
            <Switch
              id={item.key}
              checked={notifications[item.key as keyof typeof notifications]}
              onCheckedChange={(checked) => handleToggle(item.key, checked)}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

// Privacy Settings Component
const PrivacySettings: React.FC<{
  privacy: any;
  onUpdate: (privacy: any) => void;
}> = ({ privacy, onUpdate }) => {
  const handleToggle = (key: string, value: boolean) => {
    onUpdate({ ...privacy, [key]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Privacy & Security</CardTitle>
        <CardDescription>Control your privacy settings and data sharing preferences</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {[
          { key: 'showProfile', label: 'Show Public Profile', description: 'Allow others to view your basic profile information' },
          { key: 'showGrades', label: 'Show Grades Publicly', description: 'Display your grades to classmates (anonymously)' },
          { key: 'showAttendance', label: 'Show Attendance', description: 'Display attendance record to teachers' },
          { key: 'leaderboardVisibility', label: 'Leaderboard Visibility', description: 'Include me in class leaderboards' },
          { key: 'allowMessages', label: 'Allow Messages', description: 'Allow teachers and classmates to message you' },
          { key: 'dataSharing', label: 'Data Sharing for Research', description: 'Allow anonymous data to be used for educational research' },
        ].map((item) => (
          <div key={item.key} className="flex items-center justify-between">
            <div>
              <Label htmlFor={item.key} className="font-medium">{item.label}</Label>
              <div className="text-sm text-muted-foreground">{item.description}</div>
            </div>
            <Switch
              id={item.key}
              checked={privacy[item.key as keyof typeof privacy]}
              onCheckedChange={(checked) => handleToggle(item.key, checked)}
            />
          </div>
        ))}

        <Separator />

        <div>
          <h4 className="font-medium mb-2">Data Management</h4>
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              <Download className="h-4 w-4 mr-2" />
              Download Personal Data
            </Button>
            <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
              <Shield className="h-4 w-4 mr-2" />
              Delete Account Data
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Appearance Settings Component
const AppearanceSettings: React.FC<{
  appearance: any;
  onUpdate: (appearance: any) => void;
}> = ({ appearance, onUpdate }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
        <CardDescription>Customize how the application looks and feels</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Theme */}
        <div className="space-y-2">
          <Label htmlFor="theme">Theme</Label>
          <Select
            value={appearance.theme}
            onValueChange={(value) => onUpdate({ ...appearance, theme: value })}
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

        {/* Font Size */}
        <div className="space-y-2">
          <Label htmlFor="fontSize">Font Size</Label>
          <Select
            value={appearance.fontSize}
            onValueChange={(value) => onUpdate({ ...appearance, fontSize: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Small</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="large">Large</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Density */}
        <div className="space-y-2">
          <Label htmlFor="density">Density</Label>
          <Select
            value={appearance.density}
            onValueChange={(value) => onUpdate({ ...appearance, density: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="compact">Compact</SelectItem>
              <SelectItem value="comfortable">Comfortable</SelectItem>
              <SelectItem value="spacious">Spacious</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Accessibility */}
        <div className="space-y-4">
          <h4 className="font-medium">Accessibility</h4>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="reducedMotion" className="font-medium">Reduced Motion</Label>
              <div className="text-sm text-muted-foreground">Reduce animations and transitions</div>
            </div>
            <Switch
              id="reducedMotion"
              checked={appearance.reducedMotion}
              onCheckedChange={(checked) => onUpdate({ ...appearance, reducedMotion: checked })}
            />
          </div>
        </div>

        {/* Preview */}
        <Separator />
        <div>
          <h4 className="font-medium mb-2">Preview</h4>
          <div className="p-4 border rounded-lg bg-muted/50">
            <p className="text-sm">This is how text will appear with your current settings.</p>
            <div className="mt-2 text-xs text-muted-foreground">
              Font size: {appearance.fontSize} • Density: {appearance.density}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentSettingsPage;