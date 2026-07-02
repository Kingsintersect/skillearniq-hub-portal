'use client';

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, BarChart3 } from "lucide-react";

export default function LoadingState() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28 }}
        >
            <Card className="bg-card border-border/70 rounded-3xl shadow-sm backdrop-blur-sm">
                <CardContent className="pt-6">
                    <div className="flex flex-col items-center justify-center py-16">
                        <div className="relative mb-6">
                            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted/30">
                                <BarChart3 className="h-10 w-10 text-muted-foreground/60" />
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        </div>
                        <h3 className="text-xl font-semibold mb-2 text-card-foreground">
                            Loading Grade Data
                        </h3>
                        <p className="text-muted-foreground text-center">
                            Please wait while we fetch the student grade information.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}