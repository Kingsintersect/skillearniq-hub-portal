"use client";

import { Phone, Mail, MessageSquare, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';


export const MessageDialog: React.FC<{
    students: any[];
    selectedStudents: number[];
    onStudentSelect: (studentId: number) => void;
    onSelectAll: () => void;
    onSendMessage: (studentIds: number[], message: string, method: 'sms' | 'email' | 'in-app') => void;
}> = ({ students, selectedStudents, onStudentSelect, onSelectAll, onSendMessage }) => {
    const [message, setMessage] = useState('');
    const [method, setMethod] = useState<'sms' | 'email' | 'in-app'>('in-app');
    const [isSending, setIsSending] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim() || selectedStudents.length === 0) return;

        setIsSending(true);
        try {
            await onSendMessage(selectedStudents, message, method);
            setMessage('');
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="flex-1 overflow-hidden flex flex-col gap-4">
            {/* Student Selection */}
            <Card>
                <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-sm">Select Students</CardTitle>
                        <Button variant="outline" size="sm" onClick={onSelectAll}>
                            {selectedStudents.length === students.length ? 'Deselect All' : 'Select All'}
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <ScrollArea className="h-32">
                        <div className="p-4 space-y-2">
                            {students.map(student => (
                                <div key={student.id} className="flex items-center space-x-3">
                                    <Switch
                                        checked={selectedStudents.includes(student.id)}
                                        onCheckedChange={() => onStudentSelect(student.id)}
                                    />
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={student.avatar} />
                                        <AvatarFallback>{student.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">{student.name}</p>
                                        <p className="text-xs text-muted-foreground truncate">{student.email}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>

            {/* Message Method */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Delivery Method</CardTitle>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-32">
                        <div className="grid grid-cols-3 gap-2">
                            <Button
                                type="button"
                                variant={method === 'sms' ? 'default' : 'outline'}
                                onClick={() => setMethod('sms')}
                                className="flex flex-col h-auto p-3"
                            >
                                <Phone className="h-4 w-4 mb-1" />
                                <span className="text-xs">SMS</span>
                            </Button>
                            <Button
                                type="button"
                                variant={method === 'email' ? 'default' : 'outline'}
                                onClick={() => setMethod('email')}
                                className="flex flex-col h-auto p-3"
                            >
                                <Mail className="h-4 w-4 mb-1" />
                                <span className="text-xs">Email</span>
                            </Button>
                            <Button
                                type="button"
                                variant={method === 'in-app' ? 'default' : 'outline'}
                                onClick={() => setMethod('in-app')}
                                className="flex flex-col h-auto p-3"
                            >
                                <MessageSquare className="h-4 w-4 mb-1" />
                                <span className="text-xs">In-App</span>
                            </Button>
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>

            {/* Message Form */}
            <Card className="flex-1">
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Message Content</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4 h-full flex flex-col">
                        <div className="flex-1">
                            <Label htmlFor="message">Message</Label>
                            <Textarea
                                id="message"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Type your message here..."
                                className="min-h-[120px] resize-none"
                                required
                            />
                        </div>

                        <div className="flex justify-between items-center pt-4">
                            <span className="text-sm text-muted-foreground">
                                {selectedStudents.length} student(s) selected
                            </span>
                            <Button type="submit" disabled={!message.trim() || selectedStudents.length === 0 || isSending}>
                                <Send className="h-4 w-4 mr-2" />
                                {isSending ? 'Sending...' : 'Send Message'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};