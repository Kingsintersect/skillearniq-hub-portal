"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Home, Loader2, LucideIcon, TimerReset } from "lucide-react";
import { motion } from "framer-motion";
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
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "../schemas";
import { useForgotPassword } from "../hooks/use-auth-mutations";
import { AuthLayout } from "./auth-layout";

export interface ForgotPasswordFormProps {
  /** Called with the reset_reference once the request succeeds, to drive navigation to the reset step. */
  onRequested: (resetReference: string, identity: string) => void;
  loginHref?: string;
}

export function ForgotPasswordForm({
  onRequested,
  loginHref = "/auth/signin",
}: ForgotPasswordFormProps) {
  const forgotPasswordMutation = useForgotPassword();

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { identity: "" },
  });

  const onSubmit = (values: ForgotPasswordFormValues) => {
    forgotPasswordMutation.mutate(values, {
      onSuccess: (response) =>
        onRequested(response.data.reset_reference, values.identity),
    });
  };

  if (forgotPasswordMutation.isSuccess) {
    return (
      <AuthLayout title="Check your inbox" description="">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-3 py-4 text-center"
        >
          <CheckCircle2 className="h-10 w-10 text-secondary-600" />
          <p className="text-sm text-muted-foreground">
            If an account exists for that email or phone number, we've sent a
            reset code.
          </p>
        </motion.div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Reset your password"
      description="We'll send a code to verify it's you"
      Icon={TimerReset}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="identity"
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

          {forgotPasswordMutation.error && (
            <p className="text-sm text-destructive">
              {getErrorMessage(forgotPasswordMutation.error)}
            </p>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={forgotPasswordMutation.isPending}
          >
            {forgotPasswordMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Send reset code
          </Button>
        </form>
      </Form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Remembered your password?{" "}
        <Link href={loginHref} className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
