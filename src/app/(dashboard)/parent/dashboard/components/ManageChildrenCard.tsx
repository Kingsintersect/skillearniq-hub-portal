"use client";

import * as React from "react";
import { Loader2, UserPlus, Trash2, Mail, Users, Clock, CheckCircle2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useParentQueries } from "@/hooks/useParentQueries";
import { useChildSelectorStore, type SelectableChild } from "@/store/childSelectorStore";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function StatusBadge({ status }: { status: SelectableChild["status"] }) {
  if (status === "accepted") {
    return (
      <Badge className="gap-1 border-transparent bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
        <CheckCircle2 className="h-3 w-3" />
        Accepted
      </Badge>
    );
  }
  if (status === "declined") {
    return (
      <Badge className="gap-1 border-transparent bg-destructive/15 text-destructive">
        Declined
      </Badge>
    );
  }
  return (
    <Badge className="gap-1 border-transparent bg-amber-500/15 text-amber-600 dark:text-amber-400">
      <Clock className="h-3 w-3" />
      Pending
    </Badge>
  );
}

export function ManageChildrenCard() {
  const { useManagedChildren, useAddChild, useRemoveChild } = useParentQueries();
  const { isLoading } = useManagedChildren();
  const addChild = useAddChild();
  const removeChild = useRemoveChild();

  const children = useChildSelectorStore((s) => s.children);

  const [email, setEmail] = React.useState("");
  const [touched, setTouched] = React.useState(false);

  const isValid = EMAIL_RE.test(email.trim());
  const alreadyLinked = children.some(
    (c) => c.email.toLowerCase() === email.trim().toLowerCase()
  );

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || alreadyLinked) {
      setTouched(true);
      return;
    }
    addChild.mutate(email.trim(), {
      onSuccess: () => {
        setEmail("");
        setTouched(false);
      },
    });
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Users className="h-5 w-5 text-primary" />
          My Children
        </CardTitle>
        <CardDescription>
          Add a child by their student email. They&apos;ll appear here once they
          accept — only accepted children are shown across your dashboard.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Add by email */}
        <form onSubmit={handleAdd} className="space-y-2">
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative flex-1">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="email"
                inputMode="email"
                autoComplete="off"
                placeholder="child@student-email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched(true)}
                className="pl-9"
                aria-invalid={touched && !!email && (!isValid || alreadyLinked)}
              />
            </div>
            <Button
              type="submit"
              className="gap-1.5 sm:w-auto"
              disabled={addChild.isPending || !email}
            >
              {addChild.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <UserPlus className="h-4 w-4" />
              )}
              Add child
            </Button>
          </div>
          {touched && email && !isValid && (
            <p className="text-xs text-destructive">Enter a valid email address.</p>
          )}
          {touched && email && isValid && alreadyLinked && (
            <p className="text-xs text-destructive">This child is already linked.</p>
          )}
        </form>

        {/* Children list */}
        {isLoading ? (
          <div className="flex items-center justify-center py-6 text-sm text-muted-foreground">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading your children…
          </div>
        ) : children.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border py-8 text-center">
            <Users className="mx-auto mb-2 h-8 w-8 text-muted-foreground/60" />
            <p className="text-sm font-medium text-foreground">No children yet</p>
            <p className="text-sm text-muted-foreground">
              Add your first child using their email above.
            </p>
          </div>
        ) : (
          <ul className="space-y-2">
            {children.map((child) => (
              <li
                key={child.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card/60 p-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    {`${child.first_name?.[0] ?? ""}${child.last_name?.[0] ?? ""}`.toUpperCase() ||
                      "S"}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {child.first_name} {child.last_name}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {child.email}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <StatusBadge status={child.status} />
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                        aria-label={`Remove ${child.first_name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Remove {child.first_name} {child.last_name}?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          You&apos;ll no longer see this child&apos;s information.
                          You can add them again later with their email.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => removeChild.mutate(child.email)}
                          className="bg-destructive text-white hover:bg-destructive/90"
                        >
                          Remove
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
