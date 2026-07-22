"use client";



import * as React from "react";

import { useForm, type Resolver } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { z } from "zod";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Plus, Pencil, Trash2, Loader2, TicketX } from "lucide-react";

import { toast } from "sonner";



import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Badge } from "@/components/ui/badge";

import {

    Select,

    SelectContent,

    SelectItem,

    SelectTrigger,

    SelectValue,

} from "@/components/ui/select";

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

import type { AdminCouponData } from "@/modules/auth";



// ─── Schema ──────────────────────────────────────────────────────────────────



const couponSchema = z.object({

    code: z

        .string()

        .min(2, "Code must be at least 2 characters")

        .toUpperCase(),

    type: z.enum(["fixed", "percentage"], { message: "Select a discount type" }),

    value: z.coerce.number().positive("Value must be greater than 0"),

    expires_at: z.string().optional(),

});



type CouponFormValues = z.infer<typeof couponSchema>;



// ─── Hooks ───────────────────────────────────────────────────────────────────



function useAdminCoupons() {
    return useQuery({
        queryKey: queryKeys.admin.coupons,
        queryFn: () => authApi.listAdminCoupons(),
        select: (res): AdminCouponData[] => {
            // In case the API sometimes returns undefined or null for data
            return (res.data as unknown as AdminCouponData[]) || [];
        },
    });
}



function useCreateCoupon() {

    const qc = useQueryClient();

    return useMutation({

        mutationFn: (payload: CouponFormValues) => authApi.createCoupon(payload),

        onSuccess: () => {

            qc.invalidateQueries({ queryKey: queryKeys.admin.coupons });

            toast.success("Coupon created.");

        },

        onError: (err: any) => toast.error(err?.message ?? "Failed to create coupon."),

    });

}



function useUpdateCoupon() {

    const qc = useQueryClient();

    return useMutation({

        mutationFn: ({ id, payload }: { id: number; payload: CouponFormValues }) =>

            authApi.updateCoupon(id, payload),

        onSuccess: () => {

            qc.invalidateQueries({ queryKey: queryKeys.admin.coupons });

            toast.success("Coupon updated.");

        },

        onError: (err: any) => toast.error(err?.message ?? "Failed to update coupon."),

    });

}



function useDeleteCoupon() {

    const qc = useQueryClient();

    return useMutation({

        mutationFn: (id: number) => authApi.deleteCoupon(id),

        onSuccess: () => {

            qc.invalidateQueries({ queryKey: queryKeys.admin.coupons });

            toast.success("Coupon deleted.");

        },

        onError: (err: any) => toast.error(err?.message ?? "Failed to delete coupon."),

    });

}



// ─── Coupon Form Dialog ───────────────────────────────────────────────────────



interface CouponDialogProps {

    open: boolean;

    onOpenChange: (v: boolean) => void;

    editingCoupon?: AdminCouponData | null;

}



