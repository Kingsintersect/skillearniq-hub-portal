'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Info } from 'lucide-react';
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
  Camera,
  GraduationCap,
  BookOpen,
  Building2,
  Clock
} from 'lucide-react';

// Dashboard Card Component
interface DashboardCardProps {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  action?: React.ReactNode;
}

function DashboardCard({ title, subtitle, icon, action, children }: DashboardCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28 }}
      className="rounded-3xl border border-border/70 bg-card/95 p-5 shadow-sm backdrop-blur-sm"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-card-foreground">{title}</p>
          {subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          {icon}
        </div>
      </div>
      {children}
      {action && <div className="mt-4">{action}</div>}
    </motion.div>
  );
}

function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border/70 bg-background/60 px-3 py-2">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}

export default function ProfilePage() {
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

  useEffect(() => {
    setMounted(true);
  }, []);

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
      <div className="space-y-6 p-4 md:p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <div className="text-lg text-muted-foreground">Loading profile information...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center max-w-md">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <div className="text-lg text-foreground">Error loading profile</div>
            <p className="text-sm text-muted-foreground mt-2">Please try again later</p>
            <Button onClick={() => window.location.reload()} variant="outline" className="mt-4">
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
    <div className="space-y-6 p-4 md:p-6">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="overflow-hidden rounded-3xl border border-primary/20 bg-linear-to-br from-primary/15 via-background to-blue-500/10 p-6"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Account Settings</p>
            <h1 className="mt-2 text-2xl font-bold text-foreground sm:text-3xl">My Profile</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Manage your personal information, account settings, and privacy preferences.
            </p>
          </div>
          <Button onClick={() => setIsEditing(!isEditing)} variant="outline" className="gap-2">
            <Edit size={16} />
            {isEditing ? 'Cancel Editing' : 'Edit Profile'}
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-4">
          <StatPill label="Student ID" value={profile?.admission_no || 'Not assigned'} />
          <StatPill label="Enrollment Status" value={profile?.enrollment_status || 'Active'} />
          <StatPill label="Email" value={profile?.email || 'Not provided'} />
          <StatPill label="Phone" value={profile?.phone || 'Not provided'} />
        </div>
      </motion.section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Overview */}
        <div className="space-y-6">
          {/* Profile Card */}
          <DashboardCard
            title="Profile Overview"
            subtitle="Your personal information"
            icon={<User size={18} />}
          >
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-4">
                <Avatar className="h-24 w-24 border-2 border-primary/20">
                  <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button 
                    size="sm" 
                    className="absolute bottom-0 right-0 rounded-full h-8 w-8 p-0"
                    variant="secondary"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <h2 className="text-xl font-bold text-foreground">{fullName}</h2>
              <Badge variant="default" className="mt-2 capitalize">
                {profile?.enrollment_status || 'Active'} Student
              </Badge>
              
              <Separator className="my-4" />
              
              <div className="w-full space-y-3 text-left">
                <div className="flex items-center gap-3">
                  <Mail size={14} className="text-muted-foreground" />
                  <span className="text-sm">{profile?.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={14} className="text-muted-foreground" />
                  <span className="text-sm">{profile?.phone || 'Not provided'}</span>
                </div>
                {profile?.address && (
                  <div className="flex items-center gap-3">
                    <MapPin size={14} className="text-muted-foreground" />
                    <span className="text-sm">{profile.address}</span>
                  </div>
                )}
                {profile?.country && (
                  <div className="flex items-center gap-3">
                    <Globe size={14} className="text-muted-foreground" />
                    <span className="text-sm">{profile.country}</span>
                  </div>
                )}
              </div>
            </div>
          </DashboardCard>

          {/* Account Information */}
          <DashboardCard
            title="Account Information"
            subtitle="Your account details"
            icon={<Shield size={18} />}
          >
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Student ID</span>
                <span className="text-sm font-mono font-semibold">{profile?.admission_no || 'Not assigned'}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Username</span>
                <span className="text-sm font-semibold">{profile?.username || 'Not set'}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Registration Date</span>
                <span className="text-sm">
                  {profile?.registration_date 
                    ? new Date(profile.registration_date).toLocaleDateString()
                    : 'Not available'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-muted-foreground">Account Status</span>
                <Badge variant="default" className="capitalize">
                  {profile?.enrollment_status || 'Active'}
                </Badge>
              </div>
            </div>
          </DashboardCard>
        </div>

        {/* Right Column - Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Form */}
          <DashboardCard
            title="Personal Information"
            subtitle="Update your personal details"
            icon={<User size={18} />}
          >
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">First Name *</Label>
                  <Input
                    id="first_name"
                    value={profileData.first_name}
                    onChange={(e) => setProfileData({...profileData, first_name: e.target.value})}
                    disabled={!isEditing || updateProfileMutation.isPending}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">Last Name *</Label>
                  <Input
                    id="last_name"
                    value={profileData.last_name}
                    onChange={(e) => setProfileData({...profileData, last_name: e.target.value})}
                    disabled={!isEditing || updateProfileMutation.isPending}
                    className="rounded-xl"
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
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                    disabled={!isEditing || updateProfileMutation.isPending}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={profileData.username}
                    onChange={(e) => setProfileData({...profileData, username: e.target.value})}
                    disabled={!isEditing || updateProfileMutation.isPending}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={profileData.country}
                    onChange={(e) => setProfileData({...profileData, country: e.target.value})}
                    disabled={!isEditing || updateProfileMutation.isPending}
                    className="rounded-xl"
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
                  className="rounded-xl"
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
                    className="rounded-xl"
                  />
                </div>
              </div>

              {isEditing && (
                <Button 
                  onClick={handleUpdateProfile}
                  disabled={updateProfileMutation.isPending}
                  className="w-full gap-2"
                >
                  {updateProfileMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              )}
            </div>
          </DashboardCard>

          {/* Password Change */}
          <DashboardCard
            title="Change Password"
            subtitle="Update your account password for security"
            icon={<Shield size={18} />}
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showPassword ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                    disabled={changePasswordMutation.isPending}
                    className="rounded-xl pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
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
                  className="rounded-xl"
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
                  className="rounded-xl"
                />
              </div>
              <Button 
                onClick={handlePasswordChange}
                disabled={changePasswordMutation.isPending}
                variant="outline"
                className="gap-2"
              >
                {changePasswordMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Changing Password...
                  </>
                ) : (
                  'Change Password'
                )}
              </Button>
            </div>
          </DashboardCard>

          {/* Data Management */}
          <DashboardCard
            title="Data Management"
            subtitle="Manage your personal data and privacy"
            icon={<Shield size={18} />}
          >
            <div className="space-y-4">
              <div>
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-2 rounded-xl"
                  onClick={handleExportData}
                  disabled={exportDataMutation.isPending}
                >
                  <Download className="h-4 w-4" />
                  {exportDataMutation.isPending ? 'Exporting...' : 'Export My Data'}
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  Download all your personal data in a readable format.
                </p>
              </div>
              
              <Separator />
              
              <div>
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-2 rounded-xl text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                >
                  <Shield className="h-4 w-4" />
                  Request Account Deletion
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  Permanently delete your account and all associated data.
                </p>
              </div>
            </div>
          </DashboardCard>

          {/* Meta Information (if available) */}
          {profile?.meta && (
            <DashboardCard
              title="Additional Information"
              subtitle="System metadata and additional details"
              icon={<Info size={18} />}
            >
              <div className="rounded-xl bg-muted/30 p-4 overflow-x-auto">
                <pre className="whitespace-pre-wrap text-xs font-mono">
                  {JSON.stringify(profile.meta, null, 2)}
                </pre>
              </div>
            </DashboardCard>
          )}
        </div>
      </div>
    </div>
  );
}

