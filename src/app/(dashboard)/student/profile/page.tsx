// app/student/profile/page.tsx
'use client'
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useStudentQueries } from '@/hooks/useStudentQueries';
import {
  User,
  Save,
  Eye,
  EyeOff,
  Download,
  Mail,
  Phone,
  MapPin,
  Globe,
  Calendar,
  Shield,
  Loader2,
  AlertCircle,
  Edit,
  Camera
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  // All hooks at the top
  const { useProfile, useUpdateProfile, useChangePassword, useExportData } = useStudentQueries();
  const { data: profileResponse, isLoading, error, refetch } = useProfile();
  const updateProfileMutation = useUpdateProfile();
  const changePasswordMutation = useChangePassword();
  const exportDataMutation = useExportData();

  const [profileData, setProfileData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    username: '',
    address: '',
    state: '',
    country: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Set mounted state
  useEffect(() => {
    setMounted(true);
  }, []);

  // Initialize form data when profile is loaded
  useEffect(() => {
    if (profileResponse?.data) {
      const data = profileResponse.data;
      setProfileData({
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        email: data.email || '',
        phone: data.phone || '',
        username: data.username || '',
        address: data.address || '',
        state: data.state || '',
        country: data.country || ''
      });
    }
  }, [profileResponse]);

  const handleUpdateProfile = () => {
    updateProfileMutation.mutate(profileData, {
      onSuccess: () => {
        refetch();
        setIsEditing(false);
        toast.success('Profile updated successfully');
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to update profile');
      }
    });
  };

  const handlePasswordChange = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    changePasswordMutation.mutate({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword
    }, {
      onSuccess: () => {
        toast.success('Password changed successfully');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to change password');
      }
    });
  };

  const handleExportData = () => {
    exportDataMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success('Data export initiated. You will receive an email with download link.');
      }
    });
  };

  if (isLoading || !mounted) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
              <div>Loading profile information...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Error loading profile</h3>
            <p className="text-muted-foreground">Please try again later</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const profile = profileResponse?.data;
  const fullName = profile ? `${profile.first_name} ${profile.last_name}` : 'Student';
  const initials = fullName.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">My Profile</h1>
              <p className="text-lg text-muted-foreground">Manage your personal information and account settings</p>
            </div>
            <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
              <Edit className="h-4 w-4 mr-2" />
              {isEditing ? 'Cancel Editing' : 'Edit Profile'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Overview */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-4">
                    <Avatar className="h-32 w-32">
                      <AvatarFallback className="text-3xl">{initials}</AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <Button 
                        size="sm" 
                        className="absolute bottom-0 right-0 rounded-full"
                        variant="secondary"
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <h2 className="text-2xl font-bold mb-1">{fullName}</h2>
                  <p className="text-muted-foreground mb-4">{profile?.email}</p>
                  <Badge variant="default" className="capitalize mb-4">
                    {profile?.enrollment_status || 'Active'} Student
                  </Badge>
                  
                  <Separator className="my-4" />
                  
                  <div className="w-full space-y-3 text-left">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{profile?.email}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{profile?.phone || 'Not provided'}</span>
                    </div>
                    {profile?.address && (
                      <div className="flex items-center space-x-3">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{profile.address}</span>
                      </div>
                    )}
                    {profile?.country && (
                      <div className="flex items-center space-x-3">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{profile.country}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Account Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Account Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">Student ID</div>
                  <div className="font-semibold font-mono">{profile?.admission_no || 'Not assigned'}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">Enrollment Date</div>
                  <div className="font-semibold">
                    {profile?.registration_date 
                      ? new Date(profile.registration_date).toLocaleDateString()
                      : 'Not available'
                    }
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">Account Status</div>
                  <Badge variant="default" className="capitalize">
                    {profile?.enrollment_status || 'Active'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Form */}
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Update your personal details. Changes will be reflected across the platform.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first_name">First Name *</Label>
                    <Input
                      id="first_name"
                      value={profileData.first_name}
                      onChange={(e) => setProfileData({...profileData, first_name: e.target.value})}
                      disabled={!isEditing || updateProfileMutation.isPending}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_name">Last Name *</Label>
                    <Input
                      id="last_name"
                      value={profileData.last_name}
                      onChange={(e) => setProfileData({...profileData, last_name: e.target.value})}
                      disabled={!isEditing || updateProfileMutation.isPending}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      disabled={!isEditing || updateProfileMutation.isPending}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      disabled={!isEditing || updateProfileMutation.isPending}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={profileData.username}
                      onChange={(e) => setProfileData({...profileData, username: e.target.value})}
                      disabled={!isEditing || updateProfileMutation.isPending}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={profileData.country}
                      onChange={(e) => setProfileData({...profileData, country: e.target.value})}
                      disabled={!isEditing || updateProfileMutation.isPending}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={profileData.address}
                    onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                    disabled={!isEditing || updateProfileMutation.isPending}
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={profileData.state}
                      onChange={(e) => setProfileData({...profileData, state: e.target.value})}
                      disabled={!isEditing || updateProfileMutation.isPending}
                    />
                  </div>
                </div>

                {isEditing && (
                  <Button 
                    onClick={handleUpdateProfile}
                    disabled={updateProfileMutation.isPending}
                    className="w-full"
                  >
                    {updateProfileMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Password Change */}
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Update your account password for security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showPassword ? "text" : "password"}
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                      disabled={changePasswordMutation.isPending}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={changePasswordMutation.isPending}
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
                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                    disabled={changePasswordMutation.isPending}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                    disabled={changePasswordMutation.isPending}
                  />
                </div>
                <Button 
                  onClick={handlePasswordChange}
                  disabled={changePasswordMutation.isPending}
                  variant="outline"
                >
                  {changePasswordMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Changing Password...
                    </>
                  ) : (
                    'Change Password'
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Data Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Data Management</span>
                </CardTitle>
                <CardDescription>Manage your personal data and privacy</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={handleExportData}
                    disabled={exportDataMutation.isPending}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {exportDataMutation.isPending ? 'Exporting...' : 'Export My Data'}
                  </Button>
                  <p className="text-sm text-muted-foreground px-2">
                    Download all your personal data in a readable format.
                  </p>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                    <Shield className="h-4 w-4 mr-2" />
                    Request Account Deletion
                  </Button>
                  <p className="text-sm text-muted-foreground px-2">
                    Permanently delete your account and all associated data.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Meta Information (if available) */}
            {profile?.meta && (
              <Card>
                <CardHeader>
                  <CardTitle>Additional Information</CardTitle>
                  <CardDescription>System metadata and additional details</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted rounded-lg p-4">
                    <pre className="whitespace-pre-wrap text-xs font-mono overflow-auto max-h-60">
                      {JSON.stringify(profile.meta, null, 2)}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;