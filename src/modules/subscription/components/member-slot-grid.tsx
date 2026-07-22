"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Crown, Plus } from "lucide-react";

export interface Member {
  user_id: number;
  name?: string;
}

export interface MemberSlotGridGroup {
  active_members: Member[];
  available_slots: number;
}

export interface MemberSlotGridProps {
  group: MemberSlotGridGroup;
  isOwner: boolean;
}

function initials(name?: string) {
  if (!name) return "?";
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

export function MemberSlotGrid({ group, isOwner }: MemberSlotGridProps) {
  const reduceMotion = useReducedMotion();
  const emptySeats = Array.from({ length: group.available_slots });

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-white/50">
        Members
      </p>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {group.active_members.map((member, index) => (
          <motion.div
            key={member.user_id}
            initial={reduceMotion ? false : { opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: reduceMotion ? 0 : index * 0.05,
              type: "spring",
              stiffness: 400,
              damping: 22,
            }}
            whileHover={reduceMotion ? undefined : { y: -2 }}
            className="relative flex flex-col items-center gap-1.5 rounded-xl border border-[#1FAE7A]/30 bg-[#E1F7EE] px-2 py-3 text-center dark:border-[#1FAE7A]/25 dark:bg-[#1FAE7A]/10"
          >
            {/* TODO: replace with a real owner check once owner_id is available */}
            {index === 0 && (
              <Crown className="absolute -top-2 right-1 h-3.5 w-3.5 text-[#FB6801]" fill="#FB6801" />
            )}
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#293073] text-xs font-semibold text-white">
              {initials(member.name)}
            </div>
            <p className="w-full truncate text-[11px] font-medium text-slate-700 dark:text-white/70">
              {member.name ?? "Member"}
            </p>
          </motion.div>
        ))}

        {emptySeats.map((_, i) => (
          <motion.div
            key={`empty-${i}`}
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: reduceMotion ? 0 : (group.active_members.length + i) * 0.05 }}
            className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-slate-300 px-2 py-3 text-center text-slate-400 dark:border-white/15 dark:text-white/30"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-dashed border-slate-300 dark:border-white/15">
              <Plus className="h-4 w-4" />
            </div>
            <p className="text-[11px]">Open seat</p>
          </motion.div>
        ))}
      </div>
      {!isOwner && (
        <p className="text-[11px] text-slate-400 dark:text-white/30">
          Only the squad owner can invite new members.
        </p>
      )}
    </div>
  );
}
