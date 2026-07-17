"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
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
import { getErrorMessage, OtpInput, OTP_LENGTH } from "@/modules/shared";
import { resetPasswordSchema, type ResetPasswordFormValues } from "../schemas";
import { useResetPassword } from "../hooks/use-auth-mutations";
import { PasswordStrengthMeter } from "./password-strength-meter";
import { AuthLayout } from "./auth-layout";

export interface ResetPasswordFormProps {
  resetReference: string;
  identityLabel: string;
  onSuccess: () => void;
}

export function ResetPasswordForm({
  resetReference,
  identityLabel,
  onSuccess,
}: ResetPasswordFormProps) {
  const [showPassword, setShowPassword] = React.useState(false);
  const resetMutation = useResetPassword();

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { otp_code: "", password: "", password_confirmation: "" },
  });

  const password = form.watch("password");
  const otpCode = form.watch("otp_code");

  const onSubmit = (values: ResetPasswordFormValues) => {
    resetMutation.mutate(
      { reset_reference: resetReference, ...values },
      { onSuccess }
    );
  };

  return (
    <AuthLayout
      title="Set a new password"
      description={`Enter the code sent to ${identityLabel}`}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="otp_code"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <OtpInput
                    length={OTP_LENGTH}
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage className="text-center" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New password</FormLabel>
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
                <FormLabel>Confirm new password</FormLabel>
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

          {resetMutation.error && (
            <p className="text-sm text-destructive">
              {getErrorMessage(resetMutation.error)}
            </p>
          )}

          <p className="text-xs text-muted-foreground">
            Resetting your password will sign you out of all other devices.
          </p>

          <Button
            type="submit"
            className="w-full"
            disabled={resetMutation.isPending || otpCode.length < OTP_LENGTH}
          >
            {resetMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Update password
          </Button>
        </form>
      </Form>
    </AuthLayout>
  );
}
