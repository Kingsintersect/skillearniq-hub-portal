



"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useAdminQueries } from "@/hooks/useAdminQueries";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

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

import {
  Eye,
  Trash2,
  Pencil,
  Send,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { formatDistanceToNow } from "date-fns";

const PAGE_SIZE = 10;

export default function AdminMessagesPage() {
  const {
    useSendMessage,
    useSentMessages,
    useReceivedMessages,
    useUpdateMessage,
    useDeleteMessage,
    useAllTeachers,
    useAllStudents,
    useAllParents,
  } = useAdminQueries();

  const sentQuery = useSentMessages();
  const receivedQuery = useReceivedMessages();

  const teachersQuery = useAllTeachers();
  const studentsQuery = useAllStudents();
  const parentsQuery = useAllParents();

  const sendMutation = useSendMessage();
  const updateMutation = useUpdateMessage();
  const deleteMutation = useDeleteMessage();

  const [tab, setTab] = useState<"sent" | "received">("sent");
  const [page, setPage] = useState(1);

  const [open, setOpen] = useState(false);
  const [viewing, setViewing] = useState<any>(null);
  const [editing, setEditing] = useState<any>(null);
  const [deleting, setDeleting] = useState<any>(null);

  const [message, setMessage] = useState("");

  const [recipientType, setRecipientType] = useState<any>("all_teachers");

  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  useEffect(() => {
    if (!open && !editing) setMessage("");
  }, [open, editing]);

  /* normalize messages */

  const messages = useMemo(() => {
    const raw = tab === "sent" ? sentQuery.data : receivedQuery.data;
    return Array.isArray(raw) ? raw : [];
  }, [tab, sentQuery.data, receivedQuery.data]);

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return messages.slice(start, start + PAGE_SIZE);
  }, [messages, page]);

  const totalPages = Math.ceil(messages.length / PAGE_SIZE);

  /* ✅ Normalize selectable users */

  const selectableUsers = useMemo(() => {
    let data: any[] = [];

    if (recipientType === "specific_teacher")
      data = teachersQuery.data ?? [];

    if (recipientType === "specific_student")
      data = studentsQuery.data ?? [];

    if (recipientType === "specific_parent")
      data = parentsQuery.data ?? [];

    return data.map((u) => ({
      id:
        u.id ??
        u.user_id ??
        u.parent_id ??
        u.teacher_id ??
        u.student_id,

      label: u.fullname ?? u.name ?? u.email,
    }));
  }, [recipientType, teachersQuery.data, studentsQuery.data, parentsQuery.data]);

  const toggleId = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  const formatDate = (d: string) =>
    formatDistanceToNow(new Date(d), { addSuffix: true });

  /* ✅ SENT TAG FIX */

  const renderSentTag = (msg: any) => {
    const type = msg?.recipients?.[0]?.recipient_type;

    if (type === "teachers") return <Badge>Teachers</Badge>;
    if (type === "students") return <Badge>Students</Badge>;
    if (type === "parents") return <Badge>Parents</Badge>;

    if (recipientType === "specific_teacher")
      return <Badge variant="secondary">Specific Teachers</Badge>;

    if (recipientType === "specific_student")
      return <Badge variant="secondary">Specific Students</Badge>;

    if (recipientType === "specific_parent")
      return <Badge variant="secondary">Specific Parents</Badge>;

    return <Badge variant="secondary">Recipients</Badge>;
  };

  /* ✅ RECEIVED TAG FIX */

  const renderReceivedTag = (msg: any) => {
    const role =
      msg.sender?.role ??
      msg.sender_role ??
      msg.sender_type ??
      "ADMIN";

    return <Badge>{role}</Badge>;
  };

  /* actions */

  const send = () => {
    if (!message.trim()) return;

    const payload: any = {
      recipient_type: recipientType,
      message,
    };

    if (recipientType.startsWith("specific")) {
      if (selectedIds.length === 0) {
        alert("Select at least one recipient");
        return;
      }

      payload.recipient_ids = selectedIds;
    }

    sendMutation.mutate(payload, {
      onSuccess: () => {
        setOpen(false);
        setMessage("");
        setSelectedIds([]);
      },
    });
  };

  const update = () => {
    updateMutation.mutate(
      { id: editing.id, message },
      { onSuccess: () => setEditing(null) }
    );
  };

  const confirmDelete = () => {
    deleteMutation.mutate(deleting.id, {
      onSuccess: () => setDeleting(null),
    });
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <section className="relative overflow-hidden rounded-3xl bg-primary p-6 text-white sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 h-52 w-52 rounded-full bg-white/5" />
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-300">Communication</p>
          <h1 className="mt-2 text-2xl font-bold sm:text-3xl">Admin Messaging</h1>
          <p className="mt-2 text-sm text-white/75">Send and review messages across the school.</p>
        </div>
      </section>

      <div className="flex gap-2">
        <Button
          variant={tab === "sent" ? "default" : "outline"}
          onClick={() => {
            setTab("sent");
            setPage(1);
          }}
        >
          Sent
        </Button>

        <Button
          variant={tab === "received" ? "default" : "outline"}
          onClick={() => {
            setTab("received");
            setPage(1);
          }}
        >
          Received
        </Button>

        <Button className="ml-auto" onClick={() => setOpen(true)}>
          New Message
        </Button>
      </div>

      {/* LIST */}

      <div className="border rounded-lg overflow-hidden">
        {paginated.map((msg: any) => (
          <div
            key={msg.id}
            className="grid grid-cols-5 items-center p-4 border-b"
          >
            {tab === "sent"
              ? renderSentTag(msg)
              : renderReceivedTag(msg)}

            <span className="truncate">{msg.message}</span>

            <span className="text-sm text-muted-foreground">
              {formatDate(msg.created_at)}
            </span>

            <Button size="icon" variant="ghost" onClick={() => setViewing(msg)}>
              <Eye className="h-4 w-4" />
            </Button>

            {/* ✅ DELETE FOR BOTH */}
            <div className="flex gap-2 justify-end">
              {tab === "sent" && (
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => {
                    setEditing(msg);
                    setMessage(msg.message);
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              )}

              <Button
                size="icon"
                variant="destructive"
                onClick={() => setDeleting(msg)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* COMPOSE */}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Message</DialogTitle>
          </DialogHeader>

          <Select
            value={recipientType}
            onValueChange={(v: any) => {
              setRecipientType(v);
              setSelectedIds([]);
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all_teachers">All Teachers</SelectItem>
              <SelectItem value="all_students">All Students</SelectItem>
              <SelectItem value="all_parents">All Parents</SelectItem>
              <SelectItem value="specific_teacher">Specific Teachers</SelectItem>
              <SelectItem value="specific_student">Specific Students</SelectItem>
              <SelectItem value="specific_parent">Specific Parents</SelectItem>
            </SelectContent>
          </Select>

          {recipientType.startsWith("specific") && (
            <div className="border rounded-md max-h-60 overflow-y-auto p-2">
              {selectableUsers.map((u) => (
                <label key={u.id} className="flex gap-2 items-center p-1">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(u.id)}
                    onChange={() => toggleId(u.id)}
                  />
                  {u.label}
                </label>
              ))}
            </div>
          )}

          <Textarea
            rows={5}
            placeholder="Write message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <Button onClick={send}>
            <Send className="mr-2 h-4 w-4" />
            Send Message
          </Button>
        </DialogContent>
      </Dialog>

     {/* VIEW */}

      <Dialog open={!!viewing} onOpenChange={() => setViewing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Message</DialogTitle>
          </DialogHeader>
          <p className="whitespace-pre-wrap">{viewing?.message}</p>
        </DialogContent>
      </Dialog>

      {/* EDIT */}

      <Dialog open={!!editing} onOpenChange={() => setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Message</DialogTitle>
          </DialogHeader>

          <Textarea
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <Button onClick={update}>Save Changes</Button>
        </DialogContent>
      </Dialog>

      {/* DELETE */}

      <AlertDialog open={!!deleting} onOpenChange={() => setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this message?</AlertDialogTitle>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white"
              onClick={confirmDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}
