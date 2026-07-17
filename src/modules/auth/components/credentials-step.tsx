"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { getFieldErrors, getErrorMessage } from "@/modules/shared";
import {
  registerInitializeSchema,
  type RegisterInitializeFormValues,
} from "../schemas";
import { PasswordStrengthMeter } from "./password-strength-meter";
import type { RegistrableRole } from "../types";

export interface CredentialsStepProps {
  role: RegistrableRole;
  onSubmit: (values: RegisterInitializeFormValues) => void;
  isPending: boolean;
  serverError?: unknown;
  onBack: () => void;
}

export function CredentialsStep({
  role,
  onSubmit,
  isPending,
  serverError,
  onBack,
}: CredentialsStepProps) {
  const [showPassword, setShowPassword] = React.useState(false);

  const form = useForm<RegisterInitializeFormValues>({
    resolver: zodResolver(registerInitializeSchema),
    defaultValues: {
      role: role,
      first_name: "",
      last_name: "",
      email_or_phone_number: "",
      password: "",
      password_confirmation: "",
    },
  });

  // Map server-side field errors (e.g. duplicate email) onto the form.
  React.useEffect(() => {
    const fieldErrors = getFieldErrors(serverError);
    if (!fieldErrors) return;
    Object.entries(fieldErrors).forEach(([field, messages]) => {
      if (field in form.getValues()) {
        form.setError(field as keyof RegisterInitializeFormValues, {
          message: messages[0],
        });
      }
    });
  }, [serverError, form]);

  const password = form.watch("password");

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => onSubmit(values))}
        className="space-y-4"
      >
        <div className="grid grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First name</FormLabel>
                <FormControl>
                  <Input placeholder="John" autoComplete="given-name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last name</FormLabel>
                <FormControl>
                  <Input placeholder="Doe" autoComplete="family-name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email_or_phone_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email or phone number</FormLabel>
              <FormControl>
                <Input
                  placeholder="johndoe@example.com"
                  autoComplete="username"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    {...field}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute inset-y-0 right-2 flex items-center text-muted-foreground"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </FormControl>
              <PasswordStrengthMeter password={password} />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password_confirmation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm password</FormLabel>
              <FormControl>
                <Input
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {Boolean(serverError) && !getFieldErrors(serverError) && (
          <p className="text-sm text-destructive">
            {getErrorMessage(serverError)}
          </p>
        )}

        <div className="flex gap-2 pt-1">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={onBack}
            disabled={isPending}
          >
            Back
          </Button>
          <Button type="submit" className="flex-1" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Continue
          </Button>
        </div>
      </form>
    </Form>
  );
}
