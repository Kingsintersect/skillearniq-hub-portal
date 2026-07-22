'use client';

import React, { useMemo, useState } from "react";
import { useStudentQueries } from "@/hooks/useStudentQueries";
import { motion } from "framer-motion";

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
  Eye,
  Trash2,
  Pencil,
  Send,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Inbox,
  Mail,
  Users,
  Loader2,
  AlertCircle,
} from "lucide-react";

import { formatDistanceToNow } from "date-fns";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const PAGE_SIZE = 10;

export default function StudentMessagesPage() {
  const {
    useSentMessages,
    useReceivedMessages,
    useSendMessage,
    useDeleteMessage,
    useUpdateMessage,
    useTeachers,
  } = useStudentQueries();

  /* ---------------- QUERIES ---------------- */
  const sentQuery = useSentMessages();
  const receivedQuery = useReceivedMessages();
  const teachersQuery = useTeachers();

  /* ---------------- MUTATIONS ---------------- */
  const sendMutation = useSendMessage();
  const deleteMutation = useDeleteMessage();
  const updateMutation = useUpdateMessage();

  /* ---------------- STATE ---------------- */
  const [tab, setTab] = useState<"sent" | "received">("sent");
  const [page, setPage] = useState(1);

  const [open, setOpen] = useState(false);
  const [viewing, setViewing] = useState<any>(null);
  const [editing, setEditing] = useState<any>(null);
  const [deleting, setDeleting] = useState<any>(null);

  const [message, setMessage] = useState("");
  const [selectedTeachers, setSelectedTeachers] = useState<number[]>([]);

  /* ---------------- SAFE TEACHERS ---------------- */
  type Teacher = { id: number; name: string; email?: string; avatar?: string };
  type TeachersApiShape = Teacher[] | { studentTeachers?: { data: Teacher[] } };

  const teachers = useMemo(() => {
    const raw = teachersQuery.data?.data as TeachersApiShape | undefined;
    if (Array.isArray(raw)) return raw;
    if (raw?.studentTeachers?.data) return raw.studentTeachers.data;
    return [];
  }, [teachersQuery.data]);

  /* ---------------- MESSAGES ---------------- */
  const messages = useMemo(() => {
    const raw = tab === "sent" ? sentQuery.data?.data : receivedQuery.data?.data;
    return Array.isArray(raw) ? raw : [];
  }, [tab, sentQuery.data, receivedQuery.data]);

  /* ---------------- PAGINATION ---------------- */
  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return messages.slice(start, start + PAGE_SIZE);
  }, [messages, page]);

  const totalPages = Math.max(1, Math.ceil(messages.length / PAGE_SIZE));

  /* ---------------- ACTIONS ---------------- */
  const toggleTeacher = (id: number) => {
    setSelectedTeachers((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const send = () => {
    if (!message.trim()) {
      alert("Please write a message");
      return;
    }
    if (!selectedTeachers.length) {
      alert("Select at least one teacher");
      return;
    }

    sendMutation.mutate(
      {
        recipient_type: "student_to_teacher",
        recipient_ids: selectedTeachers,
        message,
      },
      {
        onSuccess: () => {
          setOpen(false);
          setMessage("");
          setSelectedTeachers([]);
        },
      }
    );
  };

  const update = () => {
    if (!editing) return;
    updateMutation.mutate(
      { id: editing.id, payload: { message } },
      { onSuccess: () => { setEditing(null); setMessage(""); } }
    );
  };

  const confirmDelete = () => {
    if (!deleting) return;
    deleteMutation.mutate(deleting.id, { onSuccess: () => setDeleting(null) });
  };

  const formatDate = (d: string) => formatDistanceToNow(new Date(d), { addSuffix: true });

  const isLoading = sentQuery.isLoading || receivedQuery.isLoading;
  const sentCount = sentQuery.data?.data?.length || 0;
  const receivedCount = receivedQuery.data?.data?.length || 0;

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="relative overflow-hidden rounded-3xl bg-primary p-6 text-white sm:p-8"
      >
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-16 -right-10 h-56 w-56 rounded-full bg-white/5" />
          <div className="absolute -bottom-24 -left-12 h-72 w-72 rounded-full bg-white/5" />
        </div>

        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-300">Communication Hub</span>
            <h1 className="mt-2 text-2xl font-bold sm:text-3xl">Messages</h1>
            <p className="mt-2 max-w-2xl text-sm text-white/75">
              Send and receive messages with your teachers. Track all your conversations in one place.
            </p>
          </div>
          <Button onClick={() => setOpen(true)} variant="varsecondary" className="gap-2">
            <Send size={16} />
            New Message
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="relative mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            { label: "Sent Messages", value: sentCount, icon: <Mail size={18} /> },
            { label: "Received Messages", value: receivedCount, icon: <Inbox size={18} /> },
            { label: "Teachers Available", value: teachers.length, icon: <Users size={18} /> },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-white/60">{stat.label}</p>
                  <p className="mt-1 text-2xl font-bold text-white">{stat.value}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 text-white">
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Tabs */}
      <div className="rounded-3xl border border-border/70 bg-card/95 p-5 shadow-sm">
        <Tabs value={tab} onValueChange={(value: any) => { setTab(value); setPage(1); }} className="w-full">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="sent" className="gap-2">
              <Mail size={14} />
              Sent
            </TabsTrigger>
            <TabsTrigger value="received" className="gap-2">
              <Inbox size={14} />
              Received
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Messages List */}
      <div className="rounded-3xl border border-border/70 bg-card overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
              <div className="text-muted-foreground">Loading messages...</div>
            </div>
          </div>
        ) : messages.length === 0 ? (
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
              {paginated.map((msg: any, idx: number) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: idx * 0.03 }}
                  className="p-4 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant={tab === "sent" ? "default" : "secondary"}>
                          {tab === "sent" ? "To Teacher" : msg.sender?.role ?? "Teacher"}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(msg.created_at)}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-foreground line-clamp-2">
                        {msg.message}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
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
              ))}
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
        <DialogContent className="max-w-lg font-outfit rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl">New Message</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <p className="mb-2 text-sm font-medium text-foreground">Select Recipients</p>
              <div className="max-h-60 overflow-y-auto rounded-2xl border border-border bg-background/60 p-2 space-y-1">
                {teachersQuery.isLoading && (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                )}
                {!teachers.length && !teachersQuery.isLoading && (
                  <p className="py-4 text-center text-sm text-muted-foreground">No teachers found.</p>
                )}
                {teachers.map((teacher: any) => (
                  <label
                    key={teacher.id}
                    className="flex items-center gap-3 rounded-xl p-2 cursor-pointer hover:bg-accent/40 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedTeachers.includes(teacher.id)}
                      onChange={() => toggleTeacher(teacher.id)}
                      className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                    />
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        {teacher.name?.charAt(0) || 'T'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-foreground">{teacher.name}</p>
                      {teacher.email && <p className="text-xs text-muted-foreground">{teacher.email}</p>}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium text-foreground">Message</p>
              <Textarea
                placeholder="Write your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="resize-none rounded-2xl"
              />
            </div>

            <Button onClick={send} disabled={sendMutation.isPending} className="w-full gap-2">
              <Send size={16} />
              {sendMutation.isPending ? "Sending..." : "Send Message"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={!!viewing} onOpenChange={() => setViewing(null)}>
        <DialogContent className="max-w-lg rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl">Message Details</DialogTitle>
          </DialogHeader>
          <div className="rounded-2xl bg-muted/30 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="outline">
                {tab === "sent" ? "Sent by you" : `From ${viewing?.sender?.role ?? "Teacher"}`}
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
            <DialogTitle className="text-xl">Edit Message</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="resize-none rounded-2xl"
            />
            <Button onClick={update} disabled={updateMutation.isPending} className="w-full gap-2">
              <Pencil size={16} />
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleting} onOpenChange={() => setDeleting(null)}>
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">Delete Message</AlertDialogTitle>
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