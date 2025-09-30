
'use client'
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Send, Users, User, UserCheck } from 'lucide-react';
import { toast } from 'sonner';

export default function MessagesPage() {
  const [message, setMessage] = useState({
    recipientType: 'all',
    specificRecipients: [],
    subject: '',
    content: ''
  });

  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const users = {
    students: [
      { id: 1, name: 'Alex Johnson', class: 'JSS 2A' },
      { id: 2, name: 'Sarah Johnson', class: 'JSS 1B' },
      { id: 3, name: 'Michael Smith', class: 'JSS 2A' }
    ],
    teachers: [
      { id: 1, name: 'Mr. Smith', subject: 'Mathematics' },
      { id: 2, name: 'Mrs. Johnson', subject: 'English' },
      { id: 3, name: 'Mr. Brown', subject: 'Science' }
    ],
    parents: [
      { id: 1, name: 'Mr. & Mrs. Johnson', children: ['Alex', 'Sarah'] },
      { id: 2, name: 'Mr. & Mrs. Smith', children: ['Michael'] }
    ]
  };

  const handleSendMessage = () => {
    if (!message.subject || !message.content) {
      toast.error('Please fill in both subject and content');
      return;
    }

    let recipientCount = 0;
    let recipientText = '';

    switch (message.recipientType) {
      case 'all':
        recipientCount = users.students.length + users.teachers.length + users.parents.length;
        recipientText = 'all users';
        break;
      case 'students':
        recipientCount = users.students.length;
        recipientText = 'all students';
        break;
      case 'teachers':
        recipientCount = users.teachers.length;
        recipientText = 'all teachers';
        break;
      case 'parents':
        recipientCount = users.parents.length;
        recipientText = 'all parents';
        break;
      case 'specific':
        recipientCount = selectedUsers.length;
        recipientText = 'selected users';
        break;
    }

    toast.success(`Message sent to ${recipientCount} ${recipientText}`);
    
    // Reset form
    setMessage({
      recipientType: 'all',
      specificRecipients: [],
      subject: '',
      content: ''
    });
    setSelectedUsers([]);
  };

  const toggleUserSelection = (userId: string, userType: string) => {
    const userKey = `${userType}-${userId}`;
    setSelectedUsers(prev => 
      prev.includes(userKey) 
        ? prev.filter(u => u !== userKey)
        : [...prev, userKey]
    );
  };

  const getRecipientIcon = () => {
    switch (message.recipientType) {
      case 'all': return <Users className="h-4 w-4" />;
      case 'students': return <User className="h-4 w-4" />;
      case 'teachers': return <UserCheck className="h-4 w-4" />;
      case 'parents': return <Users className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Send Messages</h1>
          <p className="text-muted-foreground">Communicate with students, teachers, and parents</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Compose Message */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Compose Message</CardTitle>
                <CardDescription>Send announcements, updates, or individual messages</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Send To</Label>
                    <Select 
                      value={message.recipientType} 
                      onValueChange={(value) => setMessage({...message, recipientType: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-2" />
                            All Users
                          </div>
                        </SelectItem>
                        <SelectItem value="students">
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-2" />
                            All Students
                          </div>
                        </SelectItem>
                        <SelectItem value="teachers">
                          <div className="flex items-center">
                            <UserCheck className="h-4 w-4 mr-2" />
                            All Teachers
                          </div>
                        </SelectItem>
                        <SelectItem value="parents">
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-2" />
                            All Parents
                          </div>
                        </SelectItem>
                        <SelectItem value="specific">
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-2" />
                            Specific Users
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {message.recipientType === 'specific' && (
                    <div className="space-y-2">
                      <Label>Selected Users</Label>
                      <div className="text-sm border rounded-lg p-3 min-h-[42px]">
                        {selectedUsers.length === 0 ? (
                          <span className="text-muted-foreground">No users selected</span>
                        ) : (
                          <div className="flex flex-wrap gap-1">
                            {selectedUsers.map(userKey => (
                              <Badge key={userKey} variant="secondary" className="text-xs">
                                {userKey.split('-')[1]}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Subject</Label>
                  <Input
                    placeholder="Enter message subject"
                    value={message.subject}
                    onChange={(e) => setMessage({...message, subject: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Message Content</Label>
                  <Textarea
                    placeholder="Type your message here..."
                    rows={8}
                    value={message.content}
                    onChange={(e) => setMessage({...message, content: e.target.value})}
                  />
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSendMessage} size="lg">
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* User Selection & Recent Messages */}
          <div className="space-y-6">
            {message.recipientType === 'specific' && (
              <Card>
                <CardHeader>
                  <CardTitle>Select Users</CardTitle>
                  <CardDescription>Choose specific recipients</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-[400px] overflow-y-auto">
                    {/* Students */}
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        Students
                      </h4>
                      <div className="space-y-1">
                        {users.students.map(student => (
                          <div key={student.id} className="flex items-center space-x-2 p-2 hover:bg-muted rounded">
                            <input
                              type="checkbox"
                              checked={selectedUsers.includes(`student-${student.id}`)}
                              onChange={() => toggleUserSelection(student.id.toString(), 'student')}
                              className="h-4 w-4"
                            />
                            <div>
                              <div className="text-sm font-medium">{student.name}</div>
                              <div className="text-xs text-muted-foreground">{student.class}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Teachers */}
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <UserCheck className="h-4 w-4 mr-2" />
                        Teachers
                      </h4>
                      <div className="space-y-1">
                        {users.teachers.map(teacher => (
                          <div key={teacher.id} className="flex items-center space-x-2 p-2 hover:bg-muted rounded">
                            <input
                              type="checkbox"
                              checked={selectedUsers.includes(`teacher-${teacher.id}`)}
                              onChange={() => toggleUserSelection(teacher.id.toString(), 'teacher')}
                              className="h-4 w-4"
                            />
                            <div>
                              <div className="text-sm font-medium">{teacher.name}</div>
                              <div className="text-xs text-muted-foreground">{teacher.subject}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Parents */}
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        Parents
                      </h4>
                      <div className="space-y-1">
                        {users.parents.map(parent => (
                          <div key={parent.id} className="flex items-center space-x-2 p-2 hover:bg-muted rounded">
                            <input
                              type="checkbox"
                              checked={selectedUsers.includes(`parent-${parent.id}`)}
                              onChange={() => toggleUserSelection(parent.id.toString(), 'parent')}
                              className="h-4 w-4"
                            />
                            <div>
                              <div className="text-sm font-medium">{parent.name}</div>
                              <div className="text-xs text-muted-foreground">
                                Children: {parent.children.join(', ')}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent Messages */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Messages</CardTitle>
                <CardDescription>Your recently sent communications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-semibold text-sm">Term 1 Progress Reports</div>
                        <div className="text-xs text-muted-foreground">To: All Parents</div>
                      </div>
                      <Badge variant="outline" className="text-xs">2 days ago</Badge>
                    </div>
                    <p className="text-xs">Progress reports for Term 1 are now available...</p>
                  </div>
                  
                  <div className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-semibold text-sm">Staff Meeting Reminder</div>
                        <div className="text-xs text-muted-foreground">To: All Teachers</div>
                      </div>
                      <Badge variant="outline" className="text-xs">1 week ago</Badge>
                    </div>
                    <p className="text-xs">Reminder about the staff meeting this Friday...</p>
                  </div>

                  <div className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-semibold text-sm">Science Fair Update</div>
                        <div className="text-xs text-muted-foreground">To: JSS 2A Students</div>
                      </div>
                      <Badge variant="outline" className="text-xs">3 days ago</Badge>
                    </div>
                    <p className="text-xs">Science fair projects due next Monday...</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}