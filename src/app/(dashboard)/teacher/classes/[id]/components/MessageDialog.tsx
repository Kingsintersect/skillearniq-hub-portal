'use client';

import { Phone, Mail, MessageSquare, Send, Users, Check, X, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

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

    const selectedCount = selectedStudents.length;
    const totalCount = students.length;

    return (
         <ScrollArea className="h-[70vh] pr-4">
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4 w-full"
        >
            {/* Header with Selection Summary */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-primary/5 border border-primary/10">
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Users className="h-4 w-4" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-foreground">
                            {selectedCount} Student{selectedCount !== 1 ? 's' : ''} Selected
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {totalCount} student{totalCount !== 1 ? 's' : ''} available
                        </p>
                    </div>
                </div>
                <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={onSelectAll}
                    className="gap-1.5 border-primary/20 hover:bg-primary/5"
                >
                    {selectedCount === totalCount ? (
                        <>
                            <X className="h-3.5 w-3.5" />
                            Deselect All
                        </>
                    ) : (
                        <>
                            <Check className="h-3.5 w-3.5" />
                            Select All
                        </>
                    )}
                </Button>
            </div>

            {/* Student Selection */}
            <div className="rounded-2xl border border-border/70 bg-background/60 p-3">
                <div className="flex items-center gap-2 mb-2 px-1">
                    <User className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs font-medium text-muted-foreground">Recipients</span>
                    {selectedCount > 0 && (
                        <Badge variant="secondary" className="ml-auto text-xs">
                            {selectedCount} selected
                        </Badge>
                    )}
                </div>
                <ScrollArea className="h-[180px]">
                    <div className="space-y-1 pr-2">
                        {students.map((student: any) => {
                            const isSelected = selectedStudents.includes(student.id);
                            const initials = student.name?.split(' ').map((n: string) => n[0]).join('') || 'S';
                            
                            return (
                                <motion.div
                                    key={student.id}
                                    initial={{ opacity: 0, x: -5 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.15 }}
                                    className={cn(
                                        "flex items-center gap-3 p-2.5 rounded-xl transition-all cursor-pointer group",
                                        isSelected 
                                            ? "bg-primary/5 border border-primary/20" 
                                            : "hover:bg-accent/40 border border-transparent"
                                    )}
                                    onClick={() => onStudentSelect(student.id)}
                                >
                                    <div className={cn(
                                        "w-4 h-4 rounded border-2 flex items-center justify-center transition-all flex-shrink-0",
                                        isSelected 
                                            ? "bg-primary border-primary" 
                                            : "border-muted-foreground/30 group-hover:border-primary/50"
                                    )}>
                                        {isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
                                    </div>
                                    <Avatar className="h-8 w-8 border border-border/50 flex-shrink-0">
                                        <AvatarImage src={student.avatar} />
                                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                                            {initials}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-foreground truncate">{student.name}</p>
                                        <p className="text-xs text-muted-foreground truncate">{student.email}</p>
                                    </div>
                                    {isSelected && (
                                        <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                </ScrollArea>
            </div>

            {/* Delivery Method */}
            <div className="rounded-2xl border border-border/70 bg-background/60 p-4">
                <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">Delivery Method</p>
                <div className="grid grid-cols-3 gap-2">
                    {[
                        { value: 'sms', icon: Phone, label: 'SMS' },
                        { value: 'email', icon: Mail, label: 'Email' },
                        { value: 'in-app', icon: MessageSquare, label: 'In-App' }
                    ].map(({ value, icon: Icon, label }) => {
                        const isActive = method === value;
                        return (
                            <Button
                                key={value}
                                type="button"
                                variant="outline"
                                onClick={() => setMethod(value as any)}
                                className={cn(
                                    "flex flex-col items-center gap-1.5 h-auto py-3 transition-all",
                                    isActive 
                                        ? "border-primary bg-primary/5 text-primary shadow-sm" 
                                        : "hover:bg-accent/40 border-border/50"
                                )}
                            >
                                <Icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground")} />
                                <span className={cn("text-xs font-medium", isActive ? "text-foreground" : "text-muted-foreground")}>
                                    {label}
                                </span>
                            </Button>
                        );
                    })}
                </div>
            </div>

            {/* Message Form with Scroll Area */}
            <ScrollArea className="max-h-[300px] pr-2">
                <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="rounded-2xl border border-border/70 bg-background/60 p-4 focus-within:border-primary/50 transition-colors">
                        <Label htmlFor="message" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Message
                        </Label>
                        <Textarea
                            id="message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type your message here..."
                            className="mt-2 min-h-[100px] resize-none rounded-xl border-0 bg-transparent p-3 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/50"
                            required
                        />
                        <div className="flex justify-end mt-1">
                            <span className="text-xs text-muted-foreground/50">
                                {message.length} characters
                            </span>
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        {selectedCount === 0 && message.trim() && (
                            <motion.div
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                className="text-xs text-amber-600 text-center"
                            >
                                Please select at least one student to send the message.
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <Button 
                        type="submit" 
                        disabled={!message.trim() || selectedCount === 0 || isSending}
                        className={cn(
                            "w-full gap-2 h-11 transition-all",
                            !message.trim() || selectedCount === 0 
                                ? "opacity-50 cursor-not-allowed" 
                                : "hover:scale-[1.02]"
                        )}
                    >
                        {isSending ? (
                            <>
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                                Sending...
                            </>
                        ) : (
                            <>
                                <Send className="h-4 w-4" />
                                {selectedCount === 0 
                                    ? 'Select Students First' 
                                    : `Send Message${selectedCount > 0 ? ` to ${selectedCount} Student${selectedCount !== 1 ? 's' : ''}` : ''}`
                                }
                            </>
                        )}
                    </Button>

                    {selectedCount > 0 && message.trim() && !isSending && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-xs text-muted-foreground text-center"
                        >
                            Message will be sent via <span className="font-medium capitalize">{method}</span> to {selectedCount} student{selectedCount !== 1 ? 's' : ''}
                        </motion.p>
                    )}
                </form>
            </ScrollArea>
        </motion.div>
    </ScrollArea>
    );
};