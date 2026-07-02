'use client';

import React, { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTeacherQueries } from "@/hooks/useTeacherQueries";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Eye,
  Trash2,
  Pencil,
  Send,
  ChevronLeft,
  ChevronRight,
  Mail,
  Inbox,
  Users,
  MessageSquare,
  Loader2,
  AlertCircle,
  User,
  CheckCircle,
  XCircle
} from "lucide-react";

import { formatDistanceToNow } from "date-fns";

// Dashboard Card Component
interface DashboardCardProps {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

function DashboardCard({ title, subtitle, icon, action, children, className = '' }: DashboardCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28 }}
      className={`rounded-3xl border border-border/70 bg-card/95 p-5 shadow-sm backdrop-blur-sm ${className}`}
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

function StatPill({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-border/70 bg-background/60 px-3 py-2">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}

const PAGE_SIZE = 10;

export default function TeacherMessagesPage() {
  const {
    useSentMessages,
    useReceivedMessages,
    useSendMessage,
    useDeleteMessage,
    useUpdateMessage,
    useStudents,
  } = useTeacherQueries();

  const teacherId =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "{}")?.id
      : undefined;

  const sentQuery = useSentMessages();
  const receivedQuery = useReceivedMessages();
  const studentsQuery = useStudents?.(teacherId);

  const sendMutation = useSendMessage();
  const deleteMutation = useDeleteMessage();
  const updateMutation = useUpdateMessage();

  const [tab, setTab] = useState<"sent" | "received">("sent");
  const [page, setPage] = useState(1);

  const [open, setOpen] = useState(false);
  const [viewing, setViewing] = useState<any>(null);
  const [editing, setEditing] = useState<any>(null);
  const [deleting, setDeleting] = useState<any>(null);

  const [message, setMessage] = useState("");
  const [recipientType, setRecipientType] = useState<"course" | "specific">("course");
  const [courseId, setCourseId] = useState<number>();
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);

  useEffect(() => {
    if (!open && !editing) {
      setMessage("");
    }
  }, [open, editing]);

  const messages = useMemo(() => {
    const raw = tab === "sent" ? sentQuery.data?.data : receivedQuery.data?.data;
    return Array.isArray(raw) ? raw : [];
  }, [tab, sentQuery.data, receivedQuery.data]);

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return messages.slice(start, start + PAGE_SIZE);
  }, [messages, page]);

  const totalPages = Math.ceil(messages.length / PAGE_SIZE);

  const toggleStudent = (id: number) => {
    setSelectedStudents((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const formatDate = (d: string) =>
    formatDistanceToNow(new Date(d), { addSuffix: true });

  const send = () => {
    if (!message.trim()) return;

    if (recipientType === "course" && !courseId) {
      alert("Select a course");
      return;
    }

    if (recipientType === "specific" && selectedStudents.length === 0) {
      alert("Select students");
      return;
    }

    const payload =
      recipientType === "course"
        ? {
            recipient_type: "teacher_course_students",
            course_id: courseId,
            message,
          }
        : {
            recipient_type: "specific_student",
            recipient_ids: selectedStudents,
            message,
          };

    sendMutation.mutate(payload, {
      onSuccess: () => {
        setOpen(false);
        setMessage("");
        setSelectedStudents([]);
      },
    });
  };

  const update = () => {
    updateMutation.mutate(
      { id: editing.id, payload: { message } },
      {
        onSuccess: () => {
          setEditing(null);
          setMessage("");
        },
      }
    );
  };

  const confirmDelete = () => {
    deleteMutation.mutate(deleting.id, {
      onSuccess: () => setDeleting(null),
    });
  };

  const loading = sentQuery.isLoading || receivedQuery.isLoading;
  
  const sentCount = sentQuery.data?.data?.length || 0;
  const receivedCount = receivedQuery.data?.data?.length || 0;
  const students = studentsQuery?.data?.data || [];

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="overflow-hidden rounded-3xl border border-primary/20 bg-linear-to-br from-primary/15 via-background to-sky-500/10 p-6"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Communication Hub</p>
            <h1 className="mt-2 text-2xl font-bold text-foreground sm:text-3xl">Messages</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Send and receive messages with students. Communicate with individuals or entire classes.
            </p>
          </div>
          <Button onClick={() => setOpen(true)} className="gap-2">
            <Send size={16} />
            New Message
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-border/70 bg-background/60 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Sent Messages</p>
                <p className="mt-1 text-2xl font-bold text-foreground">{sentCount}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Mail size={18} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border/70 bg-background/60 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Received Messages</p>
                <p className="mt-1 text-2xl font-bold text-foreground">{receivedCount}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Inbox size={18} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border/70 bg-background/60 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Students Available</p>
                <p className="mt-1 text-2xl font-bold text-foreground">{students.length}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Users size={18} />
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Tabs */}
      <div className="rounded-3xl border border-border/70 bg-card/95 p-5 shadow-sm backdrop-blur-sm">
        <Tabs value={tab} onValueChange={(value: any) => { setTab(value); setPage(1); }} className="w-full">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="sent" className="gap-2">
              <Mail size={14} />
              Sent
              {sentCount > 0 && (
                <Badge variant="secondary" className="ml-1 px-1.5 py-0.5 text-xs">
                  {sentCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="received" className="gap-2">
              <Inbox size={14} />
              Received
              {receivedCount > 0 && (
                <Badge variant="secondary" className="ml-1 px-1.5 py-0.5 text-xs">
                  {receivedCount}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Messages List */}
      <div className="rounded-3xl border border-border/70 bg-card overflow-hidden shadow-sm backdrop-blur-sm">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
              <div className="text-muted-foreground">Loading messages...</div>
            </div>
          </div>
        ) : paginated.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
            <p className="text-base font-medium text-foreground">No messages yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {tab === "sent" ? "You haven't sent any messages yet." : "No messages received yet."}
            </p>
            {tab === "sent" && (
              <Button onClick={() => setOpen(true)} variant="outline" className="mt-4 gap-2">
                <Send size={14} />
                Send your first message
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="divide-y divide-border">
              {paginated.map((msg: any, idx: number) => {
                const isSpecific = Array.isArray(msg.recipient_ids) && msg.recipient_ids.length > 0;
                const initials = msg.sender?.name?.charAt(0) || 'T';
                
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: idx * 0.03 }}
                    className="p-4 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <Avatar className="h-10 w-10 border border-border/50 flex-shrink-0">
                        <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                          {tab === "sent" ? 'T' : initials}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-medium text-foreground">
                            {tab === "sent" ? "You" : msg.sender?.name || "Teacher"}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(msg.created_at)}
                          </span>
                          {tab === "sent" && (
                            isSpecific ? (
                              <Badge variant="secondary" className="text-xs">
                                To {msg.recipient_ids.length} Student{msg.recipient_ids.length > 1 ? 's' : ''}
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="text-xs">Course Students</Badge>
                            )
                          )}
                          {tab === "received" && (
                            <Badge variant={msg.sender?.role === "ADMIN" ? "default" : "secondary"} className="text-xs">
                              {msg.sender?.role || "ADMIN"}
                            </Badge>
                          )}
                        </div>
                        <p className="mt-1 text-sm text-foreground line-clamp-2">
                          {msg.message}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <Button size="icon" variant="ghost" onClick={() => setViewing(msg)} className="h-8 w-8">
                          <Eye className="h-4 w-4" />
                        </Button>
                        {tab === "sent" && (
                          <Button size="icon" variant="ghost" onClick={() => { setEditing(msg); setMessage(msg.message); }} className="h-8 w-8">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        )}
                        <Button size="icon" variant="ghost" onClick={() => setDeleting(msg)} className="h-8 w-8 text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Pagination */}
            {messages.length > PAGE_SIZE && (
              <div className="flex items-center justify-between border-t border-border px-4 py-4">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="gap-1"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Compose Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl rounded-3xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">New Message</DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto pr-2 -mr-2 space-y-4">
            {/* Recipient Type */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Recipient Type</label>
              <Select value={recipientType} onValueChange={(v: any) => setRecipientType(v)}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select recipient type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="course">Course Students</SelectItem>
                  <SelectItem value="specific">Specific Students</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Course Selection */}
            {recipientType === "course" && (
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Select Course</label>
                <Select onValueChange={(v) => setCourseId(Number(v))}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Select a course" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Computer Science 101</SelectItem>
                    <SelectItem value="2">Mathematics 201</SelectItem>
                    <SelectItem value="3">Physics 301</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Student Selection */}
            {recipientType === "specific" && (
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Select Students ({selectedStudents.length} selected)
                </label>
                <div className="rounded-2xl border border-border/70 bg-background/60 p-3 max-h-60 overflow-y-auto">
                  {studentsQuery?.isLoading ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  ) : students.length === 0 ? (
                    <p className="text-center text-sm text-muted-foreground py-4">No students found</p>
                  ) : (
                    <div className="space-y-1">
                      {students.map((s: any) => (
                        <label
                          key={s.id}
                          className="flex items-center gap-3 p-2 rounded-xl cursor-pointer hover:bg-accent/40 transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={selectedStudents.includes(s.id)}
                            onChange={() => toggleStudent(s.id)}
                            className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                          />
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-primary/10 text-primary text-xs">
                              {s.name?.charAt(0) || 'S'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-foreground">{s.name}</p>
                            {s.email && <p className="text-xs text-muted-foreground">{s.email}</p>}
                          </div>
                          {selectedStudents.includes(s.id) && (
                            <CheckCircle className="h-4 w-4 text-primary" />
                          )}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
                {selectedStudents.length > 0 && (
                  <p className="text-xs text-muted-foreground mt-2">
                    {selectedStudents.length} student{selectedStudents.length !== 1 ? 's' : ''} selected
                  </p>
                )}
              </div>
            )}

            {/* Message */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Message</label>
              <Textarea
                rows={6}
                placeholder="Write your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="resize-none rounded-xl"
              />
              <div className="flex justify-end mt-1">
                <span className="text-xs text-muted-foreground/50">
                  {message.length} characters
                </span>
              </div>
            </div>

            {/* Send Button */}
            <Button
              disabled={sendMutation.isPending || !message.trim() || (recipientType === 'course' && !courseId) || (recipientType === 'specific' && selectedStudents.length === 0)}
              onClick={send}
              className="w-full gap-2"
            >
              <Send className="h-4 w-4" />
              {sendMutation.isPending ? "Sending..." : "Send Message"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={!!viewing} onOpenChange={() => setViewing(null)}>
        <DialogContent className="max-w-lg rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Message Details</DialogTitle>
          </DialogHeader>
          <div className="rounded-2xl bg-muted/30 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="outline">
                {tab === "sent" ? "Sent by you" : `From ${viewing?.sender?.name || "Teacher"}`}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {viewing && formatDate(viewing.created_at)}
              </span>
            </div>
            <p className="whitespace-pre-wrap text-foreground">{viewing?.message}</p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editing} onOpenChange={() => setEditing(null)}>
        <DialogContent className="max-w-lg rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Edit Message</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="rounded-xl"
            />
            <Button 
              disabled={updateMutation.isPending} 
              onClick={update} 
              className="w-full gap-2"
            >
              <Pencil className="h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleting} onOpenChange={() => setDeleting(null)}>
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold">Delete Message</AlertDialogTitle>
          </AlertDialogHeader>
          <p className="text-muted-foreground">
            Are you sure you want to delete this message? This action cannot be undone.
          </p>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}