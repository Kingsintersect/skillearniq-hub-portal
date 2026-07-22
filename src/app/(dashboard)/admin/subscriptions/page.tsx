"use client";

import * as React from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Loader2, PackageOpen, Gift, Sparkles } from "lucide-react";
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

type PlanWithDuration = PlanData & { duration_months: number | null };

// ─── Presets ─────────────────────────────────────────────────────────────────

const PLAN_PRESETS = [
    { key: "free", label: "Free", name: "Free Plan", price: 0, max_members: 1, duration_months: null },
    { key: "standard", label: "Standard", name: "Standard", price: 10000, max_members: 1, duration_months: 3 },
    { key: "subscriber", label: "Subscriber", name: "Subscriber", price: 20000, max_members: 3, duration_months: 3 },
    { key: "family", label: "Family", name: "Family Plan", price: 30000, max_members: 5, duration_months: 3 },
] as const;

// ─── Schema & Types ──────────────────────────────────────────────────────────

const planSchema = z
    .object({
        name: z.string().min(2, "Name must be at least 2 characters"),
        price: z.coerce.number().min(0, "Price can't be negative"),
        max_members: z.coerce.number().int().min(1, "Must allow at least 1 member"),
        is_active: z.boolean(),
        duration_months: z.coerce.number().int().positive().nullable(),
    })
    .transform((values) => ({
        ...values,
        duration_months: values.price === 0 ? null : values.duration_months ?? 3,
    }));

type PlanFormValues = {
    name: string;
    price: number;
    max_members: number;
    is_active: boolean;
    duration_months: number | null;
};

type PlanFormOutput = z.output<typeof planSchema>;

// ─── Hooks ───────────────────────────────────────────────────────────────────

function usePlansAdmin() {
    return useQuery({
        queryKey: queryKeys.admin.plans,
        queryFn: () => authApi.getPlans(),
        select: (res) => res.data.data as PlanWithDuration[],
    });
}

function useCreatePlan() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (payload: PlanFormOutput) => authApi.createPlan(payload),
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
        mutationFn: ({ id, payload }: { id: number; payload: PlanFormOutput }) =>
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
    editingPlan?: PlanWithDuration | null;
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
            duration_months: 3,
        },
    });

    const price = form.watch("price");
    const isFree = Number(price) === 0;

    React.useEffect(() => {
        if (open) {
            form.reset(
                editingPlan
                    ? {
                        name: editingPlan.name,
                        price: editingPlan.price,
                        max_members: editingPlan.max_members,
                        is_active: editingPlan.is_active,
                        duration_months: editingPlan.duration_months ?? 3,
                    }
                    : { name: "", price: 0, max_members: 1, is_active: true, duration_months: 3 }
            );
        }
    }, [open, editingPlan, form]);

    const applyPreset = (preset: (typeof PLAN_PRESETS)[number]) => {
        form.reset({
            name: preset.name,
            price: preset.price,
            max_members: preset.max_members,
            is_active: true,
            duration_months: preset.duration_months ?? 3,
        });
    };

    const onSubmit = (values: PlanFormValues) => {
        const parsed = planSchema.parse(values);

        if (isEdit && editingPlan) {
            updateMutation.mutate(
                { id: editingPlan.id, payload: parsed },
                { onSuccess: () => onOpenChange(false) }
            );
        } else {
            createMutation.mutate(parsed, {
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

                {!isEdit && (
                    <div className="flex flex-wrap gap-2">
                        {PLAN_PRESETS.map((preset) => (
                            <Button
                                key={preset.key}
                                type="button"
                                size="sm"
                                variant="outline"
                                className="gap-1.5"
                                onClick={() => applyPreset(preset)}
                            >
                                {preset.key === "free" && <Gift className="h-3.5 w-3.5" />}
                                {preset.label}
                            </Button>
                        ))}
                    </div>
                )}

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
                                            <Input
                                                type="number"
                                                min={0}
                                                placeholder="0 for free"
                                                {...field}
                                                onChange={(e) => field.onChange(Number(e.target.value))}
                                            />
                                        </FormControl>
                                        <p className="text-xs text-muted-foreground">
                                            {isFree ? "Free plan — no charge." : "Enter 0 to make this a free plan."}
                                        </p>
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
                                            <Input
                                                type="number"
                                                min={1}
                                                placeholder="4"
                                                {...field}
                                                onChange={(e) => field.onChange(Number(e.target.value))}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="duration_months"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Access Duration</FormLabel>
                                    {isFree ? (
                                        <div className="flex items-center gap-2 rounded-lg border border-dashed border-border bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
                                            <Sparkles className="h-3.5 w-3.5 shrink-0 text-accent-500" />
                                            Indefinite access — free plans never expire.
                                        </div>
                                    ) : (
                                        <>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    min={1}
                                                    value={field.value ?? 3}
                                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                                />
                                            </FormControl>
                                            <p className="text-xs text-muted-foreground">
                                                Subscribers get access for this many months, then must renew.
                                                Standard interval is 3 months.
                                            </p>
                                        </>
                                    )}
                                </FormItem>
                            )}
                        />

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
    const [editingPlan, setEditingPlan] = React.useState<PlanWithDuration | null>(null);
    const [deletingPlan, setDeletingPlan] = React.useState<PlanWithDuration | null>(null);

    const openCreate = () => {
        setEditingPlan(null);
        setDialogOpen(true);
    };

    const openEdit = (plan: PlanWithDuration) => {
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
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold text-foreground">Subscription Plans</h1>
                    <p className="text-sm text-muted-foreground">
                        Manage the plans subscribers can choose from.
                    </p>
                </div>
                <Button onClick={openCreate}>
                    <Plus className="mr-2 h-4 w-4" />
                    New Plan
                </Button>
            </div>

            {/* Table */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Max Members</TableHead>
                            <TableHead>Duration</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="w-24 text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                                    <Loader2 className="mx-auto mb-2 h-5 w-5 animate-spin" />
                                    Loading plans…
                                </TableCell>
                            </TableRow>
                        ) : !plans?.length ? (
                            <TableRow>
                                <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                                    <PackageOpen className="mx-auto mb-2 h-6 w-6 opacity-40" />
                                    No plans yet. Create one to get started.
                                </TableCell>
                            </TableRow>
                        ) : (
                            plans.map((plan) => {
                                const isFree = plan.price === 0;
                                return (
                                    <TableRow key={plan.id}>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-2">
                                                {plan.name}
                                                {isFree && (
                                                    <Badge className="gap-1 bg-accent-100 text-accent-800 hover:bg-accent-100 dark:bg-accent-400/15 dark:text-accent-300">
                                                        <Gift className="h-3 w-3" />
                                                        Free
                                                    </Badge>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {isFree ? "₦0" : `₦${plan.price.toLocaleString()}`}
                                        </TableCell>
                                        <TableCell>{plan.max_members}</TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {isFree || plan.duration_months == null
                                                ? "Indefinite"
                                                : `${plan.duration_months} month${plan.duration_months === 1 ? "" : "s"}`}
                                        </TableCell>
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
                                );
                            })
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