function CouponDialog({ open, onOpenChange, editingCoupon }: CouponDialogProps) {

    const isEdit = !!editingCoupon;

    const createMutation = useCreateCoupon();

    const updateMutation = useUpdateCoupon();

    const isPending = createMutation.isPending || updateMutation.isPending;



    const form = useForm<CouponFormValues>({

        resolver: zodResolver(couponSchema) as Resolver<CouponFormValues>,

        defaultValues: { code: "", type: "fixed", value: 0, expires_at: "" },

    });



    React.useEffect(() => {
        if (open) {
            form.reset(
                editingCoupon
                    ? {
                        code: editingCoupon.code,
                        type: editingCoupon.type,
                        // 🛠️ Convert the string to a number for the form
                        value: Number(editingCoupon.value),
                        expires_at: editingCoupon.expires_at ?? "",
                    }
                    : { code: "", type: "fixed", value: 0, expires_at: "" }
            );
        }
    }, [open, editingCoupon, form]);



    const onSubmit = (values: CouponFormValues) => {

        const payload = { ...values, expires_at: values.expires_at || undefined };

        if (isEdit && editingCoupon) {

            updateMutation.mutate(

                { id: editingCoupon.id, payload },

                { onSuccess: () => onOpenChange(false) }

            );

        } else {

            createMutation.mutate(payload, { onSuccess: () => onOpenChange(false) });

        }

    };



    return (

        <Dialog open={open} onOpenChange={onOpenChange}>

            <DialogContent className="sm:max-w-md">

                <DialogHeader>

                    <DialogTitle>{isEdit ? "Edit Coupon" : "New Coupon"}</DialogTitle>

                </DialogHeader>



                <Form {...form}>

                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                        <FormField

                            control={form.control}

                            name="code"

                            render={({ field }) => (

                                <FormItem>

                                    <FormLabel>Code</FormLabel>

                                    <FormControl>

                                        <Input

                                            placeholder="e.g. SUMMER100"

                                            {...field}

                                            onChange={(e) =>

                                                field.onChange(e.target.value.toUpperCase())

                                            }

                                        />

                                    </FormControl>

                                    <FormMessage />

                                </FormItem>

                            )}

                        />



                        <div className="grid grid-cols-2 gap-4">

                            <FormField

                                control={form.control}

                                name="type"

                                render={({ field }) => (

                                    <FormItem>

                                        <FormLabel>Type</FormLabel>

                                        <Select value={field.value} onValueChange={field.onChange}>

                                            <FormControl>

                                                <SelectTrigger>

                                                    <SelectValue placeholder="Select type" />

                                                </SelectTrigger>

                                            </FormControl>

                                            <SelectContent>

                                                <SelectItem value="fixed">Fixed (₦)</SelectItem>

                                                <SelectItem value="percentage">Percentage (%)</SelectItem>

                                            </SelectContent>

                                        </Select>

                                        <FormMessage />

                                    </FormItem>

                                )}

                            />



                            <FormField

                                control={form.control}

                                name="value"

                                render={({ field }) => (

                                    <FormItem>

                                        <FormLabel>Value</FormLabel>

                                        <FormControl>

                                            <Input type="number" min={0} placeholder="5000" {...field} />

                                        </FormControl>

                                        <FormMessage />

                                    </FormItem>

                                )}

                            />

                        </div>



                        <FormField

                            control={form.control}

                            name="expires_at"

                            render={({ field }) => (

                                <FormItem>

                                    <FormLabel>

                                        Expiry Date{" "}

                                        <span className="text-muted-foreground font-normal">(optional)</span>

                                    </FormLabel>

                                    <FormControl>

                                        <Input type="date" {...field} />

                                    </FormControl>

                                    <FormMessage />

                                </FormItem>

                            )}

                        />



                        <DialogFooter>

                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>

                                Cancel

                            </Button>

                            <Button type="submit" disabled={isPending}>

                                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}

                                {isEdit ? "Save Changes" : "Create Coupon"}

                            </Button>

                        </DialogFooter>

                    </form>

                </Form>

            </DialogContent>

        </Dialog>

    );

}



// ─── Page ─────────────────────────────────────────────────────────────────────



