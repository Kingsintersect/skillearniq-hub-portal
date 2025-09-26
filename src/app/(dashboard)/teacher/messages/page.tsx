'use client'
import React, { useState } from 'react';

// Shadcn components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { 
  Bell, 
  BellOff,
  FileText,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  Info,
  Settings,
  Trash2,
  Archive,
  Send,
  Mail,
  Phone,
  User,
  Users,
  Shield
} from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const [view, setView] = useState<'all' | 'unread' | 'sent' | 'archived'>('all');
  const [composeDialogOpen, setComposeDialogOpen] = useState(false);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'New Assignment Posted',
      message: 'Mathematics assignment for JSS 1A has been posted. Due date: 2024-02-01',
      type: 'assignment',
      sender: 'system',
      timestamp: '2024-01-25T10:30:00Z',
      read: false,
      archived: false
    },
    {
      id: 2,
      title: 'Parent Message - John Doe',
      message: 'Hello, I would like to discuss my son\'s progress in mathematics',
      type: 'parent-message',
      sender: 'parent',
      timestamp: '2024-01-24T14:20:00Z',
      read: true,
      archived: false
    },
    {
      id: 3,
      title: 'Attendance Alert',
      message: 'Low attendance detected for student Jane Smith in JSS 1A',
      type: 'attendance',
      sender: 'system',
      timestamp: '2024-01-23T09:15:00Z',
      read: true,
      archived: false
    },
    {
      id: 4,
      title: 'Message to Admin - System Issue',
      message: 'Reporting issue with grade submission system',
      type: 'teacher-message',
      sender: 'teacher',
      timestamp: '2024-01-22T16:45:00Z',
      read: true,
      archived: false
    }
  ]);

  const [sentMessages, setSentMessages] = useState([
    {
      id: 101,
      title: 'To Parents - JSS 1A',
      message: 'Reminder: Parent-teacher meeting scheduled for next week',
      recipients: 'All JSS 1A Parents',
      method: 'in-app',
      timestamp: '2024-01-25T09:00:00Z',
      status: 'delivered'
    }
  ]);

  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    assignmentAlerts: true,
    attendanceAlerts: true,
    parentMessages: true,
    adminMessages: true
  });

  const unreadCount = notifications.filter(n => !n.read && !n.archived).length;

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
    toast.success('Notification marked as read');
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    toast.success('All notifications marked as read');
  };

  const archiveNotification = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, archived: true } : n
    ));
    toast.success('Notification archived');
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
    toast.success('Notification deleted');
  };

  const handleSendMessage = (messageData: any) => {
    const newMessage = {
      id: Date.now(),
      ...messageData,
      timestamp: new Date().toISOString(),
      status: 'sent'
    };
    setSentMessages(prev => [newMessage, ...prev]);
    toast.success('Message sent successfully');
    setComposeDialogOpen(false);
  };

  const filteredNotifications = notifications.filter(n => {
    if (view === 'unread') return !n.read && !n.archived;
    if (view === 'sent') return false; // Handled separately
    if (view === 'archived') return n.archived;
    return !n.archived;
  });

  const getIcon = (type: string): React.ReactElement => {
    switch (type) {
      case 'assignment': return <FileText className="h-5 w-5 text-blue-500" />;
      case 'attendance': return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case 'parent-message': return <User className="h-5 w-5 text-green-500" />;
      case 'teacher-message': return <Shield className="h-5 w-5 text-purple-500" />;
      case 'reminder': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'meeting': return <MessageSquare className="h-5 w-5 text-purple-500" />;
      default: return <Info className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4">
            <Bell className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Notifications & Messages</h1>
          <p className="text-muted-foreground text-lg">Communicate with parents, teachers, and administrators</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Messages</p>
                  <p className="text-2xl font-bold text-foreground">{notifications.length + sentMessages.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Unread</p>
                  <p className="text-2xl font-bold text-foreground">{unreadCount}</p>
                </div>
                <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
                  <BellOff className="h-6 w-6 text-orange-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">From Parents</p>
                  <p className="text-2xl font-bold text-foreground">
                    {notifications.filter(n => n.sender === 'parent').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <User className="h-6 w-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Sent Messages</p>
                  <p className="text-2xl font-bold text-foreground">{sentMessages.length}</p>
                </div>
                <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                  <Send className="h-6 w-6 text-purple-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                <Button variant="outline" onClick={markAllAsRead}>
                  Mark All as Read
                </Button>
                <Button variant="outline">
                  <Archive className="h-4 w-4 mr-2" />
                  Archive All Read
                </Button>
              </div>
              <div className="flex space-x-2">
                <Dialog open={composeDialogOpen} onOpenChange={setComposeDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Send className="h-4 w-4 mr-2" />
                      Compose Message
                    </Button>
                  </DialogTrigger>
                  <ComposeMessageDialog onSendMessage={handleSendMessage} />
                </Dialog>
                <Button variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs value={view} onValueChange={(value: any) => setView(value)} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All Messages</TabsTrigger>
            <TabsTrigger value="unread">
              Unread {unreadCount > 0 && `(${unreadCount})`}
            </TabsTrigger>
            <TabsTrigger value="sent">Sent Messages</TabsTrigger>
            <TabsTrigger value="archived">Archived</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            <MessageListView 
              messages={filteredNotifications} 
              type="incoming"
              onMarkAsRead={markAsRead}
              onArchive={archiveNotification}
              onDelete={deleteNotification}
              getIcon={getIcon}
            />
          </TabsContent>

          <TabsContent value="unread">
            <MessageListView 
              messages={filteredNotifications.filter(m => !m.read)} 
              type="incoming"
              onMarkAsRead={markAsRead}
              onArchive={archiveNotification}
              onDelete={deleteNotification}
              getIcon={getIcon}
            />
          </TabsContent>

          <TabsContent value="sent">
            <MessageListView 
              messages={sentMessages} 
              type="sent"
              onMarkAsRead={markAsRead}
              onArchive={archiveNotification}
              onDelete={deleteNotification}
              getIcon={getIcon}
            />
          </TabsContent>

          <TabsContent value="archived">
            <MessageListView 
              messages={notifications.filter(n => n.archived)} 
              type="incoming"
              onMarkAsRead={markAsRead}
              onArchive={archiveNotification}
              onDelete={deleteNotification}
              getIcon={getIcon}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// Compose Message Dialog Component
const ComposeMessageDialog: React.FC<{
  onSendMessage: (messageData: any) => void;
}> = ({ onSendMessage }) => {
  const [formData, setFormData] = useState({
    recipientType: 'parents',
    specificRecipient: '',
    method: 'in-app',
    subject: '',
    message: '',
    urgency: 'normal'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSendMessage(formData);
  };

  return (
    <DialogContent className="max-w-2xl max-h-[95vh] flex flex-col">
      <DialogHeader>
        <DialogTitle>Compose New Message</DialogTitle>
        <DialogDescription>
          Send messages to parents, teachers, or administrators via multiple channels.
        </DialogDescription>
      </DialogHeader>

      <ScrollArea className=" h-[400px] pr-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Recipient Selection */}
          <div className="space-y-2">
            <Label htmlFor="recipientType">Send To</Label>
            <Select
              value={formData.recipientType}
              onValueChange={(value) => setFormData(prev => ({ ...prev, recipientType: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="parents">All Parents</SelectItem>
                <SelectItem value="teachers">All Teachers</SelectItem>
                <SelectItem value="admins">Administrators</SelectItem>
                <SelectItem value="specific">Specific Recipient</SelectItem>
                <SelectItem value="class">Entire Class</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.recipientType === 'specific' && (
            <div className="space-y-2">
              <Label htmlFor="specificRecipient">Specific Recipient</Label>
              <Input
                id="specificRecipient"
                value={formData.specificRecipient}
                onChange={(e) => setFormData(prev => ({ ...prev, specificRecipient: e.target.value }))}
                placeholder="Enter recipient name or email"
              />
            </div>
          )}

          {/* Delivery Method */}
          <div className="space-y-2">
            <Label htmlFor="method">Delivery Method</Label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                type="button"
                variant={formData.method === 'sms' ? 'default' : 'outline'}
                onClick={() => setFormData(prev => ({ ...prev, method: 'sms' }))}
                className="flex flex-col h-auto p-3"
              >
                <Phone className="h-4 w-4 mb-1" />
                <span className="text-xs">SMS</span>
              </Button>
              <Button
                type="button"
                variant={formData.method === 'email' ? 'default' : 'outline'}
                onClick={() => setFormData(prev => ({ ...prev, method: 'email' }))}
                className="flex flex-col h-auto p-3"
              >
                <Mail className="h-4 w-4 mb-1" />
                <span className="text-xs">Email</span>
              </Button>
              <Button
                type="button"
                variant={formData.method === 'in-app' ? 'default' : 'outline'}
                onClick={() => setFormData(prev => ({ ...prev, method: 'in-app' }))}
                className="flex flex-col h-auto p-3"
              >
                <MessageSquare className="h-4 w-4 mb-1" />
                <span className="text-xs">In-App</span>
              </Button>
            </div>
          </div>

          {/* Urgency */}
          <div className="space-y-2">
            <Label htmlFor="urgency">Urgency Level</Label>
            <Select
              value={formData.urgency}
              onValueChange={(value) => setFormData(prev => ({ ...prev, urgency: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low Priority</SelectItem>
                <SelectItem value="normal">Normal Priority</SelectItem>
                <SelectItem value="high">High Priority</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={formData.subject}
              onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
              placeholder="Enter message subject"
              required
            />
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              placeholder="Type your message here..."
              rows={6}
              required
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => {}}>
              Save Draft
            </Button>
            <Button type="submit">
              <Send className="h-4 w-4 mr-2" />
              Send Message
            </Button>
          </div>
        </form>
      </ScrollArea>
    </DialogContent>
  );
};

// Message List View Component
const MessageListView: React.FC<{
  messages: any[];
  type: 'incoming' | 'sent';
  onMarkAsRead: (id: number) => void;
  onArchive: (id: number) => void;
  onDelete: (id: number) => void;
  getIcon: (type: string) => React.ReactElement;
}> = ({ messages, type, onMarkAsRead, onArchive, onDelete, getIcon }) => {
  if (messages.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No messages</h3>
          <p className="text-muted-foreground">
            {type === 'sent' ? 'No sent messages yet' : 'No messages available'}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <ScrollArea className="h-[600px]">
        <div className="divide-y">
          {messages.map((message) => (
            <MessageItem
              key={message.id}
              message={message}
              type={type}
              onMarkAsRead={onMarkAsRead}
              onArchive={onArchive}
              onDelete={onDelete}
              getIcon={getIcon}
            />
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};

// Message Item Component
const MessageItem: React.FC<{
  message: any;
  type: 'incoming' | 'sent';
  onMarkAsRead: (id: number) => void;
  onArchive: (id: number) => void;
  onDelete: (id: number) => void;
  getIcon: (type: string) => React.ReactElement;
}> = ({ message, type, onMarkAsRead, onArchive, onDelete, getIcon }) => {
  const getUrgencyBadge = (urgency: string) => {
    const variants = {
      low: { label: 'Low', variant: 'outline' as const },
      normal: { label: 'Normal', variant: 'secondary' as const },
      high: { label: 'High', variant: 'default' as const },
      urgent: { label: 'Urgent', variant: 'destructive' as const }
    };
    return <Badge variant={variants[urgency as keyof typeof variants]?.variant || 'outline'}>
      {variants[urgency as keyof typeof variants]?.label || urgency}
    </Badge>;
  };

  return (
    <div className={`p-4 hover:bg-muted/50 transition-colors ${
      type === 'incoming' && !message.read ? 'bg-blue-50 dark:bg-blue-950/20' : ''
    }`}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-1">
          {type === 'sent' ? <Send className="h-5 w-5 text-green-500" /> : getIcon(message.type)}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-medium text-foreground truncate">
              {type === 'sent' ? `To: ${message.recipients}` : message.title}
            </h4>
            <div className="flex items-center space-x-2">
              {type === 'sent' && getUrgencyBadge(message.urgency)}
              {type === 'incoming' && !message.read && (
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              )}
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground mb-2">{message.message}</p>
          
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {new Date(message.timestamp).toLocaleDateString()} at{' '}
              {new Date(message.timestamp).toLocaleTimeString()}
              {type === 'sent' && ` • ${message.method.toUpperCase()}`}
            </span>
            
            {type === 'incoming' && (
              <div className="flex space-x-1">
                {!message.read && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onMarkAsRead(message.id)}
                    className="h-8 px-2"
                  >
                    Mark Read
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onArchive(message.id)}
                  className="h-8 px-2"
                >
                  <Archive className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(message.id)}
                  className="h-8 px-2"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Notification Settings Component (same as before)
const NotificationSettings: React.FC<{
  settings: any;
  onSettingsChange: (settings: any) => void;
}> = ({ settings, onSettingsChange }) => {
  const handleSettingChange = (key: string, value: boolean) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  return (
    <Card className="sticky top-6">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Settings className="h-5 w-5" />
          <span>Notification Settings</span>
        </CardTitle>
        <CardDescription>Manage your notification preferences</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="email-notifications" className="flex-1">
            <div className="font-medium">Email Notifications</div>
            <div className="text-sm text-muted-foreground">Receive notifications via email</div>
          </Label>
          <Switch
            id="email-notifications"
            checked={settings.emailNotifications}
            onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
          />
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <Label htmlFor="sms-notifications" className="flex-1">
            <div className="font-medium">SMS Notifications</div>
            <div className="text-sm text-muted-foreground">Receive SMS alerts</div>
          </Label>
          <Switch
            id="sms-notifications"
            checked={settings.smsNotifications}
            onCheckedChange={(checked) => handleSettingChange('smsNotifications', checked)}
          />
        </div>

        <Separator />

        <div className="space-y-3">
          <h4 className="font-medium">Message Types</h4>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="parent-messages" className="flex-1">
              <div className="text-sm">Parent Messages</div>
            </Label>
            <Switch
              id="parent-messages"
              checked={settings.parentMessages}
              onCheckedChange={(checked) => handleSettingChange('parentMessages', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="admin-messages" className="flex-1">
              <div className="text-sm">Admin Messages</div>
            </Label>
            <Switch
              id="admin-messages"
              checked={settings.adminMessages}
              onCheckedChange={(checked) => handleSettingChange('adminMessages', checked)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationsPage;