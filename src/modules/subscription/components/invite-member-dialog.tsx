"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { getErrorMessage } from "@/modules/shared";
import { sendInvitationSchema, type SendInvitationFormValues } from "../schemas";
import { useSendInvitation } from "../hooks/use-subscription";

export interface InviteMemberDialogProps {
  availableSlots: number;
}

export function InviteMemberDialog({ availableSlots }: InviteMemberDialogProps) {
  const [open, setOpen] = React.useState(false);
  const sendInvitationMutation = useSendInvitation();

  const form = useForm<SendInvitationFormValues>({
    resolver: zodResolver(sendInvitationSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = (values: SendInvitationFormValues) => {
    sendInvitationMutation.mutate(values, {
      onSuccess: () => {
        setOpen(false);
        form.reset();
      },
    });
  };

  const isFull = availableSlots <= 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" disabled={isFull}>
          <UserPlus className="mr-2 h-4 w-4" />
          Invite member
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite a member</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email address</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="friend@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {sendInvitationMutation.error && (
              <p className="text-sm text-destructive">
                {getErrorMessage(sendInvitationMutation.error)}
              </p>
            )}

            <p className="text-xs text-muted-foreground">
              The invitation link is valid for 72 hours and reserves a slot
              until it's accepted or revoked.
            </p>

            <DialogFooter>
              <Button type="submit" disabled={sendInvitationMutation.isPending}>
                {sendInvitationMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Send invitation
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