export default function AdminCouponsPage() {

    const { data: coupons, isLoading } = useAdminCoupons();

    const deleteMutation = useDeleteCoupon();



    const [dialogOpen, setDialogOpen] = React.useState(false);

    const [editingCoupon, setEditingCoupon] = React.useState<AdminCouponData | null>(null);

    const [deletingCoupon, setDeletingCoupon] = React.useState<AdminCouponData | null>(null);



    const openCreate = () => { setEditingCoupon(null); setDialogOpen(true); };

    const openEdit = (c: AdminCouponData) => { setEditingCoupon(c); setDialogOpen(true); };



    const confirmDelete = () => {

        if (!deletingCoupon) return;

        deleteMutation.mutate(deletingCoupon.id, {

            onSuccess: () => setDeletingCoupon(null),

        });

    };



    const formatValue = (c: AdminCouponData) =>

        c.type === "fixed" ? `₦${c.value.toLocaleString()}` : `${c.value}%`;



    return (

        <div className="space-y-6">

            {/* Header */}
            <section className="relative overflow-hidden rounded-3xl bg-primary p-6 text-white sm:p-8">
                <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/5" />
                <div className="pointer-events-none absolute -bottom-20 -left-10 h-52 w-52 rounded-full bg-white/5" />
                <div className="relative flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-300">Promotions</p>
                        <h1 className="mt-2 text-2xl font-bold sm:text-3xl">Coupons</h1>
                        <p className="mt-2 text-sm text-white/75">
                            Create and manage discount codes for subscribers.
                        </p>
                    </div>
                    <Button onClick={openCreate} variant="secondary">
                        <Plus className="mr-2 h-4 w-4" />
                        New Coupon
                    </Button>
                </div>
            </section>



            {/* Table */}

            <div className="rounded-md border">

                <Table>

                    <TableHeader>

                        <TableRow>

                            <TableHead>Code</TableHead>

                            <TableHead>Type</TableHead>

                            <TableHead>Value</TableHead>

                            <TableHead>Expires</TableHead>

                            <TableHead>Status</TableHead>

                            <TableHead className="w-24 text-right">Actions</TableHead>

                        </TableRow>

                    </TableHeader>

                    <TableBody>

                        {isLoading ? (

                            <TableRow>

                                <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">

                                    <Loader2 className="mx-auto mb-2 h-5 w-5 animate-spin" />

                                    Loading coupons…

                                </TableCell>

                            </TableRow>

                        ) : !coupons?.length ? (

                            <TableRow>

                                <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">

                                    <TicketX className="mx-auto mb-2 h-6 w-6 opacity-40" />

                                    No coupons yet. Create one to get started.

                                </TableCell>

                            </TableRow>

                        ) : (

                            coupons.map((coupon) => (

                                <TableRow key={coupon.id}>

                                    <TableCell className="font-mono font-semibold tracking-wide">

                                        {coupon.code}

                                    </TableCell>

                                    <TableCell className="capitalize">{coupon.type}</TableCell>

                                    <TableCell>{formatValue(coupon)}</TableCell>

                                    <TableCell className="text-sm text-muted-foreground">

                                        {coupon.expires_at ?? "—"}

                                    </TableCell>

                                    <TableCell>

                                        <Badge variant={coupon.is_active ? "default" : "secondary"}>

                                            {coupon.is_active ? "Active" : "Inactive"}

                                        </Badge>

                                    </TableCell>

                                    <TableCell className="text-right">

                                        <div className="flex justify-end gap-1">

                                            <Button size="icon" variant="ghost" onClick={() => openEdit(coupon)}>

                                                <Pencil className="h-4 w-4" />

                                            </Button>

                                            <Button

                                                size="icon"

                                                variant="ghost"

                                                className="text-destructive hover:text-destructive"

                                                onClick={() => setDeletingCoupon(coupon)}

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



            <CouponDialog open={dialogOpen} onOpenChange={setDialogOpen} editingCoupon={editingCoupon} />



            <AlertDialog open={!!deletingCoupon} onOpenChange={(v) => !v && setDeletingCoupon(null)}>

                <AlertDialogContent>

                    <AlertDialogHeader>

                        <AlertDialogTitle>Delete &ldquo;{deletingCoupon?.code}&rdquo;?</AlertDialogTitle>

                        <AlertDialogDescription>

                            This coupon will be permanently removed and can no longer be redeemed.

                        </AlertDialogDescription>

                    </AlertDialogHeader>

                    <AlertDialogFooter>

                        <AlertDialogCancel>Cancel</AlertDialogCancel>

                        <AlertDialogAction

                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"

                            onClick={confirmDelete}

                            disabled={deleteMutation.isPending}

                        >

                            {deleteMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}

                            Delete

                        </AlertDialogAction>

                    </AlertDialogFooter>

                </AlertDialogContent>

            </AlertDialog>

        </div>

    );

}