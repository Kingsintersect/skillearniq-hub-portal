'use client'
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function AdminProfile() {
  return (
    <div className="min-h-screen p-6 bg-background">
      <div className="max-w-8xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Admin Profile</h1>
          <p className="text-muted-foreground">Manage your admin profile and account settings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Profile Information</CardTitle>
                <CardDescription>Update your personal information and contact details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-foreground">First Name</Label>
                    <Input
                      id="firstName"
                      defaultValue="John"
                      className="bg-background border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-foreground">Last Name</Label>
                    <Input
                      id="lastName"
                      defaultValue="Doe"
                      className="bg-background border-border"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue="john.doe@excelcollege.edu"
                    className="bg-background border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-foreground">Phone Number</Label>
                  <Input
                    id="phone"
                    defaultValue="+1 (555) 123-4567"
                    className="bg-background border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position" className="text-foreground">Position</Label>
                  <Input
                    id="position"
                    defaultValue="School Administrator"
                    className="bg-background border-border"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Security</CardTitle>
                <CardDescription>Manage your password and security settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword" className="text-foreground">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    className="bg-background border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-foreground">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    className="bg-background border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-foreground">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    className="bg-background border-border"
                  />
                </div>
                <Button>Update Password</Button>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Profile Picture</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center border border-border">
                    <span className="text-2xl font-semibold text-foreground">JD</span>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="border-border">
                      Upload New
                    </Button>
                    <Button variant="outline" size="sm" className="border-border">
                      Remove
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Account Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-foreground">Status</span>
                    <span className="text-sm font-medium text-green-600 dark:text-green-400">Active</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-foreground">Member Since</span>
                    <span className="text-sm font-medium text-foreground">January 2024</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-foreground">Last Login</span>
                    <span className="text-sm font-medium text-foreground">2 hours ago</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-foreground">Role</span>
                    <span className="text-sm font-medium text-foreground">Administrator</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-foreground">Permissions</span>
                    <span className="text-sm font-medium text-foreground">Full Access</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions Card */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start border-border">
                    View Activity Log
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-border">
                    Manage Notifications
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-border">
                    Two-Factor Auth
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-border text-destructive hover:bg-destructive hover:text-destructive-foreground">
                    Deactivate Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <Button variant="outline" className="border-border">Cancel</Button>
          <Button>Save Changes</Button>
        </div>
      </div>
    </div>
  );
}