"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useParentQueries } from "@/hooks/useParentQueries";

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
  Eye,
  Trash2,
  Pencil,
  Send,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { formatDistanceToNow } from "date-fns";

const PAGE_SIZE = 10;

export default function ParentMessagesPage() {
  const {
    useSentMessages,
    useReceivedMessages,
    useSendMessage,
    useDeleteMessage,
    useUpdateMessage,
  } = useParentQueries();

  const sentQuery = useSentMessages();
  const receivedQuery = useReceivedMessages();


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

  useEffect(() => {
    if (!open && !editing) {
      setMessage("");
    }
  }, [open, editing]);

  const messages = useMemo(() => {
    const raw = tab === "sent" ? sentQuery.data : receivedQuery.data;
    return Array.isArray(raw) ? raw : [];
  }, [tab, sentQuery.data, receivedQuery.data]);

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return messages.slice(start, start + PAGE_SIZE);
  }, [messages, page]);

  const totalPages = Math.ceil(messages.length / PAGE_SIZE);
  const send = () => {
    if (!message.trim()) return;

    sendMutation.mutate(
      {
        recipient_type: "parent_to_admin",
        recipient_ids: [1], 
        message,
      },
      {
        onSuccess: () => {
          setOpen(false);
          setMessage("");
        },
      },
    );
  };

  const update = () => {
    if (!editing) return;

    updateMutation.mutate(
      {
        id: editing.id,
        payload: { message },
      },
      {
        onSuccess: () => {
          setEditing(null);
          setMessage("");
        },
      },
    );
  };

  const confirmDelete = () => {
    deleteMutation.mutate(deleting.id, {
      onSuccess: () => setDeleting(null),
    });
  };

  const formatDate = (d: string) =>
    formatDistanceToNow(new Date(d), { addSuffix: true });

  const loading = sentQuery.isLoading || receivedQuery.isLoading;

  const empty = !loading && messages.length === 0;

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Parent Messaging</h1>

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

      <div className="border rounded-lg overflow-hidden">
        {loading && (
          <div className="p-10 text-center text-muted-foreground">
            Loading messages...
          </div>
        )}


        {empty && (
          <div className="p-10 text-center text-muted-foreground">
            No messages yet.
          </div>
        )}

       

        {paginated.map((msg: any) => (
          <div
            key={msg.id}
            className="grid grid-cols-5 items-center p-4 border-b hover:bg-muted/40"
          >
            <Badge variant="secondary">
              {tab === "sent" ? "To Admin" : (msg.sender?.role ?? "ADMIN")}
            </Badge>

            <span className="truncate">{msg.message}</span>

            <span className="text-sm text-muted-foreground">
              {formatDate(msg.created_at)}
            </span>

            <Button size="icon" variant="ghost" onClick={() => setViewing(msg)}>
              <Eye className="h-4 w-4" />
            </Button>

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

      {messages.length > PAGE_SIZE && (
        <div className="flex justify-between">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Prev
          </Button>

          <span>
            Page {page} of {totalPages}
          </span>

          <Button
            variant="outline"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}


      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Message</DialogTitle>
          </DialogHeader>

          <Textarea
            rows={5}
            placeholder="Write your message to the admin..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <Button disabled={sendMutation.isPending} onClick={send}>
            <Send className="mr-2 h-4 w-4" />

            {sendMutation.isPending ? "Sending..." : "Send Message"}
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog open={!!viewing} onOpenChange={() => setViewing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Message</DialogTitle>
          </DialogHeader>

          <p className="whitespace-pre-wrap">{viewing?.message}</p>
        </DialogContent>
      </Dialog>

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

          <Button disabled={updateMutation.isPending} onClick={update}>
            {updateMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleting} onOpenChange={() => setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this message?</AlertDialogTitle>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>

            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
