"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { getErrorMessage } from "@/modules/shared";
import {
  registerCompleteSchema,
  type RegisterCompleteFormValues,
} from "../schemas";
import type { RegistrableRole } from "../types";

export interface ProfileCompletionStepProps {
  role: RegistrableRole;
  onSubmit: (values: RegisterCompleteFormValues) => void;
  isPending: boolean;
  serverError?: unknown;
}

/**
 * Only students see the parent-link toggle. Submitting parent details here
 * triggers Rule Block 2 server-side: either passive-creates a pending parent
 * account, or links to an existing parent account via the mapping table.
 */
export function ProfileCompletionStep({
  role,
  onSubmit,
  isPending,
  serverError,
}: ProfileCompletionStepProps) {
  const form = useForm<RegisterCompleteFormValues>({
    resolver: zodResolver(registerCompleteSchema),
    defaultValues: {
      gender: undefined,
      nationality: "",
      other_names: "",
      wantsParentLink: false,
      parent_first_name: "",
      parent_last_name: "",
      parent_email: "",
      parent_phone_number: "",
    },
  });

  const wantsParentLink = form.watch("wantsParentLink");

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => onSubmit(values))}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gender</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="nationality"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nationality</FormLabel>
              <FormControl>
                <Input placeholder="Nigerian" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="other_names"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Other names (optional)</FormLabel>
              <FormControl>
                <Input placeholder="Middle name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {role === "student" && (
          <div className="rounded-lg border border-border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">
                  Link a parent
                </p>
                <p className="text-xs text-muted-foreground">
                  Let a parent monitor your progress and billing
                </p>
              </div>
              <FormField
                control={form.control}
                name="wantsParentLink"
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    aria-label="Link a parent"
                  />
                )}
              />
            </div>

            <AnimatePresence initial={false}>
              {wantsParentLink && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 space-y-3 border-t border-border pt-4">
                    <div className="grid grid-cols-2 gap-3">
                      <FormField
                        control={form.control}
                        name="parent_first_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Parent first name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="parent_last_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Parent last name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="parent_email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Parent email</FormLabel>
                          <FormControl>
                            <Input type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="parent_phone_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Parent phone (optional)</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <p className="text-xs text-muted-foreground">
                      If this email doesn't have an account yet, we'll create
                      a pending parent account and invite them.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {Boolean(serverError) && (
          <p className="text-sm text-destructive">
            {getErrorMessage(serverError)}
          </p>
        )}

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Complete registration
        </Button>
      </form>
    </Form>
  );
}
