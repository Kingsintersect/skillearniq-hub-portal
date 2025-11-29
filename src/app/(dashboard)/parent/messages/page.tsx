'use client'
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useParentMessages } from '../hooks/useParentMessages';

export default function MessagesPage() {
  const {
    studentMessages,
    unreadCount,
    isMessagesLoading: isLoading,
    messagesError,
    selectedStudentId
  } = useParentMessages();
  const messages = studentMessages || [];

  if (isLoading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">Loading messages...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-8xl mx-auto space-y-5">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Messages</h1>
          <p className="text-muted-foreground">
            Weekly reports and summaries from teachers
          </p>
        </div>

        <Card>
          <CardHeader className="flex justify-between items-start mb-2">
            <div className="">
              <CardTitle>Teacher Messages</CardTitle>
              <CardDescription>
                All weekly reports and summary messages
              </CardDescription>
            </div>
            {unreadCount > 0 && (
              <Badge variant="destructive">{unreadCount} unread</Badge>
            )}
          </CardHeader>
        </Card>

        {messages.map((message) => (
          <Card
            key={message.id}
          >
            <CardHeader className="flex justify-between items-start mb-2">
              <div className="">
                <CardTitle><h3 className="font-semibold">{message.title}</h3></CardTitle>
                <CardDescription>
                  <p className="text-sm text-muted-foreground">From: {message.sender}</p>
                </CardDescription>
              </div>
              <Badge variant="secondary">{message.studentName}</Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Card className="p-4">
                  <p className="text-sm mb-2">{message.content}</p>
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span>{message.date}</span>
                    <Button variant="ghost" size="sm">View Details</Button>
                  </div>
                </Card>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}