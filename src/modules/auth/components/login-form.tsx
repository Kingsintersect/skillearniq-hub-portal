"use client";

import * as React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, Fingerprint } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { getErrorMessage } from "@/modules/shared";
import { loginSchema, type LoginFormValues } from "../schemas";
import { useLogin } from "../hooks/use-auth-mutations";
import type { LoginData } from "../types";
import { AuthLayout } from "./auth-layout";

export interface LoginFormProps {
  /**
   * Called with the raw API response after a successful login.
   * Used by the page layer to handle MFA branching and navigation.
   * Only fired when `onSubmitOverride` is NOT provided.
   */
  onSuccess?: (data: LoginData, identity: string) => void;
  /**
   * When provided, the form skips its internal mutation entirely and
   * delegates submission to this handler (e.g. useAuthContext().login()).
   * `isPending` and `error` from the external handler are passed back via
   * the `externalState` prop pair below.
   */
  onSubmitOverride?: (values: LoginFormValues) => void;
  /** Loading state from the external handler, shown on the submit button. */
  isPending?: boolean;
  /** Error from the external handler, shown below the form. */
  error?: unknown;
  registerHref?: string;
  forgotPasswordHref?: string;
}

export function LoginForm({
  onSuccess,
  onSubmitOverride,
  isPending: externalIsPending,
  error: externalError,
  registerHref = "/auth/register",
  forgotPasswordHref = "/auth/forgot-password",
}: LoginFormProps) {
  const [showPassword, setShowPassword] = React.useState(false);
  // Only mount the internal mutation when no external override is provided
  const loginMutation = useLogin();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email_or_phone_number: "", password: "" },
  });

  const onSubmit = (values: LoginFormValues) => {
    if (onSubmitOverride) {
      // alert("LoginForm: onSubmit called with values: " + JSON.stringify(values));
      onSubmitOverride(values);
      return;
    }
    loginMutation.mutate(values, {
      onSuccess: (response) =>
        onSuccess?.(response.data, values.email_or_phone_number),
    });
  };

  const isPending =
    onSubmitOverride ? (externalIsPending ?? false) : loginMutation.isPending;
  const error = onSubmitOverride ? externalError : loginMutation.error;

  return (
    <AuthLayout title="Sign in to your account" description="Enter your credentials to access the courseware." Icon={Fingerprint}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 font-outfit">
          <FormField
            control={form.control}
            name="email_or_phone_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email or phone number</FormLabel>
                <FormControl>
                  <Input autoComplete="username" {...field} />
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
                <div className="flex items-center justify-between">
                  <FormLabel>Password</FormLabel>
                  <Link
                    href={forgotPasswordHref}
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute inset-y-0 right-2 flex items-center text-muted-foreground"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {Boolean(error) && (
            <p className="text-sm text-destructive">
              {getErrorMessage(error)}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign in
          </Button>
        </form>
      </Form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href={registerHref}
          className="font-medium text-primary hover:underline"
        >
          Sign up
        </Link>
      </p>
    </AuthLayout>
  );
}
