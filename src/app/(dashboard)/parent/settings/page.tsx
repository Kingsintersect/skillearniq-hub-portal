'use client'
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    email: 'parent@example.com',
    phone: '+1234567890',
    language: 'english',
    timezone: 'WAT'
  });

  const [notifications, setNotifications] = useState({
    emailReports: true,
    smsAlerts: false,
    assignmentReminders: true,
    paymentReminders: true
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSaveSettings = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSaving(false);
    console.log('Settings saved:', { settings, notifications });
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Parent Settings</h1>
          <p className="text-muted-foreground">Manage your account preferences and notifications</p>
        </div>

        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
            <CardDescription>Update your contact information and preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
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
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={settings.phone}
                  onChange={(e) => setSettings({...settings, phone: e.target.value})}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
            <CardDescription>Choose how you want to receive updates and alerts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-0.5">
                  <Label htmlFor="email-reports">Email Reports</Label>
                  <div className="text-sm text-muted-foreground">
                    Receive weekly progress reports via email
                  </div>
                </div>
                <Switch
                  id="email-reports"
                  checked={notifications.emailReports}
                  onCheckedChange={(checked) => handleNotificationChange('emailReports', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-0.5">
                  <Label htmlFor="sms-alerts">SMS Alerts</Label>
                  <div className="text-sm text-muted-foreground">
                    Receive important alerts via SMS
                  </div>
                </div>
                <Switch
                  id="sms-alerts"
                  checked={notifications.smsAlerts}
                  onCheckedChange={(checked) => handleNotificationChange('smsAlerts', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-0.5">
                  <Label htmlFor="assignment-reminders">Assignment Reminders</Label>
                  <div className="text-sm text-muted-foreground">
                    Get reminders for upcoming assignments
                  </div>
                </div>
                <Switch
                  id="assignment-reminders"
                  checked={notifications.assignmentReminders}
                  onCheckedChange={(checked) => handleNotificationChange('assignmentReminders', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-0.5">
                  <Label htmlFor="payment-reminders">Payment Reminders</Label>
                  <div className="text-sm text-muted-foreground">
                    Receive reminders for fee payments
                  </div>
                </div>
                <Switch
                  id="payment-reminders"
                  checked={notifications.paymentReminders}
                  onCheckedChange={(checked) => handleNotificationChange('paymentReminders', checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4 mt-6">
          <Button variant="outline">Cancel</Button>
          <Button 
            onClick={handleSaveSettings}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </div>
    </div>
  );
}