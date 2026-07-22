"use client";

import * as React from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Loader2, PackageOpen } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { queryKeys } from "@/modules/shared";
import { authApi } from "@/modules/auth";
import type { PlanData } from "@/modules/auth";

// ─── Schema ──────────────────────────────────────────────────────────────────

const planSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    price: z.coerce.number().positive("Price must be greater than 0"),
    max_members: z.coerce.number().int().min(1, "Must allow at least 1 member"),
    is_active: z.boolean(),
});

type PlanFormValues = z.infer<typeof planSchema>;

// ─── Hooks ───────────────────────────────────────────────────────────────────

function usePlansAdmin() {
    return useQuery({
        queryKey: queryKeys.admin.plans,
        queryFn: () => authApi.getPlans(),
        select: (res) => res.data.data,
    });
}

function useCreatePlan() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (payload: PlanFormValues) => authApi.createPlan(payload),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: queryKeys.admin.plans });
            toast.success("Plan created successfully.");
        },
        onError: (err: any) => toast.error(err?.message ?? "Failed to create plan."),
    });
}

function useUpdatePlan() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: PlanFormValues }) =>
            authApi.updatePlan(id, payload),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: queryKeys.admin.plans });
            toast.success("Plan updated successfully.");
        },
        onError: (err: any) => toast.error(err?.message ?? "Failed to update plan."),
    });
}

function useDeletePlan() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => authApi.deletePlan(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: queryKeys.admin.plans });
            toast.success("Plan deleted.");
        },
        onError: (err: any) => toast.error(err?.message ?? "Failed to delete plan."),
    });
}

// ─── Plan Form Dialog ─────────────────────────────────────────────────────────

interface PlanDialogProps {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    editingPlan?: PlanData | null;
}

function PlanDialog({ open, onOpenChange, editingPlan }: PlanDialogProps) {
    const isEdit = !!editingPlan;
    const createMutation = useCreatePlan();
    const updateMutation = useUpdatePlan();
    const isPending = createMutation.isPending || updateMutation.isPending;

    const form = useForm<PlanFormValues>({
        resolver: zodResolver(planSchema) as Resolver<PlanFormValues>,
        defaultValues: {
            name: "",
            price: 0,
            max_members: 1,
            is_active: true,
        },
    });

    React.useEffect(() => {
        if (open) {
            form.reset(
                editingPlan
                    ? {
                        name: editingPlan.name,
                        price: editingPlan.price,
                        max_members: editingPlan.max_members,
                        is_active: editingPlan.is_active,
                    }
                    : { name: "", price: 0, max_members: 1, is_active: true }
            );
        }
    }, [open, editingPlan, form]);

    const onSubmit = (values: PlanFormValues) => {
        if (isEdit && editingPlan) {
            updateMutation.mutate(
                { id: editingPlan.id, payload: values },
                { onSuccess: () => onOpenChange(false) }
            );
        } else {
            createMutation.mutate(values, {
                onSuccess: () => onOpenChange(false),
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{isEdit ? "Edit Plan" : "New Subscription Plan"}</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Plan Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. Family Package" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Price (₦)</FormLabel>
                                        <FormControl>
                                            <Input type="number" min={0} placeholder="20000" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="max_members"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Max Members</FormLabel>
                                        <FormControl>
                                            <Input type="number" min={1} placeholder="4" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="is_active"
                            render={({ field }) => (
                                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                                    <div>
                                        <FormLabel className="text-sm font-medium">Active</FormLabel>
                                        <p className="text-xs text-muted-foreground">
                                            Inactive plans are hidden from subscribers.
                                        </p>
                                    </div>
                                    <FormControl>
                                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isPending}>
                                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isEdit ? "Save Changes" : "Create Plan"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminSubscriptionsPage() {
    const { data: plans, isLoading } = usePlansAdmin();
    const deleteMutation = useDeletePlan();

    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [editingPlan, setEditingPlan] = React.useState<PlanData | null>(null);
    const [deletingPlan, setDeletingPlan] = React.useState<PlanData | null>(null);

    const openCreate = () => {
        setEditingPlan(null);
        setDialogOpen(true);
    };

    const openEdit = (plan: PlanData) => {
        setEditingPlan(plan);
        setDialogOpen(true);
    };

    const confirmDelete = () => {
        if (!deletingPlan) return;
        deleteMutation.mutate(deletingPlan.id, {
            onSuccess: () => setDeletingPlan(null),
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <section className="relative overflow-hidden rounded-3xl bg-primary p-6 text-white sm:p-8">
                <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/5" />
                <div className="pointer-events-none absolute -bottom-20 -left-10 h-52 w-52 rounded-full bg-white/5" />
                <div className="relative flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-300">Billing</p>
                        <h1 className="mt-2 text-2xl font-bold sm:text-3xl">Subscription Plans</h1>
                        <p className="mt-2 text-sm text-white/75">
                            Manage the plans subscribers can choose from.
                        </p>
                    </div>
                    <Button onClick={openCreate} variant="secondary">
                        <Plus className="mr-2 h-4 w-4" />
                        New Plan
                    </Button>
                </div>
            </section>

            {/* Table */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Max Members</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="w-24 text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                                    <Loader2 className="mx-auto mb-2 h-5 w-5 animate-spin" />
                                    Loading plans…
                                </TableCell>
                            </TableRow>
                        ) : !plans?.length ? (
                            <TableRow>
                                <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                                    <PackageOpen className="mx-auto mb-2 h-6 w-6 opacity-40" />
                                    No plans yet. Create one to get started.
                                </TableCell>
                            </TableRow>
                        ) : (
                            plans.map((plan) => (
                                <TableRow key={plan.id}>
                                    <TableCell className="font-medium">{plan.name}</TableCell>
                                    <TableCell>₦{plan.price.toLocaleString()}</TableCell>
                                    <TableCell>{plan.max_members}</TableCell>
                                    <TableCell>
                                        <Badge variant={plan.is_active ? "default" : "secondary"}>
                                            {plan.is_active ? "Active" : "Inactive"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-1">
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                onClick={() => openEdit(plan)}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="text-destructive hover:text-destructive"
                                                onClick={() => setDeletingPlan(plan)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Create / Edit Dialog */}
            <PlanDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                editingPlan={editingPlan}
            />

            {/* Delete Confirmation */}
            <AlertDialog open={!!deletingPlan} onOpenChange={(v) => !v && setDeletingPlan(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete &ldquo;{deletingPlan?.name}&rdquo;?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently remove the plan. Existing subscribers will not be
                            affected, but no new subscriptions can be created with this plan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={confirmDelete}
                            disabled={deleteMutation.isPending}
                        >
                            {deleteMutation.isPending && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
