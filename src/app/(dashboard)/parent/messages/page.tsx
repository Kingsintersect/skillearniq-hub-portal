'use client'
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useParentStore } from '@/store/parentStore';
import { useParentQueries } from '@/hooks/useParentQueries';

export default function MessagesPage() {
  const { selectedStudentId } = useParentStore();
  const { useTeacherMessages } = useParentQueries();

  const { data: messagesResponse, isLoading } = useTeacherMessages(selectedStudentId || undefined);

  const messages = messagesResponse?.data || [];

  if (isLoading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">Loading messages...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Messages</h1>
          <p className="text-muted-foreground">
            Weekly reports and summaries from teachers
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Teacher Messages</CardTitle>
            <CardDescription>
              All weekly reports and summary messages
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {messages.map((message) => (
                <Card key={message.id} className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold">{message.subject}</h3>
                      <p className="text-sm text-muted-foreground">From: {message.from}</p>
                    </div>
                    <Badge variant="secondary">{message.student}</Badge>
                  </div>
                  <p className="text-sm mb-2">{message.message}</p>
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span>{message.date}</span>
                    <Button variant="ghost" size="sm">View Details</Button>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}