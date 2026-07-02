'use client';

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, Filter, BookOpen } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  message?: string;
}

export default function EmptyState({ 
  title = "No Data Available", 
  message = "Select a course from the filter above to view student grade data." 
}: EmptyStateProps) {
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
              <div className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Filter className="h-4 w-4" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-card-foreground">
              {title}
            </h3>
            <p className="text-muted-foreground text-center max-w-md">
              {message}
            </p>
            <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
              <BookOpen className="h-4 w-4" />
              <span>Select a course from the dropdown above</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}